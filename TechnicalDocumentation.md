# Technical Documentation - CodeBuddy Platform

## 📋 Table of Contents
1. [System Architecture](#system-architecture)
2. [Database Schema](#database-schema)
3. [API Reference](#api-reference)
4. [Real-time Features](#real-time-features)
5. [Authentication Flow](#authentication-flow)
6. [Code Execution Pipeline](#code-execution-pipeline)
7. [File Upload System](#file-upload-system)
8. [AI Integration](#ai-integration)
9. [Performance Considerations](#performance-considerations)
10. [Security Implementation](#security-implementation)

## 🏗️ System Architecture

### High-Level Architecture
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Node.js Server │    │   External APIs │
│                 │    │                 │    │                 │
│ • Redux Store   │◄──►│ • Express.js    │◄──►│ • Judge0 API    │
│ • Socket.IO     │    │ • Socket.IO     │    │ • Cloudinary    │
│ • Monaco Editor │    │ • JWT Auth      │    │ • Google Gemini │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   CDN/Static    │    │    Database     │    │     Cache       │
│                 │    │                 │    │                 │
│ • Vite Build    │    │ • MongoDB       │    │ • Redis         │
│ • Assets        │    │ • Collections   │    │ • Sessions      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Component Architecture
```
Frontend Components Hierarchy:
├── App.jsx (Root)
├── pages/
│   ├── Home.jsx
│   ├── ProblemPageUpdated.jsx
│   ├── CollaborativeProblemPage.jsx
│   ├── AdminPanel.jsx
│   └── ProfilePage.jsx
├── components/
│   ├── CollaborativeEditor.jsx
│   ├── TypingIndicator.jsx
│   ├── UserPresenceIndicator.jsx
│   ├── ChatAi.jsx
│   ├── Editorial.jsx
│   └── SubmissionHistory.jsx
└── features/ (Redux Slices)
    ├── auth/
    ├── problem/
    ├── chatMessage/
    └── submission/
```

## 🗄️ Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  firstName: String (required, 3-20 chars),
  lastName: String (3-20 chars),
  emailId: String (required, unique, lowercase),
  password: String (required, hashed),
  age: Number (6-80),
  role: String (enum: ["user", "admin"], default: "user"),
  problemSolved: [ObjectId] (ref: Problem),
  location: String (max 50 chars),
  jobTitle: String (max 100 chars),
  level: String (enum: ["Beginner", "Intermediate", "Advanced", "Expert"]),
  streak: Number (default: 0),
  photoUrl: String,
  createdAt: Date,
  updatedAt: Date
}
```

### Problem Collection
```javascript
{
  _id: ObjectId,
  title: String (required),
  description: String (required),
  difficulty: String (enum: ["easy", "medium", "hard"]),
  tags: String (enum: ["array", "linkedList", "graph", "dp", "math"]),
  visibleTestCases: [{
    input: String (required),
    output: String (required),
    explanation: String (required)
  }],
  hiddenTestCases: [{
    input: String (required),
    output: String (required)
  }],
  startCode: [{
    language: String (enum: ["javascript", "c++", "cpp", "java", "python", "c"]),
    initialCode: String (required)
  }],
  referenceSolution: [{
    language: String (enum: ["javascript", "c++", "cpp", "java", "python", "c"]),
    completeCode: String (required)
  }],
  problemCreator: ObjectId (ref: User, required)
}
```

### Submission Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: User, required),
  problemId: ObjectId (ref: Problem, required),
  code: String (required),
  language: String (enum: ["javascript", "c++", "java", "cpp"]),
  status: String (enum: ["pending", "accepted", "wrong", "error"]),
  runtime: Number (milliseconds),
  memory: Number (kB),
  errorMessage: String,
  testCasesPassed: Number,
  testCasesTotal: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### SolutionVideo Collection
```javascript
{
  _id: ObjectId,
  problemId: ObjectId (ref: Problem, required),
  userId: ObjectId (ref: User, required),
  cloudinaryPublicId: String (required, unique),
  secureUrl: String (required),
  thumbnailUrl: String,
  duration: Number (required),
  createdAt: Date,
  updatedAt: Date
}
```

## 🔌 API Reference

### Authentication Endpoints

#### POST /user/register
```javascript
// Request Body
{
  firstName: "John",
  email: "john@example.com",
  password: "SecurePass123!"
}

// Response
{
  message: "User registered successfully",
  user: {
    id: "user_id",
    firstName: "John",
    emailId: "john@example.com",
    role: "user"
  }
}
```

#### POST /user/login
```javascript
// Request Body
{
  email: "john@example.com",
  password: "SecurePass123!"
}

// Response
{
  message: "Login successful",
  token: "jwt_token",
  user: {
    firstName: "John",
    emailId: "john@example.com",
    _id: "user_id",
    role: "user"
  }
}
```

### Problem Management

#### GET /problem
```javascript
// Query Parameters
?pageNum=1&pagecnt=10

// Response
{
  success: true,
  problems: [...],
  totalProblems: 50,
  currentPage: 1,
  totalPages: 5
}
```

#### POST /problem/create (Admin Only)
```javascript
// Request Body
{
  title: "Two Sum",
  description: "Find two numbers that add up to target",
  difficulty: "easy",
  tags: "array",
  visibleTestCases: [{
    input: "[2,7,11,15], 9",
    output: "[0,1]",
    explanation: "nums[0] + nums[1] = 2 + 7 = 9"
  }],
  hiddenTestCases: [{
    input: "[3,2,4], 6",
    output: "[1,2]"
  }],
  startCode: [{
    language: "javascript",
    initialCode: "function twoSum(nums, target) {\n    // Your code here\n}"
  }],
  referenceSolution: [{
    language: "javascript",
    completeCode: "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const complement = target - nums[i];\n        if (map.has(complement)) {\n            return [map.get(complement), i];\n        }\n        map.set(nums[i], i);\n    }\n    return [];\n}"
  }]
}
```

### Code Submission

#### POST /submission/run/:id
```javascript
// Request Body
{
  code: "function twoSum(nums, target) { return [0, 1]; }",
  language: "javascript"
}

// Response
{
  success: true,
  testCases: [{
    stdin: "[2,7,11,15], 9",
    expected_output: "[0,1]",
    stdout: "[0,1]",
    status_id: 3,
    status_description: "Accepted"
  }],
  testCasesPassed: 1,
  totalTestCases: 1,
  runtime: 0.002,
  memory: 512
}
```

#### POST /submission/submit/:id
```javascript
// Request Body
{
  code: "function twoSum(nums, target) { return [0, 1]; }",
  language: "javascript"
}

// Response
{
  accepted: true,
  totalTestCases: 5,
  passedTestCases: 5,
  runtime: 0.015,
  memory: 1024
}
```

## ⚡ Real-time Features

### Socket.IO Implementation

#### Connection Management
```javascript
// Client Connection
const socket = io('http://localhost:3000', {
  withCredentials: true,
  transports: ['websocket', 'polling']
});

// Server Setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});
```

#### Room Management
```javascript
// Data Structures
const rooms = new Map(); // roomId -> room data
const typingUsers = new Map(); // roomId -> Set of typing users
const userPresence = new Map(); // socketId -> presence data

// Room Structure
{
  id: "room_id",
  problemId: "problem_id",
  users: Map(), // socketId -> user data
  code: "",
  language: "javascript",
  messages: [],
  createdAt: Date
}
```

#### Typing Indicators
```javascript
// Client Side - Debounced Typing Detection
const handleEditorChange = useCallback((value) => {
  setCode(value);
  
  // Clear existing timeout
  if (typingTimeoutRef.current) {
    clearTimeout(typingTimeoutRef.current);
  } else {
    // Start typing
    emit('typing-start', { roomId });
  }
  
  // Set timeout to stop typing
  typingTimeoutRef.current = setTimeout(() => {
    emit('typing-stop', { roomId });
    typingTimeoutRef.current = null;
  }, 1000);
}, [roomId, emit]);

// Server Side - Typing State Management
socket.on('typing-start', ({ roomId }) => {
  const room = rooms.get(roomId);
  if (!room || !room.users.has(socket.id)) return;

  const user = room.users.get(socket.id);
  user.isTyping = true;
  
  if (!typingUsers.has(roomId)) {
    typingUsers.set(roomId, new Set());
  }
  typingUsers.get(roomId).add(user.name);
  
  socket.to(roomId).emit('user-typing', {
    userId: user.id,
    userName: user.name,
    isTyping: true,
    typingUsers: Array.from(typingUsers.get(roomId))
  });
});
```

#### Presence System
```javascript
// Automatic Presence Detection
const INACTIVE_THRESHOLD = 5 * 60 * 1000; // 5 minutes
const AWAY_THRESHOLD = 2 * 60 * 1000;     // 2 minutes

// Periodic Presence Check
setInterval(() => {
  const now = Date.now();
  
  for (const [roomId, room] of rooms.entries()) {
    for (const [socketId, user] of room.users.entries()) {
      const timeSinceActivity = now - user.lastActivity;
      
      let newStatus = user.status;
      if (timeSinceActivity > INACTIVE_THRESHOLD) {
        newStatus = 'offline';
      } else if (timeSinceActivity > AWAY_THRESHOLD && user.status === 'online') {
        newStatus = 'away';
      }
      
      if (newStatus !== user.status) {
        user.status = newStatus;
        io.to(roomId).emit('user-status-changed', {
          userId: user.id,
          userName: user.name,
          status: newStatus,
          lastActivity: user.lastActivity
        });
      }
    }
  }
}, 30000);
```

## 🔐 Authentication Flow

### JWT Token Management
```javascript
// Token Generation
const token = jwt.sign(
  { id: user._id, email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: "1h" }
);

// Token Verification Middleware
export const userMiddleware = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    
    // Check Redis blacklist
    const isBlocked = await client.exists(`token:${token}`);
    if (isBlocked) {
      throw new Error("Token has been revoked");
    }
    
    // Verify JWT
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decode.id);
    
    req.userInfo = user;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token"
    });
  }
};
```

### Session Management
```javascript
// Logout with Token Blacklisting
export const logout = async (req, res) => {
  try {
    const token = req.cookies.token;
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Add token to Redis blacklist
    await client.set(`token:${token}`, "blocked");
    await client.expireAt(`token:${token}`, payload.exp);
    
    return res.cookie("token", null, { maxAge: 0 }).json({
      success: true,
      message: "Logout successful"
    });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};
```

## ⚙️ Code Execution Pipeline

### Judge0 Integration
```javascript
// Language ID Mapping
const getLanguageById = (lang) => {
  const language = {
    "c++": 54,
    "cpp": 54,
    "java": 62,
    "javascript": 63,
    "python": 71,
    "c": 50
  };
  return language[lang.toLowerCase()] || 50;
};

// Batch Submission
export const submitBatch = async (submissions) => {
  const options = {
    method: "POST",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: { base64_encoded: "false" },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.RAPIDAPI_HOST,
      "Content-Type": "application/json"
    },
    data: { submissions }
  };
  
  const response = await axios.request(options);
  return response.data;
};

// Result Polling
export const submitToken = async (resultToken) => {
  const options = {
    method: "GET",
    url: "https://judge0-ce.p.rapidapi.com/submissions/batch",
    params: {
      tokens: resultToken.join(","),
      base64_encoded: "false",
      fields: "*"
    },
    headers: {
      "x-rapidapi-key": process.env.RAPIDAPI_KEY,
      "x-rapidapi-host": process.env.RAPIDAPI_HOST
    }
  };

  let attempts = 0;
  const MAX_ATTEMPTS = 12;

  while (attempts < MAX_ATTEMPTS) {
    const response = await axios.request(options);
    
    if (response.data?.submissions) {
      const isResultObtained = response.data.submissions.every(
        (data) => data.status_id > 2
      );
      
      if (isResultObtained) {
        return response.data.submissions;
      }
    }
    
    attempts++;
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  throw new Error("Timeout waiting for results");
};
```

### Submission Processing
```javascript
export const submit = async (req, res) => {
  try {
    const { code, language } = req.body;
    const { id: problemId } = req.params;
    const userId = req.userInfo.id;

    // Get problem and prepare test cases
    const problem = await Problem.findById(problemId);
    const languageId = getLanguageById(language);
    
    // Create submission record
    const submission = await Submission.create({
      userId,
      problemId,
      code,
      language,
      status: "pending",
      testCasesTotal: problem.hiddenTestCases.length
    });

    // Prepare submissions for Judge0
    const submissions = problem.hiddenTestCases.map(testcase => ({
      source_code: code,
      language_id: languageId,
      stdin: testcase.input,
      expected_output: testcase.output
    }));

    // Submit to Judge0
    const judgeResponse = await submitBatch(submissions);
    const tokens = judgeResponse.map(res => res.token);
    const testResults = await submitToken(tokens);

    // Process results
    let testCasesPassed = 0;
    let runtime = 0;
    let memory = 0;
    let status = "accepted";
    let errorMessage = null;

    for (const test of testResults) {
      if (test.status_id === 3) {
        testCasesPassed++;
        runtime += parseFloat(test.time || 0);
        memory = Math.max(memory, test.memory || 0);
      } else {
        status = test.status_id === 4 ? "error" : "wrong";
        errorMessage = test.stderr || test.compile_output || "Unknown error";
      }
    }

    // Update submission
    submission.status = status;
    submission.testCasesPassed = testCasesPassed;
    submission.runtime = runtime;
    submission.memory = memory;
    submission.errorMessage = errorMessage;
    await submission.save();

    // Update user's solved problems
    if (status === "accepted" && !user.problemSolved.includes(problemId)) {
      user.problemSolved.push(problemId);
      await user.save();
    }

    return res.status(201).json({
      accepted: status === "accepted",
      totalTestCases: submission.testCasesTotal,
      passedTestCases: testCasesPassed,
      runtime,
      memory
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
```

## 📁 File Upload System

### Cloudinary Integration
```javascript
// Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Image Upload
export const uploadImage = async (filePath) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "images",
      resource_type: "image"
    });
    return result.secure_url;
  } catch (error) {
    throw error;
  }
};

// Video Upload with Signature
export const generateUploadSignature = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.result._id;
    
    const timestamp = Math.round(new Date().getTime() / 1000);
    const publicId = `leetcode-solutions/${problemId}/${userId}_${timestamp}`;
    
    const uploadParams = {
      timestamp: timestamp,
      public_id: publicId
    };
    
    const signature = cloudinary.utils.api_sign_request(
      uploadParams,
      process.env.CLOUDINARY_API_SECRET
    );
    
    res.json({
      signature,
      timestamp,
      public_id: publicId,
      api_key: process.env.CLOUDINARY_API_KEY,
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      upload_url: `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_CLOUD_NAME}/video/upload`
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate upload credentials" });
  }
};
```

### Multer Configuration
```javascript
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + "-" + uniqueSuffix + "." + file.originalname.split(".").pop());
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});
```

## 🤖 AI Integration

### Google Gemini Setup
```javascript
import { GoogleGenAI } from "@google/genai";

const solveDoubt = async (req, res) => {
  try {
    const { messages, title, description, testCases, startCode } = req.body;
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_KEY });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: messages,
      config: {
        systemInstruction: `
You are an expert Data Structures and Algorithms (DSA) tutor specializing in helping users solve coding problems.

## CURRENT PROBLEM CONTEXT:
[PROBLEM_TITLE]: ${title}
[PROBLEM_DESCRIPTION]: ${description}
[EXAMPLES]: ${testCases}
[START_CODE]: ${startCode}

## YOUR CAPABILITIES:
1. **Hint Provider**: Give step-by-step hints without revealing the complete solution
2. **Code Reviewer**: Debug and fix code submissions with explanations
3. **Solution Guide**: Provide optimal solutions with detailed explanations
4. **Complexity Analyzer**: Explain time and space complexity trade-offs
5. **Approach Suggester**: Recommend different algorithmic approaches

## STRICT LIMITATIONS:
- ONLY discuss topics related to the current DSA problem
- DO NOT help with non-DSA topics
- If asked about unrelated topics, politely redirect

Remember: Your goal is to help users learn and understand DSA concepts through the lens of the current problem.
`
      }
    });

    res.status(201).json({
      message: response.text
    });
  } catch (err) {
    res.status(500).json({
      message: "Internal server error"
    });
  }
};
```

### Chat State Management
```javascript
// Redux Slice for Chat Messages
export const chatSlice = createSlice({
  name: "chat",
  initialState: {
    messages: []
  },
  reducers: {
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    clearMessages: (state) => {
      state.messages = [];
    }
  }
});

