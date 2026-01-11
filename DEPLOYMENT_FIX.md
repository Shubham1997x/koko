# Deployment Fix Guide

## Issue
Deployed frontend (Vercel) not connecting to backend (Render)

## Root Cause
The deployed frontend needs to be rebuilt with the correct backend URL configuration.

## Solution

### 1. Backend (Render) - Already Fixed ✅
- CORS allows all origins
- Backend URL: `https://koko-h8y2.onrender.com`
- Health check working

### 2. Frontend (Vercel) - Needs Redeploy

#### Option A: Set Environment Variable in Vercel (Recommended)

1. Go to Vercel Dashboard → Your Project → Settings → Environment Variables
2. Add:
   - **Name**: `VET_CHATBOT_API_URL`
   - **Value**: `https://koko-h8y2.onrender.com`
   - **Environments**: Production, Preview, Development (select all)
3. Save
4. Go to Deployments tab
5. Click "Redeploy" on the latest deployment
6. Wait for deployment to complete

#### Option B: Let Auto-Detection Work

The code now automatically detects production environment and uses the Render backend. Just redeploy:

1. Push your latest code to Git
2. Vercel will auto-deploy
3. The new build will detect it's in production and use `https://koko-h8y2.onrender.com`

### 3. Verify After Deployment

1. Visit your Vercel URL: `https://koko-one-theta.vercel.app/`
2. Open browser console (F12)
3. Look for log messages:
   - "Detected production environment, using Render backend: https://koko-h8y2.onrender.com"
   - "Sending message to: https://koko-h8y2.onrender.com"
4. Try sending a message
5. Check console for any errors

## Current Configuration

### Backend
- URL: `https://koko-h8y2.onrender.com`
- CORS: Allows all origins
- Status: ✅ Working

### Frontend API URL Detection (Priority Order)
1. `window.VetChatbotConfig.apiUrl` (if set in HTML)
2. `process.env.VET_CHATBOT_API_URL` (from webpack build)
3. Runtime detection: If not localhost → use Render backend
4. Default: `http://localhost:3000` (for localhost only)

## Testing

### Test Backend Directly
```bash
curl https://koko-h8y2.onrender.com/health
```
Should return: `{"status":"ok","message":"Veterinary Chatbot API is running"}`

### Test from Browser Console
```javascript
fetch('https://koko-h8y2.onrender.com/api/chat/message', {
  method: 'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({sessionId: 'test', message: 'hello'})
}).then(r => r.json()).then(console.log)
```

## If Still Not Working

1. Check browser console for exact error message
2. Verify backend is running: `https://koko-h8y2.onrender.com/health`
3. Check Vercel deployment logs for build errors
4. Verify environment variable is set in Vercel (if using Option A)
5. Clear browser cache and hard refresh (Ctrl+Shift+R)

