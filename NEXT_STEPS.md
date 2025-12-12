# Next Steps - TODOs for Dev 2, 3, and 4

This document outlines all the pending integrations and tasks for the remaining developers on the InterviewLabs AI project.

---

## 🔥 Dev 2: Firebase Integration

### 1. Firebase Authentication

#### Setup
- [ ] Create Firebase project in Firebase Console
- [ ] Install Firebase dependencies:
  ```bash
  npm install firebase firebase-admin
  ```
- [ ] Create `src/lib/firebase/config.ts` with Firebase configuration
- [ ] Create `src/lib/firebase/admin.ts` for server-side Firebase Admin SDK

#### Client-Side Authentication

**File: `src/app/login/page.tsx`**
- Line 16: Replace `console.log` with actual Firebase sign-in
- Implement `signInWithEmailAndPassword(auth, email, password)`
- Handle errors and redirect to `/app/dashboard` on success
- Add loading states and error messages

**File: `src/app/register/page.tsx`**
- Line 16: Replace `console.log` with actual Firebase registration
- Implement `createUserWithEmailAndPassword(auth, email, password)`
- Handle errors and redirect to `/app/dashboard` on success
- Add loading states and error messages

**File: `src/components/layout/AppShell.tsx`**
- Line 47: Implement logout functionality
- Replace `console.log` with `signOut(auth)`
- Redirect to `/login` after logout

#### Server-Side Authentication

**File: `src/app/app/layout.tsx`**
- Line 7: Add route protection using Firebase Admin
- Create `getCurrentUserServer()` helper function
- Verify session cookie or token
- Redirect to `/login` if not authenticated
- Example implementation:
  ```typescript
  import { cookies } from 'next/headers';
  import { verifySessionCookie } from '@/lib/firebase/admin';
  
  export default async function AppLayout({ children }) {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    
    if (!session) {
      redirect('/login');
    }
    
    try {
      await verifySessionCookie(session);
    } catch (error) {
      redirect('/login');
    }
    
    return <AppShell>{children}</AppShell>;
  }
  ```

### 2. Firestore Database Integration

#### Collections Structure
Create the following Firestore collections:

```
users/
  {userId}/
    - email: string
    - createdAt: timestamp
    - displayName?: string

profiles/
  {profileId}/
    - userId: string
    - name: string
    - type: "Job Interview" | "Visa Interview" | "Academic Interview"
    - language: string
    - level: string
    - description: string
    - createdAt: timestamp
    - updatedAt: timestamp

sessions/
  {sessionId}/
    - profileId: string
    - userId: string
    - conversationId: string (from ElevenLabs)
    - score: number
    - duration: number (in seconds)
    - startedAt: timestamp
    - endedAt: timestamp
    - transcript: array of {role, content, timestamp}
```

#### Data Fetching

**File: `src/app/app/dashboard/page.tsx`**
- Line 3: Remove mock data
- Fetch user's profiles from Firestore
- Filter by current user's ID
- Handle loading and error states
- Example:
  ```typescript
  const user = await getCurrentUser();
  const profilesSnapshot = await db
    .collection('profiles')
    .where('userId', '==', user.uid)
    .get();
  const profiles = profilesSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
  ```

**File: `src/app/app/profile/[profileId]/overview/page.tsx`**
- Line 12: Remove mock data
- Fetch profile data from Firestore by `profileId`
- Verify user owns this profile
- Handle not found cases

**File: `src/app/app/profile/[profileId]/progress/page.tsx`**
- Line 11: Remove mock data
- Fetch sessions from Firestore filtered by `profileId`
- Calculate current score (average or latest)
- Fetch recent sessions (last 3)
- Generate chart data from session history

---

## 🎙️ Dev 3: ElevenLabs Integration

### 1. ElevenLabs Setup

#### Installation
- [ ] Sign up for ElevenLabs account
- [ ] Get API key and Agent ID
- [ ] Install ElevenLabs SDK (if available) or use REST API
- [ ] Store credentials in environment variables:
  ```
  NEXT_PUBLIC_ELEVENLABS_API_KEY=your_api_key
  NEXT_PUBLIC_ELEVENLABS_AGENT_ID=your_agent_id
  ```

### 2. Voice Agent Integration

**File: `src/app/app/profile/[profileId]/interview/page.tsx`**

#### Line 14: Initialize ElevenLabs Widget
- Load ElevenLabs widget script
- Initialize agent in the `#eleven-agent-widget-root` div
- Configure agent with profile-specific context
- Example:
  ```typescript
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://elevenlabs.io/convai-widget/index.js';
    script.async = true;
    document.body.appendChild(script);
    
    script.onload = () => {
      window.ElevenLabs.initialize({
        agentId: process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID,
        targetElement: 'eleven-agent-widget-root',
        onConversationStart: handleConversationStart,
        onMessage: handleMessage,
        onConversationEnd: handleConversationEnd,
      });
    };
  }, []);
  ```

#### Line 15: Handle Conversation End
- When interview ends, get `conversationId` from ElevenLabs
- Save session data to Firestore:
  - conversationId
  - transcript
  - duration
  - timestamp
- Calculate score (if provided by ElevenLabs or implement scoring logic)
- Navigate to progress page with session data

### 3. Real-Time Transcript

**File: `src/components/interview/TranscriptMock.tsx`**
- Replace mock messages with real-time transcript
- Listen to ElevenLabs message events
- Update transcript state as conversation progresses
- Auto-scroll to latest message
- Example:
  ```typescript
  const [messages, setMessages] = useState<TranscriptMessage[]>([]);
  
  const handleMessage = (message: any) => {
    setMessages(prev => [...prev, {
      role: message.role,
      content: message.content,
      timestamp: new Date().toLocaleTimeString(),
    }]);
  };
  ```