// Chat Component Integration
const onSubmit = async (data) => {
  const userMessage = {
    role: "user",
    parts: [{ text: data.message }],
    time: new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    })
  };

  dispatch(addMessage(userMessage));
  
  try {
    const response = await axiosClient.post("/ai/chat", {
      messages: [...messages, userMessage].map(msg => ({
        role: msg.role,
        parts: [{ text: msg.parts[0].text }]
      })),
      title: problem.title,
      description: problem.description,
      testCases: problem.visibleTestCases,
      startCode: problem.startCode
    });

    const aiMessage = {
      role: "model",
      parts: [{ text: response.data.message }],
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
      })
    };

    dispatch(addMessage(aiMessage));
  } catch (error) {
    // Handle error
  }
};
```

## 🚀 Performance Considerations

### Frontend Optimizations

#### Code Splitting
```javascript
// Route-based code splitting
const Home = lazy(() => import('./pages/Home'));
const ProblemPage = lazy(() => import('./pages/ProblemPageUpdated'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

// Component with Suspense
<Suspense fallback={<ShimmerHomepage />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/problem/:problemId" element={<ProblemPage />} />
    <Route path="/admin" element={<AdminPanel />} />
  </Routes>
</Suspense>
```

#### State Management Optimization
```javascript
// Memoized selectors
const selectProblems = createSelector(
  [state => state.problem.problems],
  (problems) => problems
);

// Component memoization
const ProblemCard = memo(({ problem, onSelect }) => {
  return (
    <div onClick={() => onSelect(problem._id)}>
      {problem.title}
    </div>
  );
});
```

### Backend Optimizations

#### Database Indexing
```javascript
// Compound indexes for efficient queries
submissionSchema.index({ userId: 1, problemId: 1 });
problemSchema.index({ difficulty: 1, tags: 1 });
userSchema.index({ emailId: 1 }, { unique: true });
```

#### Redis Caching
```javascript
// Rate limiting with Redis
export const rateLimiter = (options = {}) => {
  const {
    maxRequests = 100,
    windowSizeInSeconds = 60,
    prefix = 'ratelimit:'
  } = options;

  return async (req, res, next) => {
    try {
      const key = `${prefix}${req.ip}`;
      const currentCount = await client.incr(key);
      
      if (currentCount === 1) {
        await client.expire(key, windowSizeInSeconds);
      }
      
      if (currentCount > maxRequests) {
        return res.status(429).json({
          success: false,
          message: 'Too many requests, please try again later.'
        });
      }
      
      next();
    } catch (error) {
      next(); // Allow request if Redis fails
    }
  };
};
```

### Socket.IO Optimizations
```javascript
// Selective broadcasting
socket.to(roomId).emit('code-update', data); // Only to room members

// Debounced events
const debouncedEmit = debounce((event, data) => {
  socket.emit(event, data);
}, 100);

// Connection pooling
const io = new Server(server, {
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
  pingInterval: 25000
});
```

## 🔒 Security Implementation

### Input Validation
```javascript
// Zod schema validation
const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password is too weak")
});

// Server-side validation
export const validatorcheck = (data) => {
  const mandatoryFields = ["firstname", "email", "password"];
  const isAllowedFields = mandatoryFields.every(field => field in data);
  
  if (!isAllowedFields) {
    return { error: "All fields are required" };
  }
  
  const { firstname, email, password } = data;
  
  if (!validator.isEmail(email)) {
    return { error: "Invalid email format" };
  }
  
  if (!validator.isStrongPassword(password)) {
    return {
      error: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    };
  }
  
  return null;
};
```

### CORS Configuration
```javascript
const corsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
```

### File Upload Security
```javascript
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Validate file type
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed!"), false);
    }
  }
});
```

## 📊 Monitoring & Logging

### Error Handling
```javascript
// Global error handler
app.use((error, req, res, next) => {
  console.error('Error:', error);
  
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      details: error.errors
    });
  }
  
  if (error.name === 'CastError') {
    return res.status(400).json({
      success: false,
      message: 'Invalid ID format'
    });
  }
  
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});
```

### Request Logging
```javascript
// Custom logging middleware
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
  });
  
  next();
};

