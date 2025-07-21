# API Documentation - CodeBuddy Platform

## 📋 Table of Contents
1. [Authentication APIs](#authentication-apis)
2. [Problem Management APIs](#problem-management-apis)
3. [Submission APIs](#submission-apis)
4. [Collaboration APIs](#collaboration-apis)
5. [AI Assistant APIs](#ai-assistant-apis)
6. [Video Management APIs](#video-management-apis)
7. [User Profile APIs](#user-profile-apis)
8. [Socket.IO Events](#socketio-events)
9. [Error Handling](#error-handling)
10. [Rate Limiting](#rate-limiting)

## 🔐 Authentication APIs

### Base URL
```
http://localhost:3000
```

### Register User
```http
POST /user/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "emailId": "john@example.com",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - User already exists
- `400` - Validation error (weak password, invalid email)
- `500` - Internal server error

### Login User
```http
POST /user/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "SecurePass123!"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "firstName": "John",
    "emailId": "john@example.com",
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "role": "user"
  }
}
```

**Error Responses:**
- `400` - Invalid email or password
- `400` - Missing required fields
- `500` - Internal server error

### Check Authentication
```http
GET /user/check
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "user": {
    "firstName": "John",
    "emailId": "john@example.com",
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "role": "user"
  },
  "message": "validUser"
}
```

**Error Responses:**
- `401` - Unauthorized, no token provided
- `401` - Invalid or expired token

### Logout User
```http
GET /user/logout
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

## 💻 Problem Management APIs

### Get All Problems (Paginated)
```http
GET /problem?pageNum=1&pagecnt=10
```

**Query Parameters:**
- `pageNum` (optional): Page number (default: 1)
- `pagecnt` (optional): Items per page (default: 10)

**Response (200):**
```json
{
  "success": true,
  "problems": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Two Sum",
      "description": "Given an array of integers...",
      "difficulty": "easy",
      "tags": "array",
      "visibleTestCases": [...],
      "startCode": [...],
      "problemCreator": "64f8a1b2c3d4e5f6a7b8c9d1"
    }
  ],
  "totalProblems": 50,
  "currentPage": 1,
  "totalPages": 5
}
```

### Get Specific Problem
```http
GET /problem/:id
```

**Response (200):**
```json
{
  "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
  "title": "Two Sum",
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "difficulty": "easy",
  "tags": "array",
  "visibleTestCases": [
    {
      "input": "[2,7,11,15], 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
    }
  ],
  "hiddenTestCases": [
    {
      "input": "[3,2,4], 6",
      "output": "[1,2]"
    }
  ],
  "startCode": [
    {
      "language": "javascript",
      "initialCode": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Your code here\n};"
    }
  ],
  "referenceSolution": [
    {
      "language": "javascript",
      "completeCode": "var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};"
    }
  ],
  "secureUrl": "https://res.cloudinary.com/demo/video/upload/v1234567890/sample.mp4",
  "thumbnailUrl": "https://res.cloudinary.com/demo/image/upload/v1234567890/sample.jpg",
  "duration": 300
}
```

### Create Problem (Admin Only)
```http
POST /problem/create
```

**Headers:**
```
Cookie: token=admin_jwt_token
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Two Sum",
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "difficulty": "easy",
  "tags": "array",
  "visibleTestCases": [
    {
      "input": "[2,7,11,15], 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
    }
  ],
  "hiddenTestCases": [
    {
      "input": "[3,2,4], 6",
      "output": "[1,2]"
    },
    {
      "input": "[3,3], 6",
      "output": "[0,1]"
    }
  ],
  "startCode": [
    {
      "language": "javascript",
      "initialCode": "/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Your code here\n};"
    },
    {
      "language": "java",
      "initialCode": "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your code here\n    }\n}"
    }
  ],
  "referenceSolution": [
    {
      "language": "javascript",
      "completeCode": "var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};"
    }
  ]
}
```

**Response (200):**
```json
{
  "message": "Problem created successfully"
}
```

**Error Responses:**
- `400` - Reference solution failed test cases
- `403` - Forbidden (not admin)
- `500` - Internal server error

### Update Problem (Admin Only)
```http
PATCH /problem/:id
```

**Headers:**
```
Cookie: token=admin_jwt_token
Content-Type: application/json
```

**Request Body:** Same as create problem

**Response (200):**
```json
{
  "message": "Problem updated successfully",
  "data": {
    // Updated problem object
  }
}
```

### Delete Problem (Admin Only)
```http
DELETE /problem/:id
```

**Headers:**
```
Cookie: token=admin_jwt_token
```

**Response (200):**
```json
{
  "message": "Successfully deleted"
}
```

### Get User's Solved Problems
```http
GET /problem/userSolvedProblem
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "count": 5,
  "problems": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "title": "Two Sum",
      "difficulty": "easy",
      "tags": "array"
    }
  ]
}
```

## 🚀 Submission APIs

### Run Code (Test with Visible Cases)
```http
POST /submission/run/:id
```

**Headers:**
```
Cookie: token=jwt_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};",
  "language": "javascript"
}
```

**Response (201):**
```json
{
  "success": true,
  "testCases": [
    {
      "stdin": "[2,7,11,15], 9",
      "expected_output": "[0,1]",
      "stdout": "[0,1]",
      "status_id": 3,
      "status_description": "Accepted",
      "time": "0.002",
      "memory": 512
    }
  ],
  "testCasesPassed": 1,
  "totalTestCases": 1,
  "runtime": 0.002,
  "memory": 512
}
```

**Error Response (201):**
```json
{
  "success": false,
  "testCases": [
    {
      "stdin": "[2,7,11,15], 9",
      "expected_output": "[0,1]",
      "stdout": "[1,0]",
      "status_id": 4,
      "status_description": "Wrong Answer",
      "time": "0.002",
      "memory": 512
    }
  ],
  "testCasesPassed": 0,
  "totalTestCases": 1,
  "runtime": 0.002,
  "memory": 512,
  "errorMessage": "Wrong Answer"
}
```

### Submit Code (Full Evaluation)
```http
POST /submission/submit/:id
```

**Headers:**
```
Cookie: token=jwt_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "code": "var twoSum = function(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n};",
  "language": "javascript"
}
```

**Response (201) - Accepted:**
```json
{
  "accepted": true,
  "totalTestCases": 5,
  "passedTestCases": 5,
  "runtime": 0.015,
  "memory": 1024
}
```

**Response (201) - Rejected:**
```json
{
  "accepted": false,
  "totalTestCases": 5,
  "passedTestCases": 3,
  "runtime": 0.010,
  "memory": 512,
  "error": "Wrong Answer"
}
```

### Get Recent Submissions
```http
GET /submission/recent
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "submissions": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
      "problemId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "problemTitle": "Two Sum",
      "code": "var twoSum = function(nums, target) {...}",
      "language": "javascript",
      "status": "accepted",
      "runtime": 0.015,
      "memory": 1024,
      "testCasesPassed": 5,
      "testCasesTotal": 5,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  ]
}
```

### Get Submissions by Problem
```http
GET /problem/submittedProblem/:problemId
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
[
  {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userId": "64f8a1b2c3d4e5f6a7b8c9d1",
    "problemId": "64f8a1b2c3d4e5f6a7b8c9d2",
    "code": "var twoSum = function(nums, target) {...}",
    "language": "javascript",
    "status": "accepted",
    "runtime": 0.015,
    "memory": 1024,
    "testCasesPassed": 5,
    "testCasesTotal": 5,
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
]
```

## 🤝 Collaboration APIs

### Create Collaboration Room
```http
POST /collaboration/rooms/create
```

**Headers:**
```
Cookie: token=jwt_token_here
Content-Type: application/json
```

**Request Body:**
```json
{
  "problemId": "64f8a1b2c3d4e5f6a7b8c9d0"
}
```

**Response (201):**
```json
{
  "success": true,
  "roomId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
  "problemId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "message": "Collaboration room created successfully"
}
```

### Get Room Information
```http
GET /collaboration/rooms/:roomId
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "room": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "problemId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "userCount": 2,
    "users": [
      {
        "id": "64f8a1b2c3d4e5f6a7b8c9d1",
        "name": "John",
        "socketId": "socket_id_1",
        "status": "online",
        "lastActivity": 1693996200000
      }
    ],
    "createdAt": "2023-09-06T10:30:00.000Z"
  }
}
```

**Error Responses:**
- `404` - Room not found
- `401` - Unauthorized

### Get All Active Rooms
```http
GET /collaboration/rooms
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "rooms": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "problemId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "userCount": 2,
      "onlineCount": 2,
      "typingCount": 0,
      "createdAt": "2023-09-06T10:30:00.000Z"
    }
  ]
}
```

## 🤖 AI Assistant APIs

### Chat with AI Assistant
```http
POST /ai/chat
```

**Headers:**
```
Content-Type: application/json
```

**Request Body:**
```json
{
  "messages": [
    {
      "role": "user",
      "parts": [
        {
          "text": "How do I approach the Two Sum problem?"
        }
      ]
    }
  ],
  "title": "Two Sum",
  "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
  "testCases": [
    {
      "input": "[2,7,11,15], 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] = 2 + 7 = 9, we return [0, 1]."
    }
  ],
  "startCode": [
    {
      "language": "javascript",
      "initialCode": "var twoSum = function(nums, target) {\n    // Your code here\n};"
    }
  ]
}
```

**Response (201):**
```json
{
  "message": "Great question! The Two Sum problem can be solved efficiently using a hash map approach. Here's how to think about it:\n\n## Approach\n1. **Brute Force**: Check every pair of numbers (O(n²) time)\n2. **Hash Map**: Use a hash map to store complements (O(n) time)\n\n## Hash Map Solution:\n```javascript\nvar twoSum = function(nums, target) {\n    const map = new Map();\n    \n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        \n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        \n        map.set(nums[i], i);\n    }\n    \n    return [];\n};\n```\n\n## Key Insights:\n- For each number, calculate what number would complete the target sum\n- Store numbers and their indices as you iterate\n- If you find the complement, you've found your answer\n\n**Time Complexity**: O(n)\n**Space Complexity**: O(n)\n\nWould you like me to explain any specific part in more detail?"
}
```

**Error Responses:**
- `500` - Internal server error (AI service unavailable)

## 📹 Video Management APIs (Admin Only)

### Generate Upload Signature
```http
GET /video/create/:problemId
```

**Headers:**
```
Cookie: token=admin_jwt_token
```

**Response (200):**
```json
{
  "signature": "a1b2c3d4e5f6789012345678901234567890abcd",
  "timestamp": 1693996200,
  "public_id": "leetcode-solutions/64f8a1b2c3d4e5f6a7b8c9d0/admin_1693996200",
  "api_key": "123456789012345",
  "cloud_name": "your-cloud-name",
  "upload_url": "https://api.cloudinary.com/v1_1/your-cloud-name/video/upload"
}
```

### Save Video Metadata
```http
POST /video/save
```

**Headers:**
```
Cookie: token=admin_jwt_token
Content-Type: application/json
```

**Request Body:**
```json
{
  "problemId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "cloudinaryPublicId": "leetcode-solutions/64f8a1b2c3d4e5f6a7b8c9d0/admin_1693996200",
  "secureUrl": "https://res.cloudinary.com/your-cloud/video/upload/v1693996200/leetcode-solutions/64f8a1b2c3d4e5f6a7b8c9d0/admin_1693996200.mp4",
  "duration": 300
}
```

**Response (201):**
```json
{
  "message": "Video solution saved successfully",
  "videoSolution": {
    "id": "64f8a1b2c3d4e5f6a7b8c9d3",
    "thumbnailUrl": "<img src='https://res.cloudinary.com/your-cloud/image/upload/leetcode-solutions/64f8a1b2c3d4e5f6a7b8c9d0/admin_1693996200.jpg' />",
    "duration": 300,
    "uploadedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Delete Video
```http
DELETE /video/delete/:problemId
```

**Headers:**
```
Cookie: token=admin_jwt_token
```

**Response (200):**
```json
{
  "message": "Video deleted successfully"
}
```

**Error Responses:**
- `404` - Video not found
- `403` - Forbidden (not admin)

## 👤 User Profile APIs

### Get User Profile
```http
GET /user/profile
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "firstName": "John",
    "lastName": "Doe",
    "emailId": "john@example.com",
    "age": 25,
    "role": "user",
    "location": "San Francisco, CA",
    "jobTitle": "Software Engineer",
    "level": "Intermediate",
    "streak": 15,
    "photoUrl": "https://res.cloudinary.com/your-cloud/image/upload/v1693996200/profile.jpg",
    "problemSolved": ["64f8a1b2c3d4e5f6a7b8c9d1"],
    "createdAt": "2023-09-01T10:30:00.000Z",
    "updatedAt": "2023-09-06T10:30:00.000Z"
  }
}
```

### Update User Profile
```http
PUT /user/edit-profile
```

**Headers:**
```
Cookie: token=jwt_token_here
Content-Type: multipart/form-data
```

**Request Body (FormData):**
```
location: "New York, NY"
jobTitle: "Senior Software Engineer"
level: "Advanced"
streak: 20
profilePhoto: [File object] (optional)
```

**Response (200):**
```json
{
  "success": true,
  "user": {
    // Updated user object
  },
  "message": "Profile updated successfully"
}
```

### Delete Profile
```http
DELETE /user/delete-profile
```

**Headers:**
```
Cookie: token=jwt_token_here
```

**Response (200):**
```json
{
  "success": true,
  "message": "deleted successfully"
}
```

## 🔌 Socket.IO Events

### Connection
```javascript
// Client connects to server
const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});
```

### Room Management Events

#### Join Room
```javascript
// Client to Server
socket.emit('join-room', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  userId: '64f8a1b2c3d4e5f6a7b8c9d0',
  userName: 'John',
  problemId: '64f8a1b2c3d4e5f6a7b8c9d1'
});

// Server to Client - Room State
socket.on('room-state', (data) => {
  console.log(data);
  /*
  {
    code: "// Current room code",
    language: "javascript",
    users: [
      {
        id: "64f8a1b2c3d4e5f6a7b8c9d0",
        name: "John",
        socketId: "socket_id",
        status: "online",
        lastActivity: 1693996200000
      }
    ],
    messages: [],
    typingUsers: []
  }
  */
});

// Server to Client - User Joined
socket.on('user-joined', (data) => {
  console.log(data);
  /*
  {
    user: {
      id: "64f8a1b2c3d4e5f6a7b8c9d1",
      name: "Jane",
      socketId: "socket_id_2",
      status: "online"
    },
    totalUsers: 2,
    onlineUsers: [...]
  }
  */
});
```

#### Leave Room
```javascript
// Client to Server
socket.emit('leave-room', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
});

