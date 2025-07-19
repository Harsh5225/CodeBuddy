# Real-Time Typing Indicator & Presence Documentation

## Overview
This documentation covers the implementation of real-time typing indicators and user presence features in the collaborative coding platform using Socket.IO.

## Features Implemented

### 1. Real-Time Typing Indicators
- **Visual Feedback**: Shows animated dots when users are typing
- **Multi-User Support**: Displays multiple users typing simultaneously
- **Smart Display**: Handles overflow with "and X others are typing..."
- **Auto-Cleanup**: Automatically removes typing indicators after inactivity

### 2. User Presence System
- **Online Status**: Real-time online/offline status tracking
- **Away Detection**: Automatically detects when users become inactive
- **Status Colors**: Visual indicators with color-coded status
- **Last Activity**: Tracks and displays last seen information

### 3. Enhanced User Interface
- **Status Avatars**: User avatars with status indicators
- **Presence Tooltips**: Hover information showing user status
- **Room Member List**: Detailed view of all room participants
- **Activity Tracking**: Real-time activity updates

## Technical Implementation

### Backend Changes (Socket.IO Server)

#### New Data Structures
```javascript
const typingUsers = new Map() // Track typing users per room
const userPresence = new Map() // Track user presence and last activity
```

#### Key Socket Events Added

1. **typing-start/typing-stop**: Handle typing indicator state
2. **user-activity**: Track user activity for presence
3. **status-change**: Handle manual status changes
4. **user-presence-update**: Broadcast presence changes
5. **user-status-changed**: Notify status changes

#### Automatic Presence Detection
- **Away Detection**: Users marked as "away" after 2 minutes of inactivity
- **Offline Detection**: Users marked as "offline" after 5 minutes of inactivity
- **Periodic Checks**: Server checks user activity every 30 seconds

### Frontend Changes

#### New Components

1. **TypingIndicator.jsx**
   - Displays typing users with animated dots
   - Handles multiple users typing
   - Smart text formatting for different user counts

2. **UserPresenceIndicator.jsx**
   - Shows user avatars with status indicators
   - Provides detailed and compact views
   - Displays tooltips with user information

#### Enhanced CollaborativeEditor
- **Real-time typing detection**: Tracks when users start/stop typing
- **Activity tracking**: Sends activity updates on various interactions
- **Presence integration**: Shows user status in real-time
- **Enhanced user list**: Displays all room members with status

## Usage Examples

### Basic Typing Indicator
```jsx
<TypingIndicator 
  typingUsers={typingUsers} 
  currentUser={user}
/>
```

### User Presence (Compact View)
```jsx
<UserPresenceIndicator 
  users={roomUsers} 
  currentUser={user}
  maxVisible={3}
/>
```

### User Presence (Detailed View)
```jsx
<UserPresenceIndicator 
  users={roomUsers} 
  currentUser={user}
  showDetails={true}
/>
```

## Socket Events Reference

### Client to Server Events

| Event | Payload | Description |
|-------|---------|-------------|
| `typing-start` | `{ roomId }` | User started typing |
| `typing-stop` | `{ roomId }` | User stopped typing |
| `user-activity` | `{ roomId }` | User performed an activity |
| `status-change` | `{ roomId, status }` | User changed status manually |

### Server to Client Events

| Event | Payload | Description |
|-------|---------|-------------|
| `user-typing` | `{ userId, userName, isTyping, typingUsers }` | Typing state changed |
| `user-presence-update` | `{ userId, userName, status, lastActivity }` | Presence updated |
| `user-status-changed` | `{ userId, userName, status, lastActivity }` | Status changed |
| `room-state` | `{ code, language, users, messages, typingUsers }` | Complete room state |

## Status Types

### User Status Values
- **online**: User is actively using the application
- **away**: User is inactive for 2+ minutes
- **busy**: User manually set status to busy
- **offline**: User is disconnected or inactive for 5+ minutes

### Status Colors
- **Online**: Blue (`bg-blue-400`)
- **Away**: Yellow (`bg-yellow-400`)
- **Busy**: Red (`bg-red-400`)
- **Offline**: Gray (`bg-gray-400`)

## Configuration Options

