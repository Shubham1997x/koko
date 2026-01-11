require('dotenv').config();
const express = require('express');
const connectDB = require('./src/config/database');
const corsMiddleware = require('./src/middleware/corsMiddleware');

// Import routes
const chatRoutes = require('./src/routes/chatRoutes');
const appointmentRoutes = require('./src/routes/appointmentRoutes');
const conversationRoutes = require('./src/routes/conversationRoutes');

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

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
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;

