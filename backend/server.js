require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const corsMiddleware = require('./src/middleware/corsMiddleware');

// Validate required environment variables on startup
function validateEnvironment() {
  const required = ['MONGODB_URI', 'GEMINI_API_KEY', 'GEMINI_MODEL'];
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('Please set these in your Render dashboard under Environment variables');
    process.exit(1);
  }
  
  console.log('✅ All required environment variables are set');
}

// Import routes
const chatRoutes = require('./src/routes/chatRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');

// Validate environment variables first
validateEnvironment();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Log startup information
console.log('🚀 Starting Veterinary Chatbot Backend...');
console.log(`📌 Port: ${PORT}`);
console.log(`🌍 Node Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`🔗 MongoDB URI: ${process.env.MONGODB_URI ? 'Set' : 'Missing'}`);
console.log(`🔑 Gemini API Key: ${process.env.GEMINI_API_KEY ? 'Set' : 'Missing'}`);
console.log(`🤖 Gemini Model: ${process.env.GEMINI_MODEL || 'Not set'}`);

// Connect to MongoDB
console.log('🔌 Connecting to MongoDB...');
connectDB().catch((error) => {
  console.error('❌ Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(corsMiddleware);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', message: 'Veterinary Chatbot API is running' });
});

// API Routes
app.use('/api/chat', chatRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/conversations', conversationRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
  console.log('API endpoints ready');
});

module.exports = app;

