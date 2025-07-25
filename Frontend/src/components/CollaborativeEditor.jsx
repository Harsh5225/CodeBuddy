/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef, useCallback } from "react";
import Editor from "@monaco-editor/react";
import { useSocket } from "../hooks/useSocket";
import { useSelector } from "react-redux";
import {
  Users,
  Wifi,
  WifiOff,
  MessageSquare,
  Play,
  Send,
  Copy,
  Check,
  X,
  Move,
} from "lucide-react";
import axiosClient from "../utils/axiosClient";

const CollaborativeEditor = ({
  problemId,
  roomId,
  initialCode = "",
  initialLanguage = "javascript",
  onCodeChange,
  onLanguageChange,
  onRunCode,
  onSubmitCode,
}) => {
  const { user } = useSelector((state) => state.auth);
  const { socket, isConnected, emit, on, off } = useSocket();
  const [code, setCode] = useState(initialCode);
  const [language, setLanguage] = useState(initialLanguage);
  const [roomUsers, setRoomUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [userCursors, setUserCursors] = useState(new Map());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const [userPresence, setUserPresence] = useState(new Map());
  const [showChat, setShowChat] = useState(false);
  const [roomLink, setRoomLink] = useState("");
  const [linkCopied, setLinkCopied] = useState(false);

  // Drag functionality state
  const [isDragging, setIsDragging] = useState(false);
  const [dragPosition, setDragPosition] = useState({ x: 16, y: 16 }); // Initial position (left-4, top-4)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const editorRef = useRef(null);
  const typingTimeoutRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);
  const editorContainerRef = useRef(null);

  // Generate room link
  useEffect(() => {
    if (roomId) {
      setRoomLink(`${window.location.origin}/collaborate/${roomId}`);
    }
  }, [roomId]);

  const hasJoinedRef = useRef(false);
  // Join room when component mounts
  useEffect(() => {
    if (!hasJoinedRef.current && socket && isConnected && roomId && user) {
      emit("join-room", {
        roomId,
        userId: user._id,
        userName: user.firstName,
        problemId,
      });
      hasJoinedRef.current = true;
    }
  }, [socket, isConnected, roomId, user, problemId, emit]);

  // Socket event listeners
  useEffect(() => {
    if (!socket) return;

    // Room state received
    on("room-state", (state) => {
      setCode(state.code || initialCode);
      setLanguage(state.language || initialLanguage);
      setRoomUsers(state.users || []);
      setMessages(state.messages || []);
      
      // Initialize typing users from state
      if (state.typingUsers) {
        setTypingUsers(new Set(state.typingUsers));
      }
      
      // Initialize user presence
      const presenceMap = new Map();
      (state.users || []).forEach(user => {
        presenceMap.set(user.id, {
          status: user.status || 'online',
          lastActivity: user.lastActivity || Date.now()
        });
      });
      setUserPresence(presenceMap);
    });

    // User joined
    on("user-joined", ({ user: newUser, totalUsers, onlineUsers }) => {
      setRoomUsers((prev) => [
        ...prev.filter((u) => u.id !== newUser.id),
        newUser,
      ]);
      
      // Update presence for new user
      setUserPresence(prev => {
        const newPresence = new Map(prev);
        newPresence.set(newUser.id, {
          status: newUser.status || 'online',
          lastActivity: newUser.lastActivity || Date.now()
        });
        return newPresence;
      });
      
      // Add system message
      const systemMessage = {
        id: Date.now().toString(),
        type: "system",
        message: `${newUser.name} joined the session`,
        userName: newUser.name,
        status: 'joined',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // User left
    on("user-left", ({ userId, userName, totalUsers, onlineUsers, typingUsers: updatedTypingUsers }) => {
      setRoomUsers((prev) => prev.filter((u) => u.id !== userId));
      
      // Remove from presence
      setUserPresence(prev => {
        const newPresence = new Map(prev);
        newPresence.delete(userId);
        return newPresence;
      });
      
      // Update typing users
      if (updatedTypingUsers) {
        setTypingUsers(new Set(updatedTypingUsers));
      }
      
      // Add system message
      const systemMessage = {
        id: Date.now().toString(),
        type: "system",
        message: `${userName} left the session`,
        userName: userName,
        status: 'left',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, systemMessage]);
    });

    // Code update from other users
    on("code-update", ({ code: newCode, userId }) => {
      if (userId !== user._id) {
        setCode(newCode);
        if (onCodeChange) onCodeChange(newCode);
      }
    });

    // Language update
    on("language-update", ({ language: newLanguage }) => {
      setLanguage(newLanguage);
      if (onLanguageChange) onLanguageChange(newLanguage);
    });

    // Cursor updates
    on("cursor-update", ({ userId, userName, position }) => {
      setUserCursors((prev) => {
        const newCursors = new Map(prev);
        newCursors.set(userId, { userName, position });
        return newCursors;
      });
    });

    // Typing indicators
    on("user-typing", ({ userId, userName, isTyping, typingUsers: updatedTypingUsers }) => {
      // Update typing users from server state
      if (updatedTypingUsers) {
        setTypingUsers(new Set(updatedTypingUsers));
      }
      
      // Update user activity
      setUserPresence(prev => {
        const newPresence = new Map(prev);
        if (newPresence.has(userId)) {
          newPresence.set(userId, {
            ...newPresence.get(userId),
            lastActivity: Date.now()
          });
        }
        return newPresence;
      });
    });

    // User presence updates
    on("user-presence-update", ({ userId, userName, status, lastActivity }) => {
      setUserPresence(prev => {
        const newPresence = new Map(prev);
        newPresence.set(userId, {
          status,
          lastActivity
        });
        return newPresence;
      });
      
      // Update room users status
      setRoomUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status, lastActivity }
            : user
        )
      );
    });

    // User status changed
    on("user-status-changed", ({ userId, userName, status, lastActivity }) => {
      setUserPresence(prev => {
        const newPresence = new Map(prev);
        newPresence.set(userId, {
          status,
          lastActivity
        });
        return newPresence;
      });
      
      // Update room users
      setRoomUsers(prev => 
        prev.map(user => 
          user.id === userId 
            ? { ...user, status, lastActivity }
            : user
        )
      );
      
      // Add system message for status changes
      if (status === 'away') {
        const systemMessage = {
          id: Date.now().toString(),
          type: "system",
          message: `${userName} is now away`,
          userName: userName,
          status: 'away',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      } else if (status === 'online') {
        const systemMessage = {
          id: Date.now().toString(),
          type: "system",
          message: `${userName} is back online`,
          userName: userName,
          status: 'online',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, systemMessage]);
      }
    });

    // New chat message
    on("new-message", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    // Execution result shared
    on("execution-shared", (executionMessage) => {
      setMessages((prev) => [...prev, executionMessage]);
    });

    // Cleanup
    return () => {
      off("room-state");
      off("user-joined");
      off("user-left");
      off("code-update");
      off("language-update");
      off("cursor-update");
      off("user-typing");
      off("user-presence-update");
      off("user-status-changed");
      off("new-message");
      off("execution-shared");
    };
  }, [
    socket,
    user,
    initialCode,
    initialLanguage,
    onCodeChange,
    onLanguageChange,
    on,
    off,
  ]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Drag functionality
  const handleMouseDown = useCallback((e) => {
    if (!chatRef.current || !editorContainerRef.current) return;

    const chatRect = chatRef.current.getBoundingClientRect();
    const containerRect = editorContainerRef.current.getBoundingClientRect();

    setIsDragging(true);
    setDragOffset({
      x: e.clientX - chatRect.left,
      y: e.clientY - chatRect.top,
    });

    e.preventDefault();
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDragging || !editorContainerRef.current || !chatRef.current)
        return;

      const containerRect = editorContainerRef.current.getBoundingClientRect();
      const chatRect = chatRef.current.getBoundingClientRect();

      // Calculate new position relative to the editor container
      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;

      // Boundary constraints
      const chatWidth = chatRect.width;
      const chatHeight = chatRect.height;
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;

      // Keep chat within bounds
      newX = Math.max(0, Math.min(newX, containerWidth - chatWidth));
      newY = Math.max(0, Math.min(newY, containerHeight - chatHeight));

      setDragPosition({ x: newX, y: newY });
    },
    [isDragging, dragOffset]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "grabbing";
      document.body.style.userSelect = "none";

      return () => {
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Reset chat position when chat is toggled
  useEffect(() => {
    if (showChat) {
      setDragPosition({ x: 16, y: 16 }); // Reset to initial position
    }
  }, [showChat]);

  // Handle editor changes
  const handleEditorChange = useCallback(
    (value) => {
      setCode(value || "");
      if (socket && isConnected && roomId) {
        emit("code-change", {
          roomId,
          code: value || "",
          changes: [], // Monaco provides change events, you can capture them if needed
        });
        
        // Send user activity update
        emit("user-activity", { roomId });
      }
      // Handle typing indicators
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      } else {
        emit("typing-start", { roomId });
      }
      typingTimeoutRef.current = setTimeout(() => {
        emit("typing-stop", { roomId });
        typingTimeoutRef.current = null;
      }, 1000);
      if (onCodeChange) onCodeChange(value || "");
    },
    [socket, isConnected, roomId, emit, onCodeChange]
  );

  // Handle language change
  const handleLanguageChange = useCallback(
    (newLanguage) => {
      setLanguage(newLanguage);
      if (socket && isConnected && roomId) {
        emit("language-change", { roomId, language: newLanguage });
      }
      if (onLanguageChange) onLanguageChange(newLanguage);
    },
    [socket, isConnected, roomId, emit, onLanguageChange]
  );

  // Get user status color
  const getUserStatusColor = (status) => {
    switch (status) {
      case 'online':
        return 'bg-blue-400';
      case 'away':
        return 'bg-yellow-400';
      case 'busy':
        return 'bg-red-400';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-blue-400';
    }
  };

  // Get user status text
  const getUserStatusText = (status) => {
    switch (status) {
      case 'online':
        return 'Online';
      case 'away':
        return 'Away';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Online';
    }
  };

  // Send user activity on various interactions
  const sendUserActivity = useCallback(() => {
    if (socket && isConnected && roomId) {
      emit("user-activity", { roomId });
    }
  }, [socket, isConnected, roomId, emit]);

  // Handle cursor position changes
  const handleCursorPositionChange = useCallback(
    (editor, position) => {
      if (socket && isConnected && roomId) {
        emit("cursor-change", {
          roomId,
          position: {
            line: position.lineNumber,
            column: position.column,
          },
        });
        
        // Send activity update
        sendUserActivity();
      }
    },
    [socket, isConnected, roomId, emit, sendUserActivity]
  );

  // Handle editor mount
  const handleEditorDidMount = useCallback(
    (editor) => {
      editorRef.current = editor;
      // Listen for cursor position changes
      editor.onDidChangeCursorPosition((e) => {
        handleCursorPositionChange(editor, e.position);
      });
    },
    [handleCursorPositionChange]
  );

  // Send chat message
  const sendMessage = () => {
    if (!newMessage.trim() || !socket || !isConnected) return;
    emit("send-message", {
      roomId,
      message: newMessage.trim(),
    });
    setNewMessage("");
  };

  // Share execution result
  const shareExecutionResult = (result, type) => {
    if (socket && isConnected && roomId) {
      emit("share-execution", {
        roomId,
        result,
        type,
      });
    }
  };

  // Handle run code - pass current code to parent
  const handleRunCode = async () => {
    if (onRunCode) {
      const result = await onRunCode(code); // Pass current code
      shareExecutionResult(result, "run");
    }
  };

  // Handle submit code - pass current code to parent
  const handleSubmitCode = async () => {
    if (onSubmitCode) {
      const result = await onSubmitCode(code); // Pass current code
      shareExecutionResult(result, "submit");
    }
  };

  // Copy room link
  const copyRoomLink = async () => {
    try {
      await navigator.clipboard.writeText(roomLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };


  // Get language for Monaco
  const getLanguageForMonaco = (lang) => {
    switch (lang) {
      case "javascript":
        return "javascript";
      case "java":
        return "java";
      case "cpp":
        return "cpp";
      case "python":
        return "python";
      default:
        return "javascript";
    }
  };

    useEffect(() => {
    const fetchProblem = async () => {
      try {
        const response = await axiosClient.get(`/problem/${problemId}`);
        console.log("fetchProblem", response.data);

        const initialCode = response.data.startCode.find(
          (sc) =>
            sc.language.toLowerCase() ===
            language.toLowerCase()
        ).initialCode;
        
        setCode(initialCode);
     
      } catch (error) {
        console.error("Error fetching problem:", error);
       
      }
    };

    fetchProblem();
  }, [problemId]);

  return (
    <div className="relative flex flex-col h-full w-full">
      {/* Collaboration Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-800/50 border-b border-gray-600/30 gap-3 sm:gap-0">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4 w-full sm:w-auto">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <Wifi className="w-4 h-4 text-blue-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span
              className={`text-sm font-medium ${
                isConnected ? "text-blue-400" : "text-red-400"
              }`}
            >
              {isConnected ? "Connected" : "Disconnected"}
            </span>
          </div>

          {/* Active Users */}
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">
              {roomUsers.length} user{roomUsers.length !== 1 ? "s" : ""}
            </span>
            {/* Enhanced User Avatars with Status */}
            <div className="flex -space-x-2">
              {roomUsers.slice(0, 3).map((roomUser) => (
                <div 
                  key={roomUser.id}
                  className="relative group"
                >
                  <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center border-2 border-gray-800 text-white text-xs font-bold">
                    {roomUser.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Status Indicator */}
                  <div 
                    className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 sm:w-3 sm:h-3 rounded-full border border-gray-800 ${getUserStatusColor(roomUser.status || 'online')}`}
                    title={`${roomUser.name} - ${getUserStatusText(roomUser.status || 'online')}`}
                  ></div>
                  
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {roomUser.name} - {getUserStatusText(roomUser.status || 'online')}
                    {typingUsers.has(roomUser.name) && (
                      <span className="text-blue-400 ml-1">(typing...)</span>
                    )}
                  </div>
                </div>
              ))}
              {roomUsers.length > 3 && (
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gray-600 rounded-full flex items-center justify-center border-2 border-gray-800 text-white text-xs">
                  +{roomUsers.length - 3}
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Typing Indicators */}
          {typingUsers.size > 0 && (
            <div className="flex items-center space-x-2 text-sm text-gray-400 bg-gray-800/30 px-3 py-1 rounded-full">
              <div className="flex space-x-1">
                <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                <div
                  className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
              <span className="text-xs">
                {Array.from(typingUsers).slice(0, 2).join(", ")}
                {typingUsers.size > 2 && ` +${typingUsers.size - 2} more`}
                {typingUsers.size === 1 ? " is" : " are"} typing...
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
          {/* Share Room Link */}
          <button
            onClick={copyRoomLink}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-lg transition-colors duration-200 text-sm"
          >
            {linkCopied ? (
              <Check className="w-4 h-4" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">
              {linkCopied ? "Copied!" : "Share"}
            </span>
          </button>

          {/* Toggle Chat */}
          <button
            onClick={() => setShowChat(!showChat)}
            className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 text-sm relative ${
              showChat
                ? "bg-blue-600 text-white"
                : "bg-gray-700/50 hover:bg-gray-600/50 text-gray-200"
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Chat</span>
            {messages.filter((m) => m.type === "message").length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {messages.filter((m) => m.type === "message").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Language Selector and Action Buttons */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 sm:p-4 border-b border-gray-700/50 bg-gray-800/20 gap-3 sm:gap-0">
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {["javascript", "java", "cpp"].map((lang) => (
            <button
              key={lang}
              className={`px-3 py-2 sm:px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                language === lang
                  ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white shadow-lg"
                  : "bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white"
              }`}
              onClick={() => handleLanguageChange(lang)}
            >
              {lang === "cpp"
                ? "C++"
                : lang === "javascript"
                ? "JS"
                : lang.charAt(0).toUpperCase() + lang.slice(1)}
            </button>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
          <button
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-gray-700/50 hover:bg-gray-600/50 text-gray-200 rounded-lg transition-all duration-200 font-medium hover:scale-105"
            onClick={handleRunCode}
          >
            <Play className="w-4 h-4" />
            <span>Run</span>
          </button>
          <button
            className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 text-white rounded-lg transition-all duration-200 font-medium shadow-lg hover:scale-105"
            onClick={handleSubmitCode}
          >
            <Send className="w-4 h-4" />
            <span>Submit</span>
          </button>
        </div>
      </div>

      {/* Main Editor Area */}
      <div ref={editorContainerRef} className="flex-1 bg-gray-900 relative">
        <Editor
          height="100%"
          language={getLanguageForMonaco(language)}
          value={code}
          onChange={handleEditorChange}
          onMount={handleEditorDidMount}
          theme="vs-dark"
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            insertSpaces: true,
            wordWrap: "on",
            lineNumbers: "on",
            glyphMargin: false,
            folding: true,
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            renderLineHighlight: "line",
            selectOnLineNumbers: true,
            roundedSelection: false,
            readOnly: false,
            cursorStyle: "line",
            mouseWheelZoom: true,
            fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          }}
        />

        {/* Floating Draggable Chat Popup */}
        {showChat && (
          <div
            ref={chatRef}
            className="absolute w-80 max-w-[calc(100vw-2rem)] sm:max-w-80 bg-gray-800/95 backdrop-blur-sm border border-gray-600/50 rounded-lg shadow-2xl flex flex-col z-50 transition-shadow duration-200"
            style={{
              left: `${dragPosition.x}px`,
              top: `${dragPosition.y}px`,
              bottom: `${16}px`, // Maintain bottom spacing
              maxHeight: "calc(100% - 32px)", // Ensure it doesn't exceed container height
              boxShadow: isDragging
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)"
                : "0 20px 25px -5px rgba(0, 0, 0, 0.3)",
            }}
          >
            {/* Draggable Chat Header */}
            <div
              className={`flex items-center justify-between p-4 border-b border-gray-600/30 cursor-grab active:cursor-grabbing select-none ${
                isDragging ? "cursor-grabbing" : "cursor-grab"
              }`}
              onMouseDown={handleMouseDown}
            >
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Move className="w-4 h-4 mr-2 text-gray-400" />
                <MessageSquare className="w-5 h-5 mr-2 text-blue-400" />
                <span className="hidden sm:inline">Collaboration Chat</span>
                <span className="sm:hidden">Chat</span>
              </h3>
              <button
                onClick={() => setShowChat(false)}
                className="p-1 hover:bg-gray-700/50 rounded-lg transition-colors duration-200 z-10"
                onMouseDown={(e) => e.stopPropagation()} // Prevent drag when clicking close
              >
                <X className="w-5 h-5 text-gray-400 hover:text-white" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {messages.map((message) => (
                <div key={message.id} className="space-y-1">
                  {message.type === "system" ? (
                    <div className="text-center text-gray-400 text-sm italic">
                      {message.message}
                    </div>
                  ) : message.type === "message" ? (
                    <div
                      className={`${
                        message.userId === user._id ? "text-right" : "text-left"
                      }`}
                    >
                      <div
                        className={`inline-block max-w-xs px-3 py-2 rounded-lg ${
                          message.userId === user._id
                            ? "bg-gradient-to-r from-blue-600 to-blue-600 text-white"
                            : "bg-gray-700 text-gray-200"
                        }`}
                      >
                        {message.userId !== user._id && (
                          <div className="text-xs text-gray-400 mb-1">
                            {message.userName}
                          </div>
                        )}
                        <div className="text-sm break-words">
                          {message.message}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-gray-700/50 p-3 rounded-lg border border-gray-600/30">
                      <div className="text-sm text-gray-300 mb-2">
                        <strong>{message.userName}</strong> shared{" "}
                        {message.type} result:
                      </div>
                      <div className="text-xs text-gray-400 font-mono bg-gray-800/50 p-2 rounded overflow-x-auto">
                        {JSON.stringify(message.result, null, 2)}
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Enhanced System Messages */}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-600/30">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    sendUserActivity(); // Track activity when typing in chat
                  }}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                  onFocus={sendUserActivity}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700/50 border border-gray-600/50 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                <button
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-600 hover:from-blue-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg transition-all duration-200 flex items-center"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Room Users List (when expanded) */}
            <div className="border-t border-gray-600/30 p-4">
              <h4 className="text-sm font-semibold text-gray-300 mb-3 flex items-center">
                <Users className="w-4 h-4 mr-2" />
                Room Members ({roomUsers.length})
              </h4>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {roomUsers.map((roomUser) => (
                  <div key={roomUser.id} className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {roomUser.name.charAt(0).toUpperCase()}
                        </div>
                        <div 
                          className={`absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full border border-gray-800 ${getUserStatusColor(roomUser.status || 'online')}`}
                        ></div>
                      </div>
                      <span className="text-gray-200 font-medium">{roomUser.name}</span>
                      {roomUser.id === user._id && (
                        <span className="text-xs text-blue-400">(You)</span>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      {typingUsers.has(roomUser.name) && (
                        <div className="flex space-x-0.5">
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce"></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                          <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        </div>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        roomUser.status === 'online' ? 'bg-blue-500/20 text-blue-400' :
                        roomUser.status === 'away' ? 'bg-yellow-500/20 text-yellow-400' :
                        roomUser.status === 'busy' ? 'bg-red-500/20 text-red-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {getUserStatusText(roomUser.status || 'online')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollaborativeEditor;