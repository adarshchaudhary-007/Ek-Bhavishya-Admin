# Call & Real-time Features Documentation

## Overview

This document describes the complete call system implemented for the Ek Bhavishya platform, including video calls with Agora, chat functionality with Socket.io, and related UI components.

## Architecture

```
components/user/
├── CallControls.tsx                  # Call control buttons (mute, video, screen share, end)
├── CallTimer.tsx                     # Timer component showing elapsed time
├── LocalVideoPreview.tsx             # Display user's own video feed
├── RemoteUserVideo.tsx               # Display remote participant's video
├── CallQualityIndicator.tsx          # Network quality and stats display
├── RatingReviewModal.tsx             # Post-call rating and review dialog
├── IncomingCallNotification.tsx      # Incoming call alert notification
├── AgoraCallSession.tsx              # Main call session manager
└── index.ts                          # Barrel export file

hooks/
├── useAgora.ts                       # Agora SDK integration hook
└── useSocket.ts                      # Socket.io integration hook (to be created)

context/
├── SocketContext.tsx                 # Socket.io connection lifecycle wrapper
├── ChatContext.tsx                   # Chat state management
└── AuthContext.tsx                   # Authentication & multi-role support

lib/
├── socket.ts                         # Socket.io client wrapper
└── axios.ts                          # API client (to be extended)

app/(user)/
├── calls/page.tsx                    # Calls page with history and active calls
├── chat/page.tsx                     # Real-time chat interface
└── notifications/page.tsx            # Notification center
```

## Components Documentation

### 1. AgoraCallSession

**Main integration component that combines all call features.**

```tsx
import { AgoraCallSession } from '@/components/user';

<AgoraCallSession
  channelName="astro-call-user123"
  userName="You"
  remoteUserName="Astrologer Name"
  onCallEnd={() => handleEndCall()}
  layout="picture-in-picture" // or "grid"
  showQualityDetails={true}
/>
```

**Props:**
- `channelName` (required): Agora channel name for the call
- `token` (optional): Agora token for authentication
- `appId` (optional): Agora App ID (defaults to env var)
- `userName` (optional): Your name, default "You"
- `remoteUserName` (optional): Other participant's name
- `onCallEnd` (callback): Called when call ends
- `onError` (callback): Error handler
- `showQualityDetails` (boolean): Show network stats, default false
- `layout` ('picture-in-picture' | 'grid'): Video layout mode

**Features:**
- Automatic connection/disconnection
- Mute/unmute audio
- Toggle video on/off
- Screen sharing support
- Network quality monitoring
- Call timer with elapsed time
- Call statistics
- Error handling with toasts

### 2. CallControls

**Button panel for call actions.**

```tsx
import { CallControls } from '@/components/user';

<CallControls
  isMuted={false}
  isVideoOn={true}
  isScreenSharing={false}
  onToggleMute={() => toggleMute()}
  onToggleVideo={() => toggleVideo()}
  onToggleScreenShare={() => toggleScreenShare()}
  onEndCall={() => endCall()}
  onReport={() => reportCall()}
/>
```

**Props:**
- `isMuted`: Current mute state
- `isVideoOn`: Current video state
- `isScreenSharing`: Current screen share state
- `onToggleMute`: Handler for mute button
- `onToggleVideo`: Handler for video button
- `onToggleScreenShare`: Handler for screen share button
- `onEndCall`: Handler for end call button
- `onReport`: Handler for report button (optional)
- `isLoading`: Disable buttons while loading

### 3. CallTimer

**Display elapsed call duration.**

```tsx
import { CallTimer, CallTimerCard } from '@/components/user';

// Inline version
<CallTimer 
  startTime={Math.floor(Date.now() / 1000)} 
  isActive={true}
  format="compact" // "5:32" or "full" = "5 minutes 32 seconds"
/>

// Card version
<CallTimerCard 
  startTime={startTime}
  isActive={true}
  format="full"
/>
```

**Props:**
- `startTime`: Unix timestamp when call started
- `isActive`: Whether timer is running
- `format`: 'compact' (00:00) or 'full' (X minutes Y seconds)

### 4. LocalVideoPreview

**Display your own video feed.**

```tsx
import { LocalVideoPreview, PictureInPictureLayout } from '@/components/user';

// Simple preview
<LocalVideoPreview
  videoTrack={localVideoTrack}
  isMuted={isMuted}
  isVideoOn={isVideoOn}
  userName="You"
  size="small" // "small" | "medium" | "large"
/>

// Picture-in-Picture layout
<PictureInPictureLayout
  localVideoTrack={localVideoTrack}
  isMuted={isMuted}
  isVideoOn={isVideoOn}
  userName="You"
  remoteUserName="Astrologer"
  remoteVideoElement={<RemoteVideo />}
/>
```

**Props for LocalVideoPreview:**
- `videoTrack`: Agora video track object
- `isMuted`: Audio mute status
- `isVideoOn`: Video enabled status
- `userName`: Display name
- `size`: 'small' (96px), 'medium' (160px), 'large' (full width)
- `showUserLabel`: Show name label, default true

### 5. RemoteUserVideo & RemoteUserGrid

**Display other participants' videos.**

```tsx
import { RemoteUserVideo, RemoteUserGrid } from '@/components/user';

// Single user
<RemoteUserVideo
  uid={12345}
  userName="Astrologer Name"
  videoTrack={videoTrack}
  audioTrack={audioTrack}
  isAudioEnabled={true}
  isVideoEnabled={true}
/>

// Multiple users in grid
<RemoteUserGrid
  remoteUsers={[
    {
      uid: 1,
      name: "Astrologer",
      videoTrack,
      audioTrack,
      isAudioEnabled: true,
      isVideoEnabled: true
    }
  ]}
  gridCols={2}
  maxHeight="max-h-96"
/>
```

### 6. CallQualityIndicator

**Network quality and call statistics.**

```tsx
import { CallQualityIndicator, CallStats } from '@/components/user';

// Quality badge
<CallQualityIndicator
  quality="good" // "excellent" | "good" | "fair" | "poor" | "very-poor"
  showDetails={false}
/>

// Detailed stats
<CallQualityIndicator
  quality="good"
  latency={45}
  packetLoss={0.5}
  bitrate={3500}
  showDetails={true}
/>

// Call statistics
<CallStats
  startTime={callStartTime}
  callCount={1}
  totalCallDuration={600}
  averageCallDuration={600}
/>
```

**Network Quality Levels:**
- `excellent`: Perfect 🟢
- `good`: Good 🟢 (can animate)
- `fair`: Acceptable 🟡
- `poor`: Bad 🔴
- `very-poor`: Very Bad 🔴 (warning shown)

### 7. RatingReviewModal

**Post-call rating and review dialog.**

```tsx
import { RatingReviewModal } from '@/components/user';

<RatingReviewModal
  open={showRatingModal}
  onOpenChange={setShowRatingModal}
  onSubmit={(rating, review) => {
    console.log('Rating:', rating, 'Review:', review);
  }}
  astrologerName="Rajesh Kumar"
  callDuration="15 mins"
/>
```

**Props:**
- `open`: Dialog open state
- `onOpenChange`: Set open state callback
- `onSubmit`: Handle rating submission (rating: 1-5, review: optional)
- `astrologerName`: Name to display
- `callDuration`: Call length for display
- `defaultRating`: Initial star rating (optional)

**Features:**
- 5-star rating selector
- Optional review text area
- 30-second timeout before auto-close
- Toast notifications on submit
- Controlled/uncontrolled component modes

### 8. IncomingCallNotification

**Full-screen incoming call alert.**

```tsx
import { IncomingCallNotification } from '@/components/user';

<IncomingCallNotification
  open={showNotification}
  onOpenChange={setShowNotification}
  callerName="Priya Sharma"
  callType="video" // "video" | "audio"
  onAccept={() => acceptCall()}
  onDecline={() => declineCall()}
/>
```