// Server to Client - User Left
socket.on('user-left', (data) => {
  console.log(data);
  /*
  {
    userId: "64f8a1b2c3d4e5f6a7b8c9d1",
    userName: "Jane",
    totalUsers: 1,
    onlineUsers: [...],
    typingUsers: [...]
  }
  */
});
```

### Code Collaboration Events

#### Code Changes
```javascript
// Client to Server
socket.emit('code-change', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  code: 'function twoSum(nums, target) {\n    // Updated code\n}',
  changes: [] // Monaco editor change events
});

// Server to Client
socket.on('code-update', (data) => {
  console.log(data);
  /*
  {
    code: "function twoSum(nums, target) {\n    // Updated code\n}",
    changes: [],
    userId: "64f8a1b2c3d4e5f6a7b8c9d0"
  }
  */
});
```

#### Language Changes
```javascript
// Client to Server
socket.emit('language-change', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  language: 'java'
});

// Server to Client
socket.on('language-update', (data) => {
  console.log(data);
  /*
  {
    language: "java"
  }
  */
});
```

#### Cursor Position
```javascript
// Client to Server
socket.emit('cursor-change', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  position: {
    line: 5,
    column: 10
  }
});

// Server to Client
socket.on('cursor-update', (data) => {
  console.log(data);
  /*
  {
    userId: "64f8a1b2c3d4e5f6a7b8c9d0",
    userName: "John",
    position: {
      line: 5,
      column: 10
    }
  }
  */
});
```

### Typing & Presence Events

#### Typing Indicators
```javascript
// Client to Server - Start Typing
socket.emit('typing-start', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
});

// Client to Server - Stop Typing
socket.emit('typing-stop', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
});

// Server to Client - Typing Update
socket.on('user-typing', (data) => {
  console.log(data);
  /*
  {
    userId: "64f8a1b2c3d4e5f6a7b8c9d0",
    userName: "John",
    isTyping: true,
    typingUsers: ["John", "Jane"]
  }
  */
});
```

#### User Activity
```javascript
// Client to Server
socket.emit('user-activity', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
});

// Server to Client - Presence Update
socket.on('user-presence-update', (data) => {
  console.log(data);
  /*
  {
    userId: "64f8a1b2c3d4e5f6a7b8c9d0",
    userName: "John",
    status: "online",
    lastActivity: 1693996200000
  }
  */
});
```

#### Status Changes
```javascript
// Client to Server
socket.emit('status-change', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  status: 'busy'
});

// Server to Client
socket.on('user-status-changed', (data) => {
  console.log(data);
  /*
  {
    userId: "64f8a1b2c3d4e5f6a7b8c9d0",
    userName: "John",
    status: "busy",
    lastActivity: 1693996200000
  }
  */
});
```

### Communication Events

#### Chat Messages
```javascript
// Client to Server
socket.emit('send-message', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  message: 'Hey, let me help you with this problem!'
});

// Server to Client
socket.on('new-message', (data) => {
  console.log(data);
  /*
  {
    id: "1693996200000",
    userId: "64f8a1b2c3d4e5f6a7b8c9d0",
    userName: "John",
    message: "Hey, let me help you with this problem!",
    timestamp: "2023-09-06T10:30:00.000Z",
    type: "message"
  }
  */
});
```

#### Share Execution Results
```javascript
// Client to Server
socket.emit('share-execution', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  result: {
    success: true,
    runtime: 0.015,
    memory: 1024,
    testCasesPassed: 5,
    totalTestCases: 5
  },
  type: 'submit' // or 'run'
});

