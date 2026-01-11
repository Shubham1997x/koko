# Veterinary Chatbot SDK

A plug-and-play chatbot SDK that answers veterinary-related questions and enables conversational appointment booking. Built with MERN stack, Google Gemini API, and designed to be embeddable into any website with a single script tag.

## 🎯 Features

- **Plug-and-Play SDK**: Embeddable chatbot widget via a single script tag
- **AI-Powered Q&A**: Uses Google Gemini API to answer veterinary questions
- **Appointment Booking**: Conversational flow for booking veterinary appointments
- **Session Management**: Persistent conversations stored in MongoDB
- **Context Support**: Optional configuration for personalized experiences
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Production Ready**: Deployed on Render (backend) and Vercel (frontend)

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup Instructions](#setup-instructions)
- [Deployment](#deployment)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development Journey & Changes](#development-journey--changes)
- [Key Decisions & Trade-offs](#key-decisions--trade-offs)
- [Assumptions](#assumptions)
- [Troubleshooting](#troubleshooting)
- [Future Improvements](#future-improvements)

## 🏗️ Architecture Overview

The project consists of two main components:

1. **Backend (Node.js/Express)**: RESTful API server handling chat messages, AI responses, and appointment bookings
2. **Frontend (React Widget)**: Embeddable chatbot SDK built with React and Webpack, bundled into a single JavaScript file

### System Flow

```
User's Website
    ↓
<script src="chatbot.js"></script>
    ↓
React Widget (Frontend SDK)
    ↓
API Calls (HTTP/REST)
    ↓
Backend Server (Express on Render)
    ↓
    ├──→ MongoDB (Conversations & Appointments)
    └──→ Google Gemini API (AI Responses)
```

### Component Architecture

**Backend:**
- **Controllers**: Handle HTTP requests and responses
- **Services**: Business logic (Gemini API, appointment booking)
- **Models**: MongoDB schemas (Conversation, Appointment)
- **Routes**: API endpoint definitions
- **Middleware**: CORS, error handling

**Frontend:**
- **Components**: React UI components (Widget, Chat, Forms)
- **Services**: API communication layer with intelligent URL detection
- **Utils**: Configuration reading, session management
- **Styles**: Isolated CSS for widget styling

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js (>=18.0.0)
- **Framework**: Express.js
- **Database**: MongoDB (MongoDB Atlas)
- **AI**: Google Gemini API (`@google/generative-ai`)
- **ODM**: Mongoose
- **Deployment**: Render

### Frontend
- **Framework**: React 18
- **Build Tool**: Webpack 5
- **Bundling**: Single-file output (`chatbot.js`)
- **Styling**: CSS (isolated styles)
- **Deployment**: Vercel

## 📁 Project Structure

```
veterinary-chatbot-sdk/
├── backend/
│   ├── src/
│   │   ├── controllers/      # Request handlers
│   │   │   ├── chatController.js
│   │   │   ├── appointmentController.js
│   │   │   └── conversationController.js
│   │   ├── models/           # MongoDB schemas
│   │   │   ├── Conversation.js
│   │   │   └── Appointment.js
│   │   ├── routes/           # API routes
│   │   │   ├── chatRoutes.js
│   │   │   ├── appointmentRoutes.js
│   │   │   └── conversationRoutes.js
│   │   ├── services/         # Business logic
│   │   │   ├── geminiService.js
│   │   │   └── appointmentService.js
│   │   ├── middleware/       # Express middleware
│   │   │   └── corsMiddleware.js
│   │   └── config/           # Configuration
│   │       └── database.js
│   ├── server.js             # Entry point
│   ├── package.json
│   ├── render.yaml           # Render deployment config
│   └── .env                  # Environment variables
│
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── ChatbotWidget.jsx
│   │   │   ├── ChatInterface.jsx
│   │   │   ├── MessageList.jsx
│   │   │   ├── MessageBubble.jsx
│   │   │   ├── InputField.jsx
│   │   │   ├── LoadingIndicator.jsx
│   │   │   └── AppointmentForm.jsx
│   │   ├── services/         # API services
│   │   │   └── apiService.js
│   │   ├── utils/            # Utilities
│   │   │   ├── configReader.js
│   │   │   └── sessionManager.js
│   │   ├── styles/           # CSS styles
│   │   │   └── chatbot.css
│   │   └── index.js          # Entry point
│   ├── dist/                 # Build output
│   │   ├── chatbot.js        # Embeddable SDK
│   │   └── index.html        # Test page
│   ├── public/               # Template files
│   │   └── index.html
│   ├── webpack.config.js
│   ├── vercel.json           # Vercel deployment config
│   ├── package.json
│   └── .env                  # Environment variables
│
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js (>=18.0.0)
- MongoDB Atlas account
- Google Gemini API key
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=3000
   NODE_ENV=development
   
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/veterinary-chatbot
   GEMINI_API_KEY=your_gemini_api_key_here
   GEMINI_MODEL=gemini-1.5-flash
   
   FRONTEND_URL=http://localhost:5173
   ```

4. **Get MongoDB Atlas Connection String:**
   - Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a database user
   - Whitelist your IP address (or use 0.0.0.0/0 for development)
   - Get connection string from "Connect" → "Connect your application"

5. **Get Google Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Create a new API key
   - Copy the key to your `.env` file

6. **Start the server:**
   ```bash
   npm start
   # Or for development with auto-reload:
   npm run dev
   ```

   The server will run on `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional):**
   Create a `.env` file in the `frontend` directory:
   ```env
   # For local development
   VET_CHATBOT_API_URL=http://localhost:3000
   VET_CHATBOT_FALLBACK_URL=https://your-backend.onrender.com
   ```

4. **Build the widget:**
   ```bash
   npm run build
   ```

   This creates `dist/chatbot.js` - the embeddable SDK file.

5. **Development mode (optional):**
   ```bash
   npm run serve
   ```

   This starts a dev server on `http://localhost:5173`

## 🌐 Deployment

### Backend Deployment (Render)

**Assumption**: Using Render's free tier for backend hosting. Render may spin down services after inactivity, causing first request delays.

1. **Create Render Account** and connect your GitHub repository

2. **Create New Web Service:**
   - Go to Render Dashboard → New → Web Service
   - Connect your repository
   - Select the `backend` directory as root
   - Build Command: `npm install`
   - Start Command: `npm start`

3. **Set Environment Variables in Render:**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `GEMINI_API_KEY`: Your Google Gemini API key
   - `GEMINI_MODEL`: `gemini-1.5-flash` (or another valid model)
   - `NODE_ENV`: `production`
   - `PORT`: (auto-set by Render, but can override)

4. **Deploy:**
   - Render will auto-deploy on git push
   - Or manually trigger deployment from dashboard

5. **Verify deployment:**
   - Visit: `https://your-service.onrender.com/health`
   - Should return: `{"status":"ok","message":"Veterinary Chatbot API is running"}`

**Note**: The `render.yaml` file in the backend directory contains deployment configuration for Render.

### Frontend Deployment (Vercel)

**Assumption**: Using Vercel for frontend hosting due to excellent CDN and automatic deployments.

1. **Create Vercel Account** and connect your GitHub repository

2. **Deploy:**
   - Go to Vercel Dashboard → New Project
   - Import your repository
   - Set Root Directory: `frontend`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Framework Preset: Other

3. **Set Environment Variables (Optional):**
   - Go to Settings → Environment Variables
   - Add `VET_CHATBOT_API_URL` if you want to override the default
   - **Note**: The frontend uses runtime detection, so this is optional

4. **Deploy:**
   - Vercel will auto-deploy on git push
   - Or manually trigger deployment

5. **Get deployment URL:**
   - After deployment, Vercel provides a URL like: `https://your-app.vercel.app`
   - The `chatbot.js` file will be available at: `https://your-app.vercel.app/chatbot.js`

**Note**: The `vercel.json` file configures routing and headers for proper SDK serving.

## 📖 Usage

### Basic Integration

Add the chatbot to any website with a single script tag:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Website</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    
    <!-- Add the chatbot SDK -->
    <script src="https://your-frontend.vercel.app/chatbot.js"></script>
</body>
</html>
```

The chatbot widget will automatically appear in the bottom-right corner.

### Context-Based Integration (Optional)

Pass contextual information to personalize the chatbot:

```html
<script>
    window.VetChatbotConfig = {
        apiUrl: "https://your-backend.onrender.com",  // Optional: overrides auto-detection
        userId: "user_123",
        userName: "John Doe",
        petName: "Buddy",
        source: "marketing-website"
    };
</script>
<script src="https://your-frontend.vercel.app/chatbot.js"></script>
```

**Configuration Options:**
- `apiUrl` (optional): Backend API URL (defaults to auto-detection)
- `userId` (optional): User identifier
- `userName` (optional): User's name
- `petName` (optional): Pet's name
- `source` (optional): Source identifier (e.g., "marketing-website", "app")

## 📡 API Documentation

### Base URL

- Development: `http://localhost:3000`
- Production: `https://your-backend.onrender.com`

### Endpoints

#### 1. Health Check

```
GET /health
```

**Response:**
```json
{
  "status": "ok",
  "message": "Veterinary Chatbot API is running"
}
```

#### 2. Send Chat Message

```
POST /api/chat/message
```

**Request Body:**
```json
{
  "sessionId": "session_123",
  "message": "What vaccines does my puppy need?",
  "context": {
    "userId": "user_123",
    "userName": "John Doe",
    "petName": "Buddy",
    "source": "website"
  }
}
```

**Response:**
```json
{
  "sessionId": "session_123",
  "response": "Puppies typically need...",
  "hasAppointmentIntent": false
}
```

#### 3. Create Appointment

```
POST /api/appointments
```

**Request Body:**
```json
{
  "sessionId": "session_123",
  "petOwnerName": "John Doe",
  "petName": "Buddy",
  "phoneNumber": "123-456-7890",
  "preferredDate": "2024-01-15T10:00:00Z"
}
```

**Response:**
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "id": "appointment_id",
    "petOwnerName": "John Doe",
    "petName": "Buddy",
    "phoneNumber": "123-456-7890",
    "preferredDate": "2024-01-15T10:00:00Z",
    "status": "pending",
    "createdAt": "2024-01-11T12:00:00Z"
  }
}
```

#### 4. Get Conversation History (Optional)

```
GET /api/conversations/:sessionId
```

**Response:**
```json
{
  "sessionId": "session_123",
  "messages": [
    {
      "role": "user",
      "content": "Hello",
      "timestamp": "2024-01-11T12:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Hello! How can I help?",
      "timestamp": "2024-01-11T12:00:01Z"
    }
  ],
  "context": {},
  "createdAt": "2024-01-11T12:00:00Z",
  "updatedAt": "2024-01-11T12:05:00Z"
}
```

## 🔄 Development Journey & Changes

This section documents the key changes and improvements made during development, reflecting the iterative problem-solving approach.

### Initial Requirements & Setup

**User Request**: Build a veterinary chatbot SDK with:
- AI-powered Q&A using Google Gemini
- Conversational appointment booking
- MongoDB data storage
- Embeddable widget via single script tag

### Phase 1: Code Cleanup & Optimization

**Changes Made:**
1. **Removed hardcoded model names**: Changed from hardcoded `gemini-2.5-flash` to environment variable `GEMINI_MODEL` (required)
2. **Code reduction**: Removed unused code, debug statements, and unnecessary comments
3. **Gitignore optimization**: Refined `.gitignore` files to properly exclude sensitive files while keeping templates

**Assumption**: Environment variables are the proper way to configure the model, allowing flexibility without code changes.

### Phase 2: Frontend Deployment Configuration

**User Request**: "When hosted on Vercel, the frontend page should open like it does on localhost:5173"

**Changes Made:**
1. **Webpack configuration**: Modified to generate `index.html` in both development and production
2. **Vercel configuration**: Added `vercel.json` with proper routing to serve `index.html` at root
3. **Environment variable integration**: Added `dotenv` support for build-time environment variables

**Key Decision**: Use webpack's `HtmlWebpackPlugin` to generate HTML at build time, ensuring consistency between dev and production.

### Phase 3: Backend Deployment (Render)

**User Request**: Deploy backend to Render

**Changes Made:**
1. **Created `render.yaml`**: Deployment configuration for Render
2. **Enhanced logging**: Added detailed startup logs and environment variable validation
3. **Error handling**: Improved MongoDB connection error logging

**Assumption**: Render's free tier may have cold starts, so detailed logging helps debug deployment issues.

### Phase 4: CORS & API URL Configuration

**User Request**: Fix "failed to send" errors when deployed frontend tries to connect to Render backend

**Problem Identified**: 
- Deployed frontend was using `localhost:3000` instead of Render backend URL
- CORS was blocking requests from Vercel domain

**Changes Made:**
1. **CORS Configuration**: 
   - Initially configured to allow specific origins
   - **Final solution**: Set to `origin: true` (allow all origins) for maximum compatibility
   - Added `credentials: true` to support authenticated requests

2. **API URL Detection (Runtime)**:
   - **Priority 1**: `window.VetChatbotConfig.apiUrl` (user override)
   - **Priority 2**: Runtime detection based on `window.location.hostname`
     - If not `localhost` → use Render backend
     - If `localhost` → use local backend
   - **Priority 3**: Build-time environment variable (fallback)
   - **Priority 4**: Default to localhost

3. **Fallback Logic**: Added intelligent fallback in `apiService.js` to try localhost first, then Render backend if local fails

**Key Decision**: Runtime detection is more reliable than build-time variables because it adapts to the actual deployment environment without requiring rebuilds.

**Assumption**: Users may test locally with deployed backend, so fallback logic improves developer experience.

### Phase 5: Error Handling & Debugging

**User Request**: Fix instant "failed to send" errors with no network calls

**Problem Identified**: 
- Session ID validation was failing silently
- API URL detection had edge cases
- Error messages weren't descriptive enough

**Changes Made:**
1. **Enhanced Validation**:
   - Added session ID validation with clear error messages
   - Added API URL validation to catch undefined/null values
   - Added message validation before sending

2. **Improved Logging**:
   - Added comprehensive console logging for debugging
   - Log API URL detection process
   - Log request details and error information

3. **Better Error Messages**:
   - More specific error messages based on error type
   - User-friendly messages in the UI
   - Detailed error logging for developers

**Key Decision**: Extensive logging helps debug production issues without requiring code changes.

### Phase 6: Gemini API Error Handling

**User Request**: Fix Gemini API 404 and 429 errors

**Problem Identified**:
- Dashboard showed 404 errors (model not found)
- 429 errors (rate limiting)
- Generic error messages weren't helpful

**Changes Made:**
1. **Error Detection**:
   - Added specific handling for 404 errors (model not found)
   - Added specific handling for 429 errors (rate limiting)
   - Added API key validation errors

2. **Error Messages**:
   - Clear messages for each error type
   - Guidance on how to fix (e.g., "Use gemini-1.5-flash")
   - User-friendly messages in chatbot responses

3. **Documentation**:
   - Created troubleshooting guide for common Gemini API issues
   - Documented valid model names

**Key Decision**: Specific error handling provides better developer experience and faster issue resolution.

**Assumption**: Most 404 errors are due to incorrect model names, so providing clear guidance helps users fix issues quickly.

## 🤔 Key Decisions & Trade-offs

### 1. Frontend Deployment Strategy

**Decision**: Serve `chatbot.js` separately on Vercel (CDN approach)

**Trade-offs:**
- ✅ **Pros**: Better caching/CDN, independent deployments, industry standard for SDKs, excellent performance
- ❌ **Cons**: More complex deployment setup, requires CORS configuration

**Alternative Considered**: Serving from backend
- Simpler deployment but less scalable and poorer caching

### 2. API URL Detection Strategy

**Decision**: Runtime detection based on `window.location.hostname` with fallback chain

**Trade-offs:**
- ✅ **Pros**: Works automatically in any environment, no rebuild needed, flexible
- ❌ **Cons**: Slightly more complex logic, requires runtime checks

**Alternative Considered**: Build-time environment variables only
- Simpler but requires rebuilds for different environments

**Assumption**: Runtime detection is more user-friendly and reduces deployment friction.

### 3. CORS Configuration

**Decision**: Allow all origins (`origin: true`) with credentials

**Trade-offs:**
- ✅ **Pros**: Works with any frontend domain, no configuration needed, flexible
- ❌ **Cons**: Less secure (allows any origin), not suitable for sensitive data

**Alternative Considered**: Whitelist specific origins
- More secure but requires configuration for each new frontend domain

**Assumption**: For an embeddable SDK, flexibility is more important than strict origin control. Users can restrict origins if needed.

### 4. Session Management

**Decision**: Client-side session ID generation using localStorage

**Trade-offs:**
- ✅ **Pros**: No server-side session storage needed, works across page reloads, simple
- ❌ **Cons**: Session persists in browser (could be cleared by user), not secure for sensitive data

**Alternative Considered**: Server-generated sessions
- More control but requires session storage/management

**Assumption**: For a chatbot widget, client-side sessions are sufficient and improve user experience.

### 5. Error Handling Strategy

**Decision**: Graceful degradation with user-friendly messages

**Trade-offs:**
- ✅ **Pros**: Better user experience, doesn't break the UI, informative
- ❌ **Cons**: May hide underlying issues, requires careful error message design

**Alternative Considered**: Fail fast with technical error messages
- More transparent but worse user experience

**Assumption**: Users prefer friendly error messages over technical details.

### 6. Gemini Model Configuration

**Decision**: Require `GEMINI_MODEL` as environment variable (no defaults)

**Trade-offs:**
- ✅ **Pros**: Explicit configuration, prevents accidental wrong model usage, flexible
- ❌ **Cons**: Requires setup, fails if not configured

**Alternative Considered**: Default model with override option
- Simpler but may use wrong model if not configured

**Assumption**: Explicit configuration prevents production issues.

## 📝 Assumptions

### Technical Assumptions

1. **MongoDB Atlas**: Using cloud MongoDB (Atlas) instead of local MongoDB
   - **Rationale**: Production-ready, managed service, easier deployment

2. **CORS**: Allowing all origins for maximum compatibility
   - **Rationale**: Embeddable SDK needs to work on any domain
   - **Note**: Can be restricted if needed for security

3. **API Keys**: Environment variables are securely managed (not committed to git)
   - **Rationale**: Standard security practice
   - **Note**: `.env` files are in `.gitignore`

4. **Browser Support**: Modern browsers with ES6+ support
   - **Rationale**: React 18 and modern JavaScript features require modern browsers

5. **Session Persistence**: Users expect sessions to persist across page reloads
   - **Rationale**: Better user experience, conversations don't restart

6. **Appointment Format**: Using ISO 8601 datetime format for appointments
   - **Rationale**: Standard format, easy to parse and validate

7. **Widget Isolation**: Widget styles are isolated and won't conflict with host site
   - **Rationale**: Prefixed CSS classes prevent style conflicts

8. **Deployment Platforms**: Render (backend) and Vercel (frontend)
   - **Rationale**: Free tiers available, good developer experience, reliable

### Business Assumptions

1. **Error Handling**: Basic error handling sufficient for MVP
   - **Rationale**: Enterprise-grade security not required for initial version

2. **Rate Limiting**: Gemini API rate limits are acceptable for MVP
   - **Rationale**: Can be improved later if needed

3. **Appointment Validation**: Basic validation sufficient
   - **Rationale**: More complex validation can be added based on requirements

4. **Multi-language**: English only for initial version
   - **Rationale**: Can be expanded later if needed

## 🔧 Troubleshooting

### Common Issues

#### 1. "Failed to send message" Error

**Symptoms**: Error appears instantly, no network call visible

**Possible Causes**:
- Session ID not initialized
- API URL not detected correctly
- Old build deployed

**Solutions**:
1. Check browser console for error messages
2. Verify session ID is generated (check localStorage)
3. Check API URL detection logs in console
4. Clear browser cache and hard refresh
5. Rebuild and redeploy frontend

#### 2. CORS Errors

**Symptoms**: Network request shows CORS error in console

**Solutions**:
1. Verify backend CORS middleware is configured
2. Check `Access-Control-Allow-Origin` header in response
3. Ensure `credentials: 'include'` is set in fetch calls
4. Verify backend is deployed and accessible

#### 3. Gemini API 404 Errors

**Symptoms**: Chatbot returns "I apologize, but I'm having trouble processing..."

**Solutions**:
1. Check `GEMINI_MODEL` environment variable in Render
2. Verify model name is correct (e.g., `gemini-1.5-flash`)
3. Check Gemini API dashboard for error details
4. Ensure API key has access to the model

**Valid Model Names**:
- `gemini-1.5-flash` (Recommended)
- `gemini-1.5-pro`
- `gemini-2.0-flash-exp`

#### 4. Gemini API 429 Errors (Rate Limiting)

**Symptoms**: Occasional failures, "rate limit" errors

**Solutions**:
1. Wait a few moments and try again
2. Reduce request frequency
3. Check Gemini API quota/limits
4. Consider upgrading API tier if needed

#### 5. Backend Not Responding

**Symptoms**: Network timeout, connection refused

**Possible Causes**:
- Render service spun down (free tier)
- Backend crashed
- Environment variables not set

**Solutions**:
1. Check Render dashboard for service status
2. Check Render logs for errors
3. Verify all environment variables are set
4. Wait for service to wake up (first request may be slow)

#### 6. Frontend Not Loading

**Symptoms**: Widget doesn't appear, 404 errors for `chatbot.js`

**Solutions**:
1. Verify Vercel deployment succeeded
2. Check `chatbot.js` is accessible at deployment URL
3. Verify `vercel.json` configuration
4. Check browser console for errors

### Debugging Tips

1. **Check Browser Console**: Look for error messages and API URL detection logs
2. **Check Network Tab**: Verify requests are being made and responses received
3. **Check Backend Logs**: Render dashboard → Logs tab
4. **Test Backend Directly**: Use `curl` or Postman to test API endpoints
5. **Verify Environment Variables**: Check both Render and Vercel dashboards

## 🔮 Future Improvements

### High Priority
- [ ] Admin dashboard for viewing appointments
- [ ] Email notifications for appointments
- [ ] Conversation history UI in widget
- [ ] Better error messages and user feedback
- [ ] Rate limiting on API endpoints
- [ ] Retry logic for failed API calls

### Medium Priority
- [ ] Unit tests for backend services
- [ ] Integration tests for API endpoints
- [ ] Widget theme customization
- [ ] Multi-language support
- [ ] Appointment cancellation functionality
- [ ] Docker setup for local development
- [ ] API documentation (Swagger/OpenAPI)

### Low Priority
- [ ] Analytics integration
- [ ] A/B testing support
- [ ] Advanced appointment scheduling (recurring, multiple pets)
- [ ] Voice input support
- [ ] Chatbot personality customization
- [ ] Performance monitoring
- [ ] WebSocket support for real-time updates

## 📄 License

ISC

## 👤 Author

Veterinary Chatbot SDK - Assignment Project

## 🙏 Acknowledgments

- Google Gemini API for AI capabilities
- React team for the excellent framework
- MongoDB Atlas for database hosting
- Render and Vercel for hosting platforms

---

**Note**: This is an assignment project demonstrating real-world software engineering skills including system design, clean architecture, and core programming concepts. The development journey documented here reflects an iterative, problem-solving approach to building production-ready software.