app.use(requestLogger);
```

## 🧪 Testing Strategies

### Unit Testing Example
```javascript
// Jest test for authentication
describe('Authentication', () => {
  test('should register user successfully', async () => {
    const userData = {
      firstName: 'John',
      email: 'john@test.com',
      password: 'SecurePass123!'
    };
    
    const response = await request(app)
      .post('/user/register')
      .send(userData)
      .expect(201);
    
    expect(response.body.message).toBe('User registered successfully');
    expect(response.body.user.firstName).toBe('John');
  });
});
```

### Socket.IO Testing
```javascript
// Socket.IO event testing
describe('Collaboration Features', () => {
  test('should handle typing indicators', (done) => {
    const client1 = io('http://localhost:3000');
    const client2 = io('http://localhost:3000');
    
    client1.emit('join-room', { 
      roomId: 'test', 
      userId: '1', 
      userName: 'User1' 
    });
    
    client2.emit('join-room', { 
      roomId: 'test', 
      userId: '2', 
      userName: 'User2' 
    });
    
    client1.emit('typing-start', { roomId: 'test' });
    
    client2.on('user-typing', (data) => {
      expect(data.isTyping).toBe(true);
      expect(data.userName).toBe('User1');
      done();
    });
  });
});
```

## 🚀 Deployment Guide

### Production Environment Setup
```bash
# Build frontend
cd Frontend
npm run build

# Install PM2 for process management
npm install -g pm2

# Start backend with PM2
cd Backend
pm2 start ecosystem.config.js

# Nginx configuration for reverse proxy
server {
    listen 80;
    server_name yourdomain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### Environment Variables Checklist
```bash
# Required for production
NODE_ENV=production
JWT_SECRET=your-strong-secret
MONGODB_URI=mongodb+srv://...
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password
RAPIDAPI_KEY=your-rapidapi-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
GEMINI_KEY=your-gemini-key
```

This technical documentation provides a comprehensive overview of the CodeBuddy platform's architecture, implementation details, and best practices. Use it as a reference for development, debugging, and scaling the application.