// Server to Client
socket.on('execution-shared', (data) => {
  console.log(data);
  /*
  {
    id: "1693996200001",
    userId: "64f8a1b2c3d4e5f6a7b8c9d0",
    userName: "John",
    result: {
      success: true,
      runtime: 0.015,
      memory: 1024,
      testCasesPassed: 5,
      totalTestCases: 5
    },
    type: "submit",
    timestamp: "2023-09-06T10:30:00.000Z"
  }
  */
});
```

## ❌ Error Handling

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "Detailed error information",
  "code": "ERROR_CODE"
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors, missing fields)
- `401` - Unauthorized (invalid/missing token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `409` - Conflict (duplicate resource)
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

### Error Examples

#### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation error",
  "error": "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
}
```

#### Authentication Error (401)
```json
{
  "success": false,
  "message": "Invalid or expired token"
}
```

#### Permission Error (403)
```json
{
  "success": false,
  "message": "Forbidden you are not allowed to register as admin role"
}
```

#### Rate Limit Error (429)
```json
{
  "success": false,
  "message": "Too many requests, please try again later.",
  "retryAfter": 60
}
```

## 🚦 Rate Limiting

### Rate Limit Headers
All API responses include rate limiting headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1693996800
Retry-After: 60 (only when rate limited)
```

### Rate Limit Configurations

#### General API Endpoints
- **Limit**: 100 requests per minute
- **Window**: 60 seconds
- **Scope**: Per IP address

#### Authentication Endpoints
- **Limit**: 5 requests per minute
- **Window**: 60 seconds
- **Scope**: Per IP address
- **Endpoints**: `/user/login`, `/user/register`

#### Code Submission Endpoints
- **Limit**: 10 requests per minute
- **Window**: 60 seconds
- **Scope**: Per authenticated user
- **Endpoints**: `/submission/run/*`, `/submission/submit/*`

#### Admin Endpoints
- **Limit**: 50 requests per minute
- **Window**: 60 seconds
- **Scope**: Per authenticated admin user

### Rate Limiting Implementation
```javascript
// Usage example
app.use('/user/login', authRateLimiter);
app.use('/user/register', authRateLimiter);
app.use('/submission', userRateLimiter);
app.use('/api', apiRateLimiter);
```

## 🔧 Request/Response Examples

### Complete Problem Solving Flow

1. **Login**
```bash
curl -X POST http://localhost:3000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123!"}' \
  -c cookies.txt
```

2. **Get Problems**
```bash
curl -X GET "http://localhost:3000/problem?pageNum=1&pagecnt=5" \
  -b cookies.txt
```

3. **Get Specific Problem**
```bash
curl -X GET http://localhost:3000/problem/64f8a1b2c3d4e5f6a7b8c9d0 \
  -b cookies.txt
```

4. **Run Code**
```bash
curl -X POST http://localhost:3000/submission/run/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"code":"var twoSum = function(nums, target) { return [0, 1]; }","language":"javascript"}'
```

5. **Submit Code**
```bash
curl -X POST http://localhost:3000/submission/submit/64f8a1b2c3d4e5f6a7b8c9d0 \
  -H "Content-Type: application/json" \
  -b cookies.txt \
  -d '{"code":"var twoSum = function(nums, target) { const map = new Map(); for (let i = 0; i < nums.length; i++) { const complement = target - nums[i]; if (map.has(complement)) { return [map.get(complement), i]; } map.set(nums[i], i); } return []; }","language":"javascript"}'
```

6. **Logout**
```bash
curl -X GET http://localhost:3000/user/logout \
  -b cookies.txt
```

### WebSocket Connection Example
```javascript
// Frontend connection
import { io } from 'socket.io-client';

const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

// Join collaboration room
socket.emit('join-room', {
  roomId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
  userId: '64f8a1b2c3d4e5f6a7b8c9d0',
  userName: 'John',
  problemId: '64f8a1b2c3d4e5f6a7b8c9d1'
});

// Listen for events
socket.on('room-state', (data) => {
  console.log('Room state:', data);
});

socket.on('user-joined', (data) => {
  console.log('User joined:', data);
});

socket.on('code-update', (data) => {
  console.log('Code updated:', data);
});
```

This API documentation provides comprehensive information for integrating with the CodeBuddy platform. All endpoints include proper authentication, validation, and error handling to ensure a robust and secure API experience.