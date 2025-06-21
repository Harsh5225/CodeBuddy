import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import axiosClient from "../utils/axiosClient";
import { Send } from "lucide-react";
import ReactMarkdown from "react-markdown";

function ChatAi({ problem }) {
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [{ text: "Hi, how are you?" }],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
    {
      role: "user",
      parts: [{ text: "I am good" }],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const onSubmit = async (data) => {
    const userMessage = {
      role: "user",
      parts: [{ text: data.message }],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    reset();
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/ai/chat", {
        messages: updatedMessages.map((msg) => ({
          role: msg.role,
          parts: [{ text: msg.parts[0].text }],
        })),
        title: problem.title,
        description: problem.description,
        testCases: problem.visibleTestCases,
        startCode: problem.startCode,
      });

      const aiMessage = {
        role: "model",
        parts: [{ text: response.data.message }],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("API Error:", error);

      const errorMessage = {
        role: "model",
        parts: [{ text: "Something went wrong. Please try again later." }],
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[80vh] min-h-[500px]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`chat ${
              msg.role === "user" ? "chat-end" : "chat-start"
            }`}
          >
            <div className="chat-header mb-1 text-sm text-gray-500">
              {msg.role === "model" ? "AI" : "You"}
              <time className="text-xs opacity-50 ml-2">{msg.time}</time>
            </div>
            <div className="chat-bubble bg-base-200 text-base-content whitespace-pre-wrap break-words max-w-[90%] p-3 leading-snug">
              <div className="prose prose-sm max-w-none whitespace-pre-wrap break-words leading-snug">
                <ReactMarkdown>{msg.parts[0].text}</ReactMarkdown>
              </div>
            </div>
          </div>
        ))}

        {/* AI typing bubble */}
        {isLoading && (
          <div className="chat chat-start">
            <div className="chat-header mb-1 text-sm text-gray-500">AI</div>
            <div className="chat-bubble bg-base-200 text-base-content animate-pulse max-w-[90%] p-3">
              AI is typing...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="sticky bottom-0 p-4 bg-base-100 border-t"
      >
        <div className="flex items-center">
          <input
            placeholder="Ask me anything"
            className="input input-bordered flex-1"
            {...register("message", { required: true, minLength: 2 })}
          />
          <button
            type="submit"
            className="btn btn-ghost ml-2"
            disabled={!!errors.message || isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

export default ChatAi;
