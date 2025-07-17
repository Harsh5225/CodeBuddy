import express from "express"
import { userMiddleware } from "../middlewares/userMiddleware.js"
import { getRoomInfo, getAllRooms, createRoom } from "../socket/socketHandlers.js"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

// Create a new collaboration room
router.post("/rooms/create", userMiddleware, (req, res) => {
  try {
    const { problemId } = req.body
    const roomId = uuidv4()

    // Actually create the room in the shared rooms Map
    const room = createRoom(roomId, problemId)

    res.status(201).json({
      success: true,
      roomId,
      problemId,
      message: "Collaboration room created successfully",
    })
  } catch (error) {
    console.error("Error creating room:", error)
    res.status(500).json({
      success: false,
      message: "Failed to create collaboration room",
    })
  }
})

// Get room information
router.get("/rooms/:roomId", userMiddleware, (req, res) => {
  try {
    const { roomId } = req.params
    const room = getRoomInfo(roomId)

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      })
    }

    res.json({
      success: true,
      room: {
        id: room.id,
        problemId: room.problemId,
        userCount: room.users.size,
        users: Array.from(room.users.values()),
        createdAt: room.createdAt,
      },
    })
  } catch (error) {
    console.error("Error getting room info:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get room information",
    })
  }
})

// Get all active rooms
router.get("/rooms", userMiddleware, (req, res) => {
  try {
    const rooms = getAllRooms()
    res.json({
      success: true,
      rooms,
    })
  } catch (error) {
    console.error("Error getting rooms:", error)
    res.status(500).json({
      success: false,
      message: "Failed to get rooms",
    })
  }
})

export default router;