**Props:**
- `open`: Dialog open state
- `onOpenChange`: Set state callback
- `callerName`: Incoming caller's name
- `callType`: 'video' or 'audio'
- `onAccept`: Accept call handler
- `onDecline`: Decline call handler
- `showTimer`: Show 30-second countdown (default true)

**Features:**
- Full-screen modal
- 30-second auto-decline timer
- Pulsing animation
- Gradient background
- Emoji avatar display

## Hooks

### useAgora

**Agora SDK integration hook.**

```tsx
import { useAgora } from '@/hooks/useAgora';

const {
  isJoined,        // boolean - connected to channel
  isLoading,       // boolean - connecting
  isMuted,         // boolean - audio muted
  isVideoEnabled,  // boolean - video on
  isScreenSharing, // boolean - sharing screen
  localAudioTrack, // IAudioTrack - your audio
  localVideoTrack, // IVideoTrack - your video
  remoteUsers,     // Array - other participants
  networkQuality,  // 'excellent' | 'good' | 'fair' | 'poor' | 'very-poor'
  error,           // Error | null
  
  // Methods
  join,            // () => Promise<void>
  leave,           // () => Promise<void>
  toggleMute,      // () => void
  toggleVideo,     // () => void
  toggleScreenShare, // () => void
} = useAgora({
  appId: 'YOUR_AGORA_APP_ID',
  channelName: 'call-channel',
  token: 'agora-token' // optional
});
```

## Context Providers

### SocketContext

**Manages Socket.io connection lifecycle.**

```tsx
import { useSocket } from '@/context/SocketContext';

const { socket, isConnected } = useSocket();

// Socket is auto-connected when authenticated
// Socket is auto-disconnected when logged out
```

### ChatContext

**Manages chat conversations and messages.**

```tsx
import { useChat } from '@/context/ChatContext';

const {
  // State
  activeConversation,
  conversations,
  
  // Methods
  setActiveConversation,
  sendMessage,
  loadConversationHistory,
  markMessagesAsRead,
  setTypingStatus,
  getOrCreateConversation,
} = useChat();
```

## Pages

### /user/calls

**Call history and active call management.**

Features:
- Call statistics (total calls, duration, spent, rating)
- Call history with sorting and filtering
- Active call modal with Agora integration
- Post-call rating modal
- Call disputes/support tab

**Key Interactions:**
1. User clicks "Initiate Call" → AgoraCallSession opens
2. Call connects and displays video/audio
3. CallControls manage mute/video/screen share
4. CallTimer shows elapsed time
5. User clicks "End Call" → Triggers RatingReviewModal
6. User rates and reviews → Data saved to API

### /user/chat

**Real-time messaging with Socket.io.**

Features:
- Conversation list with unread badges
- Message display with sender alignment
- Real-time typing indicators
- Socket.io event listeners
- Connection status indicator

**Socket Events:**
- `message:send` → Send message to astrologer
- `message:received` → Receive message from astrologer
- `typing:set` → Update typing status
- `chat:join` → Enter conversation
- `chat:leave` → Exit conversation

### /user/notifications

**Notification center for all activity.**

Features:
- Notification filtering (all, unread, by type)
- Mark as read individual/all
- Delete notifications
- Icons and colors by type
- Real-time timestamp display

**Notification Types:**
- `message`: New messages from astrologers
- `call`: Incoming calls
- `booking`: Session confirmations
- `review`: Rating reminders

## Environment Variables

```bash
# .env.local
NEXT_PUBLIC_AGORA_APP_ID=${your_agora_app_id}
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
API_BASE_URL=http://localhost:8000
```

## API Integration Points

**Endpoints to implement (in lib/axios.ts and hooks):**

### Call Endpoints
- `POST /api/v1/calls/initiate` - Start a call
- `POST /api/v1/calls/{callId}/end` - End a call
- `POST /api/v1/calls/{callId}/rate` - Rate a call
- `GET /api/v1/calls/history` - Get call history
- `GET /api/v1/calls/stats` - Get call statistics
- `POST /api/v1/calls/{callId}/report` - Report a call issue

