import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export const useSocket = (serverUrl = "http://localhost:3000") => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Initialize socket connection
    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    const socket = socketRef.current;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
      setIsConnected(true);
      setError(null);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected from server:", reason);
      setIsConnected(false);
    });

    socket.on("connect_error", (err) => {
      console.error("Connection error:", err);
      setError(err.message);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [serverUrl]);

  // Helper functions
  const emit = (event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    }
  };

  const on = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
    }
  };

  const off = (event, callback) => {
    if (socketRef.current) {
      socketRef.current.off(event, callback);
    }
  };

  return {
    socket: socketRef.current,
    isConnected,
    error,
    emit,
    on,
    off,
  };
};
