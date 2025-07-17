import { Server } from "socket.io"

// Store room data in memory (use Redis in production)
const rooms = new Map()
const userCursors = new Map()

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  })

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Join a collaborative room
    socket.on("join-room", ({ roomId, userId, userName, problemId }) => {
      socket.join(roomId)

      // Initialize room if it doesn't exist (fallback for direct socket joins)
      if (!rooms.has(roomId)) {
        rooms.set(roomId, {
          id: roomId,
          problemId,
          users: new Map(),
          code: "",
          language: "javascript",
          messages: [],
          createdAt: new Date(),
        })
      }

      const room = rooms.get(roomId)

      // Add user to room
      room.users.set(socket.id, {
        id: userId,
        name: userName,
        socketId: socket.id,
        cursor: { line: 0, column: 0 },
        isTyping: false,
      })

      // Send current room state to the joining user
      socket.emit("room-state", {
        code: room.code,
        language: room.language,
        users: Array.from(room.users.values()),
        messages: room.messages,
      })

      // Notify other users in the room
      socket.to(roomId).emit("user-joined", {
        user: room.users.get(socket.id),
        totalUsers: room.users.size,
      })

      console.log(`User ${userName} joined room ${roomId}`)
    })

    // Handle code changes
    socket.on("code-change", ({ roomId, code, changes }) => {
      const room = rooms.get(roomId)
      if (!room) return

      // Update room code
      room.code = code

      // Broadcast to other users in the room
      socket.to(roomId).emit("code-update", {
        code,
        changes,
        userId: room.users.get(socket.id)?.id,
      })
    })

    // Handle language changes
    socket.on("language-change", ({ roomId, language }) => {
      const room = rooms.get(roomId)
      if (!room) return

      room.language = language

      // Broadcast to all users in the room
      io.to(roomId).emit("language-update", { language })
    })

    // Handle cursor position updates
    socket.on("cursor-change", ({ roomId, position }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      user.cursor = position

      // Broadcast cursor position to other users
      socket.to(roomId).emit("cursor-update", {
        userId: user.id,
        userName: user.name,
        position,
      })
    })

    // Handle typing indicators
    socket.on("typing-start", ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      user.isTyping = true

      socket.to(roomId).emit("user-typing", {
        userId: user.id,
        userName: user.name,
        isTyping: true,
      })
    })

    socket.on("typing-stop", ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      user.isTyping = false

      socket.to(roomId).emit("user-typing", {
        userId: user.id,
        userName: user.name,
        isTyping: false,
      })
    })

    // Handle chat messages
    socket.on("send-message", ({ roomId, message }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      const chatMessage = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        message,
        timestamp: new Date(),
        type: "message",
      }

      // Store message in room
      room.messages.push(chatMessage)

      // Broadcast to all users in the room
      io.to(roomId).emit("new-message", chatMessage)
    })

    // Handle code execution results sharing
    socket.on("share-execution", ({ roomId, result, type }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      const executionMessage = {
        id: Date.now().toString(),
        userId: user.id,
        userName: user.name,
        result,
        type: type, // 'run' or 'submit'
        timestamp: new Date(),
      }

      // Store in messages
      room.messages.push(executionMessage)

      // Broadcast to all users
      io.to(roomId).emit("execution-shared", executionMessage)
    })

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.id}`)

      // Remove user from all rooms
      for (const [roomId, room] of rooms.entries()) {
        if (room.users.has(socket.id)) {
          const user = room.users.get(socket.id)
          room.users.delete(socket.id)

          // Notify other users
          socket.to(roomId).emit("user-left", {
            userId: user.id,
            userName: user.name,
            totalUsers: room.users.size,
          })

          // Clean up empty rooms (but keep them for a while in case someone rejoins)
          // You might want to implement a cleanup job that removes rooms after X hours of inactivity
          if (room.users.size === 0) {
            console.log(`Room ${roomId} is now empty`)
            // Optional: Set a timeout to delete the room after some time
            setTimeout(() => {
              if (rooms.has(roomId) && rooms.get(roomId).users.size === 0) {
                rooms.delete(roomId);
                console.log(`Room ${roomId} deleted after timeout`);
              }
            }, 30 * 60 * 1000); // 30 minutes
          }
        }
      }
    })

    // Handle leave room
    socket.on("leave-room", ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      room.users.delete(socket.id)
      socket.leave(roomId)

      // Notify other users
      socket.to(roomId).emit("user-left", {
        userId: user.id,
        userName: user.name,
        totalUsers: room.users.size,
      })

      console.log(`User ${user.name} left room ${roomId}`)
    })
  })

  return io
}

// Utility functions
export const createRoom = (roomId, problemId) => {
  const room = {
    id: roomId,
    problemId,
    users: new Map(),
    code: "",
    language: "javascript",
    messages: [],
    createdAt: new Date(),
  }

  rooms.set(roomId, room)
  console.log(`Room ${roomId} created for problem ${problemId}`)
  return room
}

export const getRoomInfo = (roomId) => {
  return rooms.get(roomId)
}

export const getAllRooms = () => {
  return Array.from(rooms.values()).map((room) => ({
    id: room.id,
    problemId: room.problemId,
    userCount: room.users.size,
    createdAt: room.createdAt,
  }))
}

export const deleteRoom = (roomId) => {
  const deleted = rooms.delete(roomId)
  if (deleted) {
    console.log(`Room ${roomId} deleted`)
  }
  return deleted
}
