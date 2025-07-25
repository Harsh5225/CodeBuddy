import { Server } from "socket.io"

// Store room data in memory (use Redis in production)
const rooms = new Map()
const userCursors = new Map()
const typingUsers = new Map() // Track typing users per room
const userPresence = new Map() // Track user presence and last activity

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL||"http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
     transports: ["websocket", "polling"],// fallback for Render proxy
  })

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.id}`)

    // Initialize user presence
    userPresence.set(socket.id, {
      lastActivity: Date.now(),
      status: 'online'
    })

    // Emit presence update to all rooms this user might be in
    socket.broadcast.emit("user-presence-update", {
      socketId: socket.id,
      status: 'online',
      lastActivity: Date.now()
    })

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
        status: 'online',
        lastActivity: Date.now()
      })

      // Initialize typing state for this room
      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, new Set())
      }

      // Send current room state to the joining user
      socket.emit("room-state", {
        code: room.code,
        language: room.language,
        users: Array.from(room.users.values()),
        messages: room.messages,
        typingUsers: Array.from(typingUsers.get(roomId) || [])
      })

      // Notify other users in the room
      socket.to(roomId).emit("user-joined", {
        user: room.users.get(socket.id),
        totalUsers: room.users.size,
        onlineUsers: Array.from(room.users.values()).filter(u => u.status === 'online')
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
      
      // Add to typing users set
      if (!typingUsers.has(roomId)) {
        typingUsers.set(roomId, new Set())
      }
      typingUsers.get(roomId).add(user.name)
      
      // Update user activity
      userPresence.set(socket.id, {
        lastActivity: Date.now(),
        status: 'online'
      })

      socket.to(roomId).emit("user-typing", {
        userId: user.id,
        userName: user.name,
        isTyping: true,
        typingUsers: Array.from(typingUsers.get(roomId))
      })
    })

    socket.on("typing-stop", ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      user.isTyping = false
      
      // Remove from typing users set
      if (typingUsers.has(roomId)) {
        typingUsers.get(roomId).delete(user.name)
      }

      socket.to(roomId).emit("user-typing", {
        userId: user.id,
        userName: user.name,
        isTyping: false,
        typingUsers: Array.from(typingUsers.get(roomId) || [])
      })
    })

    // Handle user activity updates
    socket.on("user-activity", ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      user.lastActivity = Date.now()
      user.status = 'online'
      
      // Update global presence
      userPresence.set(socket.id, {
        lastActivity: Date.now(),
        status: 'online'
      })

      // Broadcast presence update to room
      socket.to(roomId).emit("user-presence-update", {
        userId: user.id,
        userName: user.name,
        status: 'online',
        lastActivity: Date.now()
      })
    })

    // Handle user status change (away, busy, etc.)
    socket.on("status-change", ({ roomId, status }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      user.status = status
      user.lastActivity = Date.now()
      
      // Update global presence
      userPresence.set(socket.id, {
        lastActivity: Date.now(),
        status: status
      })

      // Broadcast status change to room
      io.to(roomId).emit("user-status-changed", {
        userId: user.id,
        userName: user.name,
        status: status,
        lastActivity: Date.now()
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
          
          // Clean up typing state
          if (typingUsers.has(roomId)) {
            typingUsers.get(roomId).delete(user.name)
          }
          
          room.users.delete(socket.id)

          // Notify other users
          socket.to(roomId).emit("user-left", {
            userId: user.id,
            userName: user.name,
            totalUsers: room.users.size,
            onlineUsers: Array.from(room.users.values()).filter(u => u.status === 'online'),
            typingUsers: Array.from(typingUsers.get(roomId) || [])
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
      
      // Clean up global presence
      userPresence.delete(socket.id)
      
      // Broadcast user offline status
      socket.broadcast.emit("user-presence-update", {
        socketId: socket.id,
        status: 'offline',
        lastActivity: Date.now()
      })
    })

    // Handle leave room
    socket.on("leave-room", ({ roomId }) => {
      const room = rooms.get(roomId)
      if (!room || !room.users.has(socket.id)) return

      const user = room.users.get(socket.id)
      room.users.delete(socket.id)
      socket.leave(roomId)
      
      // Clean up typing state for this room
      if (typingUsers.has(roomId)) {
        typingUsers.get(roomId).delete(user.name)
      }

      // Notify other users
      socket.to(roomId).emit("user-left", {
        userId: user.id,
        userName: user.name,
        totalUsers: room.users.size,
        onlineUsers: Array.from(room.users.values()).filter(u => u.status === 'online'),
        typingUsers: Array.from(typingUsers.get(roomId) || [])
      })

      console.log(`User ${user.name} left room ${roomId}`)
    })

    // Periodic presence check (every 30 seconds)
    const presenceInterval = setInterval(() => {
      const now = Date.now()
      const INACTIVE_THRESHOLD = 5 * 60 * 1000 // 5 minutes
      const AWAY_THRESHOLD = 2 * 60 * 1000 // 2 minutes

      for (const [roomId, room] of rooms.entries()) {
        for (const [socketId, user] of room.users.entries()) {
          const timeSinceActivity = now - user.lastActivity
          
          let newStatus = user.status
          if (timeSinceActivity > INACTIVE_THRESHOLD) {
            newStatus = 'offline'
          } else if (timeSinceActivity > AWAY_THRESHOLD && user.status === 'online') {
            newStatus = 'away'
          }
          
          if (newStatus !== user.status) {
            user.status = newStatus
            
            // Broadcast status change
            io.to(roomId).emit("user-status-changed", {
              userId: user.id,
              userName: user.name,
              status: newStatus,
              lastActivity: user.lastActivity
            })
          }
        }
      }
    }, 30000) // Check every 30 seconds

    // Clean up interval on disconnect
    socket.on("disconnect", () => {
      clearInterval(presenceInterval)
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
  const room = rooms.get(roomId)
  if (!room) return null
  
  return {
    ...room,
    typingUsers: Array.from(typingUsers.get(roomId) || []),
    onlineUsers: Array.from(room.users.values()).filter(u => u.status === 'online'),
    awayUsers: Array.from(room.users.values()).filter(u => u.status === 'away'),
    offlineUsers: Array.from(room.users.values()).filter(u => u.status === 'offline')
  }
}

export const getAllRooms = () => {
  return Array.from(rooms.values()).map((room) => ({
    id: room.id,
    problemId: room.problemId,
    userCount: room.users.size,
    onlineCount: Array.from(room.users.values()).filter(u => u.status === 'online').length,
    typingCount: typingUsers.get(room.id)?.size || 0,
    createdAt: room.createdAt,
  }))
}

export const deleteRoom = (roomId) => {
  const deleted = rooms.delete(roomId)
  typingUsers.delete(roomId) // Clean up typing state
  if (deleted) {
    console.log(`Room ${roomId} deleted`)
  }
  return deleted;
}
