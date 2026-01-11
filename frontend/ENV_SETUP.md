# Environment Variables Setup

This project uses environment variables to configure the backend API URL.

## Setup

### 1. Create `.env` file

Create a `.env` file in the `frontend/` directory:

```bash
cd frontend
touch .env
```

### 2. Add Environment Variable

Add the following to your `.env` file:

```env
# Backend API URL
# For local development: http://localhost:3000
# For production: https://your-backend.onrender.com
VET_CHATBOT_API_URL=https://koko-oe38.onrender.com
```

## Usage

### Local Development

1. Create `.env` file with:
   ```env
   VET_CHATBOT_API_URL=http://localhost:3000
   ```

2. Run development server:
   ```bash
   npm run serve
   ```

### Production Build

1. Set environment variable before building:
   ```bash
   export VET_CHATBOT_API_URL=https://koko-oe38.onrender.com
   npm run build
   ```

   Or create `.env` file:
   ```env
   VET_CHATBOT_API_URL=https://koko-oe38.onrender.com
   ```

## Vercel Deployment

In Vercel dashboard:

1. Go to your project → **Settings** → **Environment Variables**
2. Add:
   - **Name**: `VET_CHATBOT_API_URL`
   - **Value**: `https://koko-oe38.onrender.com`
   - **Environment**: Production, Preview, Development (select all)
3. Redeploy your project

## Priority Order

The API URL is determined in this order (highest to lowest priority):

1. **`window.VetChatbotConfig.apiUrl`** - User-provided config in HTML
2. **`VET_CHATBOT_API_URL`** - Environment variable
3. **Default** - `http://localhost:3000` (development) or `https://koko-oe38.onrender.com` (production)

## Example

### Development
```env
VET_CHATBOT_API_URL=http://localhost:3000
```

### Production
```env
VET_CHATBOT_API_URL=https://koko-oe38.onrender.com
```

### Override in HTML (optional)
```html
<script>
  window.VetChatbotConfig = {
    apiUrl: "https://custom-backend.com", // Overrides env variable
    // ... other config
  };
</script>
```