### Agora Token Endpoints
- `POST /api/v1/agora/token` - Generate Agora token
- `POST /api/v1/agora/rtc-token` - RTC token for calls

### Chat Endpoints
- `GET /api/v1/chat/conversations` - Get conversations
- `GET /api/v1/chat/conversations/{id}/messages` - Get message history
- `POST /api/v1/chat/messages` - Send message (fallback if Socket fails)
- `PUT /api/v1/chat/messages/{id}/read` - Mark as read

## Usage Examples

### Complete Call Flow

```tsx
'use client';

import { useState } from 'react';
import { AgoraCallSession, RatingReviewModal } from '@/components/user';
import { Dialog, DialogContent } from '@/components/ui/dialog';

export function CallPage() {
  const [activeCallId, setActiveCallId] = useState<string | null>(null);
  const [showRating, setShowRating] = useState(false);

  return (
    <>
      {/* Call Dialog */}
      <Dialog open={!!activeCallId} onOpenChange={() => setActiveCallId(null)}>
        <DialogContent className="max-w-4xl">
          <AgoraCallSession
            channelName={`call-${activeCallId}`}
            onCallEnd={() => {
              setActiveCallId(null);
              setShowRating(true);
            }}
            layout="picture-in-picture"
          />
        </DialogContent>
      </Dialog>

      {/* Rating Modal */}
      <RatingReviewModal
        open={showRating}
        onOpenChange={setShowRating}
        onSubmit={(rating, review) => {
          // Save to API
          console.log('Rating:', rating, review);
        }}
      />
    </>
  );
}
```

### Chat Integration

```tsx
'use client';

import { useSocket } from '@/context/SocketContext';
import { useChat } from '@/context/ChatContext';

export function ChatPage() {
  const { socket, isConnected } = useSocket();
  const { activeConversation, sendMessage } = useChat();

  const handleSendMessage = (content: string) => {
    socket?.emit('message:send', {
      conversationId: activeConversation?._id,
      content,
      timestamp: new Date(),
    });
  };

  return (
    <div>
      <p>Status: {isConnected ? '🟢 Connected' : '🔴 Disconnected'}</p>
      {/* Chat UI */}
    </div>
  );
}
```

## Testing Checklist

- [ ] **Agora Connection**
  - [ ] Verify `NEXT_PUBLIC_AGORA_APP_ID` is set
  - [ ] Check token generation endpoint works
  - [ ] Test video/audio permissions

- [ ] **Video/Audio**
  - [ ] Local video displays correctly
  - [ ] Remote video displays when available
  - [ ] Mute/unmute toggles work
  - [ ] Video on/off toggles work

- [ ] **Controls**
  - [ ] Call timer updates every second
  - [ ] Quality indicator shows correct status
  - [ ] Screen share works (if supported)
  - [ ] End call triggers rating modal

- [ ] **Chat**
  - [ ] Socket connects on login
  - [ ] Socket disconnects on logout
  - [ ] Messages send and receive
  - [ ] Typing indicators display
  - [ ] Connection status updates

- [ ] **Responsive Design**
  - [ ] Desktop (1920x1080)
  - [ ] Tablet (768x1024)
  - [ ] Mobile (375x812)

- [ ] **Dark/Light Mode**
  - [ ] All components display correctly in both themes
  - [ ] No contrast issues

## Known Limitations

1. **Agora SDK**: Requires valid App ID and token
2. **Socket.io**: Requires backend server running
3. **Screen Share**: Not supported on all browsers/devices
4. **Web Only**: No native app support yet
5. **Group Calls**: Currently supports 1-on-1 only (can extend to group)

## Future Enhancements

- [ ] Group video calls (3+ participants)
- [ ] Call recordings
- [ ] Call transcripts
- [ ] AI-powered call summaries
- [ ] Call boost/priority queue
- [ ] Virtual backgrounds
- [ ] Call statistics/analytics
- [ ] Complaint/dispute resolution system
- [ ] Integration with payment gateway
- [ ] Call forwarding to phone