### Timing Configuration
```javascript
const INACTIVE_THRESHOLD = 5 * 60 * 1000 // 5 minutes for offline
const AWAY_THRESHOLD = 2 * 60 * 1000     // 2 minutes for away
const TYPING_TIMEOUT = 1000              // 1 second typing timeout
const PRESENCE_CHECK_INTERVAL = 30000    // 30 seconds presence check
```

### Display Configuration
```javascript
const MAX_VISIBLE_USERS = 5              // Max users shown in compact view
const MAX_TYPING_DISPLAY = 2             // Max typing users shown by name
```

## Performance Considerations

### Memory Management
- **Automatic Cleanup**: Typing states and presence data are cleaned up on disconnect
- **Room Cleanup**: Empty rooms are automatically deleted after timeout
- **Efficient Updates**: Only sends updates when status actually changes

### Network Optimization
- **Debounced Typing**: Typing indicators use debouncing to reduce network traffic
- **Batch Updates**: Multiple status changes are batched together
- **Selective Broadcasting**: Updates only sent to relevant room members

## Scalability Notes

### Production Considerations
1. **Redis Integration**: For multi-server deployments, use Redis to store:
   - Room data
   - User presence information
   - Typing states

2. **Database Persistence**: Consider persisting:
   - User last activity
   - Room participation history
   - User preferences

3. **Rate Limiting**: Implement rate limiting for:
   - Typing events
   - Status changes
   - Activity updates

### Example Redis Integration
```javascript
// Store typing users in Redis
await redis.sadd(`typing:${roomId}`, userName)
await redis.expire(`typing:${roomId}`, 10) // Auto-expire after 10 seconds

// Store user presence
await redis.hset(`presence:${userId}`, {
  status: 'online',
  lastActivity: Date.now(),
  roomId: roomId
})
```

## Testing

### Manual Testing Checklist
- [ ] Typing indicators appear when users type
- [ ] Typing indicators disappear after stopping
- [ ] User status changes from online to away automatically
- [ ] User avatars show correct status colors
- [ ] Multiple users typing shows correctly
- [ ] Presence persists across page refreshes
- [ ] Cleanup works on user disconnect

### Automated Testing
```javascript
// Example test for typing indicators
describe('Typing Indicators', () => {
  it('should show typing indicator when user types', async () => {
    const client1 = io('http://localhost:3000')
    const client2 = io('http://localhost:3000')
    
    client1.emit('join-room', { roomId: 'test', userId: '1', userName: 'User1' })
    client2.emit('join-room', { roomId: 'test', userId: '2', userName: 'User2' })
    
    client1.emit('typing-start', { roomId: 'test' })
    
    await new Promise(resolve => {
      client2.on('user-typing', (data) => {
        expect(data.isTyping).toBe(true)
        expect(data.userName).toBe('User1')
        resolve()
      })
    })
  })
})
```

## Troubleshooting

### Common Issues

1. **Typing indicators not clearing**
   - Check typing timeout implementation
   - Verify cleanup on disconnect

2. **Presence not updating**
   - Ensure activity events are being sent
   - Check presence check interval

3. **Status colors not showing**
   - Verify CSS classes are loaded
   - Check status value mapping

### Debug Tools
```javascript
// Enable socket.io debugging
localStorage.debug = 'socket.io-client:socket'

// Log all socket events
socket.onAny((event, ...args) => {
  console.log('Socket event:', event, args)
})
```

## Future Enhancements

### Planned Features
1. **Custom Status Messages**: Allow users to set custom status text
2. **Presence History**: Track user activity patterns
3. **Smart Notifications**: Notify when specific users come online
4. **Voice/Video Indicators**: Show when users are in voice/video calls
5. **Mobile Presence**: Enhanced mobile presence detection

### Advanced Features
1. **Cursor Sharing**: Show real-time cursor positions
2. **Selection Sharing**: Share text selections between users
3. **Focus Indicators**: Show which part of code users are viewing
4. **Collaborative Debugging**: Share breakpoints and debug sessions

This implementation provides a robust foundation for real-time collaboration with typing indicators and presence awareness, enhancing the user experience in collaborative coding sessions.