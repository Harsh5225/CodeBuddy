# CodeBuddy - Collaborative Coding Platform

![CodeBuddy Logo](https://via.placeholder.com/800x200/1e40af/ffffff?text=CodeBuddy+-+Master+Your+Coding+Skills)

## 🚀 Overview

CodeBuddy is a modern, full-stack collaborative coding platform designed to help developers improve their algorithmic problem-solving skills. Built with React, Node.js, and Socket.IO, it provides real-time collaboration features, AI-powered assistance, and comprehensive problem management.

## ✨ Key Features

### 🔐 Authentication & User Management
- **Secure Authentication**: JWT-based authentication with Redis session management
- **Role-based Access**: User and Admin roles with different permissions
- **Profile Management**: Customizable user profiles with photo upload
- **Session Security**: Token blacklisting and automatic logout

### 💻 Problem Solving Environment
- **Monaco Editor Integration**: Professional code editor with syntax highlighting
- **Multi-language Support**: JavaScript, Java, C++, Python
- **Real-time Code Execution**: Judge0 API integration for code testing
- **Test Case Management**: Visible and hidden test cases with detailed feedback

### 🤝 Real-time Collaboration
- **Live Code Sharing**: Real-time collaborative editing
- **Typing Indicators**: See when others are typing
- **User Presence**: Online/Away/Busy/Offline status tracking
- **Room-based Sessions**: Create and join coding rooms
- **Collaborative Chat**: In-room messaging system

### 🤖 AI-Powered Features
- **AI Assistant**: Google Gemini integration for coding help
- **Contextual Hints**: Problem-specific guidance and debugging
- **Solution Explanations**: Step-by-step problem breakdowns

### 📹 Educational Content
- **Video Solutions**: Upload and stream solution explanations
- **Editorial Content**: Comprehensive problem tutorials
- **Reference Solutions**: Multiple language implementations

### 👨‍💼 Admin Panel
- **Problem Management**: Create, edit, and delete problems
- **Video Upload**: Cloudinary integration for video content
- **User Analytics**: Track user progress and submissions
- **Bulk Operations**: Mass problem creation and management

## 🏗️ Architecture

### Frontend (React + Vite)
```
Frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── CollaborativeEditor.jsx
│   │   ├── TypingIndicator.jsx
│   │   ├── UserPresenceIndicator.jsx
│   │   ├── ChatAi.jsx
│   │   └── ...
│   ├── pages/              # Main application pages
│   │   ├── Home.jsx
│   │   ├── ProblemPageUpdated.jsx
│   │   ├── CollaborativeProblemPage.jsx
│   │   ├── AdminPanel.jsx
│   │   └── ...
│   ├── features/           # Redux slices and API
│   │   ├── auth/
│   │   ├── problem/
│   │   ├── chatMessage/
│   │   └── submission/
│   ├── hooks/              # Custom React hooks
│   │   ├── useSocket.js
│   │   └── useLenis.js
│   └── utils/              # Utility functions
│       └── axiosClient.js
```

### Backend (Node.js + Express)
```
Backend/
├── controllers/            # Business logic
│   ├── user.controller.js
│   ├── userProblem.controller.js
│   ├── submission.controller.js
│   ├── solveDoubt.controller.js
│   └── videoSection.controller.js
├── models/                 # MongoDB schemas
│   ├── user.js
│   ├── problem.js
│   ├── submission.js
│   └── solutionVideo.js
├── routes/                 # API endpoints
│   ├── userAuth.js
│   ├── problemcreationRoute.js
│   ├── submission.routes.js
│   └── collaboration.routes.js
├── middlewares/            # Custom middleware
│   ├── isAuthenticate.js
│   ├── userMiddleware.js
│   ├── adminMiddleware.js
│   └── rateLimiter.js
├── socket/                 # Socket.IO handlers
│   └── socketHandlers.js
├── utils/                  # Utility functions
│   ├── submitBatch.js
│   ├── submitToken.js
│   ├── Cloudinary.js
│   └── validator.js
└── database/               # Database connections
    ├── db.js
    └── redis.js
```

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI framework
- **Vite** - Build tool and dev server
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS + DaisyUI** - Styling
- **Monaco Editor** - Code editor
- **Socket.IO Client** - Real-time communication
- **Framer Motion** - Animations
- **React Hook Form + Zod** - Form handling and validation

### Backend
- **Node.js + Express** - Server framework
- **MongoDB + Mongoose** - Database
- **Redis** - Session storage and caching
- **Socket.IO** - Real-time communication
- **JWT** - Authentication
- **Cloudinary** - Media storage
- **Judge0 API** - Code execution
- **Google Gemini AI** - AI assistance
- **Multer** - File uploads

### External Services
- **Judge0 CE** - Code compilation and execution
- **Cloudinary** - Video and image storage
- **Google Gemini** - AI-powered coding assistance
- **Redis Cloud** - Session management

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB
- Redis
- Judge0 API access
- Cloudinary account
- Google Gemini API key

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/yourusername/codebuddy.git
cd codebuddy
```

2. **Install dependencies**
```bash
# Backend
cd Backend
npm install

# Frontend
cd ../Frontend
npm install
```

3. **Environment Setup**

Create `.env` files in both Backend and Frontend directories:

**Backend/.env**
```env
# Database
MONGODB_URI=mongodb://localhost:27017/codebuddy

# Redis
REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password

# JWT
JWT_SECRET=your-jwt-secret

# Judge0 API
RAPIDAPI_KEY=your-rapidapi-key
RAPIDAPI_HOST=judge0-ce.p.rapidapi.com

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google Gemini
GEMINI_KEY=your-gemini-api-key

# Server
PORT=3000
NODE_ENV=development
```

**Frontend/.env**
```env
VITE_API_BASE_URL=http://localhost:3000
```

4. **Start the development servers**
```bash
# Backend (Terminal 1)
cd Backend
npm run dev

# Frontend (Terminal 2)
cd Frontend
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints
```
POST /user/register          # User registration
POST /user/login             # User login
GET  /user/logout            # User logout
GET  /user/check             # Check authentication status
GET  /user/profile           # Get user profile
PUT  /user/edit-profile      # Update user profile
```

### Problem Management
```
GET    /problem              # Get all problems (paginated)
GET    /problem/:id          # Get specific problem
POST   /problem/create       # Create new problem (admin)
PATCH  /problem/:id          # Update problem (admin)
DELETE /problem/:id          # Delete problem (admin)
GET    /problem/userSolvedProblem  # Get user's solved problems
```

### Code Submission
```
POST /submission/run/:id     # Run code with visible test cases
POST /submission/submit/:id  # Submit code for evaluation
GET  /submission/recent      # Get recent submissions
```

### Collaboration
```
POST /collaboration/rooms/create     # Create collaboration room
GET  /collaboration/rooms/:roomId    # Get room information
GET  /collaboration/rooms            # Get all active rooms
```

### AI Assistant
```
POST /ai/chat               # Chat with AI assistant
```

### Video Management (Admin)
```
GET    /video/create/:problemId     # Generate upload signature
POST   /video/save                 # Save video metadata
DELETE /video/delete/:problemId     # Delete video
```

## 🔌 Socket.IO Events

### Client to Server Events
```javascript
// Room Management
socket.emit('join-room', { roomId, userId, userName, problemId })
socket.emit('leave-room', { roomId })

// Code Collaboration
socket.emit('code-change', { roomId, code, changes })
socket.emit('language-change', { roomId, language })
socket.emit('cursor-change', { roomId, position })

// Typing & Presence
socket.emit('typing-start', { roomId })
socket.emit('typing-stop', { roomId })
socket.emit('user-activity', { roomId })
socket.emit('status-change', { roomId, status })

// Communication
socket.emit('send-message', { roomId, message })
socket.emit('share-execution', { roomId, result, type })
```

### Server to Client Events
```javascript
// Room State
socket.on('room-state', { code, language, users, messages, typingUsers })
socket.on('user-joined', { user, totalUsers, onlineUsers })
socket.on('user-left', { userId, userName, totalUsers })

// Code Updates
socket.on('code-update', { code, changes, userId })
socket.on('language-update', { language })
socket.on('cursor-update', { userId, userName, position })

// Presence & Typing
socket.on('user-typing', { userId, userName, isTyping, typingUsers })
socket.on('user-presence-update', { userId, status, lastActivity })
socket.on('user-status-changed', { userId, status, lastActivity })

// Communication
socket.on('new-message', message)
socket.on('execution-shared', executionMessage)
```

## 🎨 UI/UX Features

### Design System
- **Dark Theme**: Modern dark UI with blue accent colors
- **Responsive Design**: Mobile-first approach with breakpoints
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: ARIA labels and keyboard navigation

### Key Components
- **Monaco Editor**: Professional code editing experience
- **Real-time Indicators**: Typing and presence visualization
- **Drag & Drop Chat**: Moveable chat interface
- **Status Avatars**: Visual user presence indicators
- **Progress Tracking**: Problem solving statistics

## 🔒 Security Features

### Authentication Security
- **JWT Tokens**: Secure token-based authentication
- **Token Blacklisting**: Redis-based token revocation
- **Session Management**: Automatic logout on inactivity
- **Password Hashing**: bcrypt for secure password storage

### API Security
- **Rate Limiting**: Redis-based request throttling
- **CORS Configuration**: Secure cross-origin requests
- **Input Validation**: Zod schema validation
- **Role-based Access**: Admin and user permission levels

### Data Protection
- **Secure File Upload**: Cloudinary integration with validation
- **SQL Injection Prevention**: Mongoose ODM protection
- **XSS Protection**: Input sanitization and validation

## 📊 Performance Optimizations

### Frontend Optimizations
- **Code Splitting**: Route-based lazy loading
- **State Management**: Efficient Redux store structure
- **Memoization**: React.memo and useMemo optimizations
- **Bundle Optimization**: Vite build optimizations

### Backend Optimizations
- **Database Indexing**: Optimized MongoDB queries
- **Redis Caching**: Session and rate limiting cache
- **Connection Pooling**: Efficient database connections
- **Memory Management**: Proper cleanup and garbage collection

### Real-time Optimizations
- **Debounced Events**: Reduced socket.io traffic
- **Selective Broadcasting**: Targeted event emission
- **Connection Management**: Automatic reconnection handling

## 🧪 Testing Strategy

### Unit Testing
```bash
# Frontend tests
cd Frontend
npm run test

# Backend tests
cd Backend
npm run test
```

### Integration Testing
- API endpoint testing with Jest/Supertest
- Socket.IO event testing
- Database integration tests

### Manual Testing Checklist
- [ ] User registration and login flow
- [ ] Problem solving workflow
- [ ] Real-time collaboration features
- [ ] Admin panel functionality
- [ ] Mobile responsiveness
- [ ] Cross-browser compatibility

## 🚀 Deployment

### Production Environment Variables
```env
# Security
NODE_ENV=production
JWT_SECRET=strong-production-secret

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/codebuddy

# Redis
REDIS_HOST=production-redis-host
REDIS_PASSWORD=production-redis-password

# External APIs
RAPIDAPI_KEY=production-rapidapi-key
CLOUDINARY_CLOUD_NAME=production-cloudinary
GEMINI_KEY=production-gemini-key
```

### Deployment Steps
1. **Build the frontend**
```bash
cd Frontend
npm run build
```

2. **Deploy backend** (Node.js hosting)
3. **Deploy frontend** (Static hosting like Netlify/Vercel)
4. **Configure environment variables**
5. **Set up monitoring and logging**

## 📈 Monitoring & Analytics

### Performance Monitoring
- **Response Times**: API endpoint performance
- **Error Tracking**: Application error monitoring
- **User Analytics**: Problem solving statistics
- **Real-time Metrics**: Active users and rooms

### Logging
- **Structured Logging**: JSON-formatted logs
- **Error Logging**: Comprehensive error tracking
- **Audit Logs**: User action tracking
- **Performance Logs**: Query and response time tracking

## 🔮 Future Enhancements

### Planned Features
- **Voice/Video Chat**: WebRTC integration for voice communication
- **Code Review System**: Peer code review functionality
- **Contest Mode**: Timed coding competitions
- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Detailed progress tracking

### Technical Improvements
- **Microservices**: Service decomposition for scalability
- **GraphQL API**: More efficient data fetching
- **Progressive Web App**: Offline functionality
- **Advanced Caching**: Redis-based query caching

## 🤝 Contributing

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards
- **ESLint**: JavaScript/React linting
- **Prettier**: Code formatting
- **Conventional Commits**: Standardized commit messages
- **Code Reviews**: All changes require review

### Bug Reports
Please use the GitHub issue tracker to report bugs with:
- Detailed description
- Steps to reproduce
- Expected vs actual behavior
- Environment information

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.


---

**Built with ❤️ by the Harsh **

*Empowering developers to master algorithmic problem solving through collaboration and AI assistance.*