### 4. Agent Configuration

Create profile-specific prompts/contexts:
- Job Interview: Technical questions, behavioral questions
- Visa Interview: Immigration-related questions
- Academic Interview: Research and academic background

Pass context to ElevenLabs agent based on profile type.

---

## 💼 Dev 4: Business Logic & Features

### 1. Scoring System

#### Implement Interview Scoring
- [ ] Define scoring criteria (clarity, content, confidence, etc.)
- [ ] Integrate with ElevenLabs transcript analysis
- [ ] Calculate score after each session
- [ ] Store score in Firestore session document

#### Score Calculation
- Option 1: Use ElevenLabs built-in analysis (if available)
- Option 2: Implement custom scoring with AI (OpenAI, Claude, etc.)
- Option 3: Manual scoring with predefined rubrics

### 2. Profile Management

#### Create Profile Feature
- [ ] Add "Create New Profile" button on dashboard
- [ ] Create form dialog with fields:
  - Profile name
  - Interview type (dropdown)
  - Language (dropdown)
  - Difficulty level
  - Custom instructions/context
- [ ] Save to Firestore with user ID

#### Edit Profile Feature
- [ ] Add edit button on profile overview page
- [ ] Allow updating profile details
- [ ] Update Firestore document

#### Delete Profile Feature
- [ ] Add delete button with confirmation dialog
- [ ] Delete profile and associated sessions
- [ ] Redirect to dashboard

### 3. Session Management

#### Session History
- [ ] Create detailed session view page
- [ ] Show full transcript
- [ ] Display score breakdown
- [ ] Allow replay of audio (if ElevenLabs provides)

#### Session Analytics
- [ ] Track improvement over time
- [ ] Identify weak areas
- [ ] Provide recommendations

### 4. Progress Tracking Enhancements

**File: `src/app/app/profile/[profileId]/progress/page.tsx`**

#### Advanced Charts
- [ ] Install chart library (recharts, chart.js, etc.):
  ```bash
  npm install recharts
  ```
- [ ] Replace simple bar chart with line chart
- [ ] Add multiple metrics (score, duration, confidence)
- [ ] Add date range filters

#### Statistics
- [ ] Average score
- [ ] Total practice time
- [ ] Sessions completed
- [ ] Improvement percentage
- [ ] Streak tracking

### 5. User Settings

#### Create Settings Page
- [ ] User profile management
- [ ] Email/password update
- [ ] Notification preferences
- [ ] Language preferences
- [ ] Theme toggle (light/dark mode)

### 6. Error Handling & Loading States

#### Global Error Handling
- [ ] Create error boundary components
- [ ] Add toast notifications for errors
- [ ] Implement retry logic for failed requests

#### Loading States
- [ ] Add skeleton loaders for data fetching
- [ ] Show loading spinners during authentication
- [ ] Disable buttons during form submission

### 7. Data Validation

#### Form Validation
- [ ] Add Zod or Yup for schema validation
- [ ] Validate email format
- [ ] Password strength requirements
- [ ] Profile form validation

### 8. Security

#### Environment Variables
- [ ] Move all API keys to `.env.local`
- [ ] Add `.env.example` template
- [ ] Document required environment variables

#### Rate Limiting
- [ ] Implement rate limiting for API calls
- [ ] Prevent abuse of interview sessions

#### Data Privacy
- [ ] Ensure user data isolation in Firestore rules
- [ ] Implement proper security rules:
  ```javascript
  rules_version = '2';
  service cloud.firestore {
    match /databases/{database}/documents {
      match /profiles/{profileId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == resource.data.userId;
      }
      match /sessions/{sessionId} {
        allow read, write: if request.auth != null 
          && request.auth.uid == resource.data.userId;
      }
    }
  }
  ```

---

## 📦 Additional Recommendations

### Testing
- [ ] Add unit tests for components (Jest + React Testing Library)
- [ ] Add E2E tests for critical flows (Playwright/Cypress)
- [ ] Test authentication flows
- [ ] Test interview session flow

### Performance
- [ ] Implement code splitting
- [ ] Optimize images with Next.js Image component
- [ ] Add caching for Firestore queries
- [ ] Implement pagination for session history

### Accessibility
- [ ] Add ARIA labels
- [ ] Ensure keyboard navigation
- [ ] Test with screen readers
- [ ] Add focus indicators

### Documentation
- [ ] Document API endpoints (if any)
- [ ] Create user guide
- [ ] Add inline code comments
- [ ] Update README with setup instructions

---

## 🚀 Deployment Checklist

- [ ] Set up Vercel/Netlify project
- [ ] Configure environment variables in deployment platform
- [ ] Set up Firebase production project
- [ ] Configure custom domain
- [ ] Enable analytics (Google Analytics, Vercel Analytics)
- [ ] Set up error monitoring (Sentry)
- [ ] Configure CI/CD pipeline

---

## 📞 Questions or Issues?

If you encounter any issues or need clarification on the existing code structure:

1. Check the [walkthrough.md](file:///Users/salomon/.gemini/antigravity/brain/0b17cdae-2215-4a6f-8fb5-997b75ed080c/walkthrough.md) for detailed project overview
2. Review the TODO comments in the code (search for `TODO:`)
3. Consult the team for architectural decisions

---

**Good luck with the integrations! 🎉**
