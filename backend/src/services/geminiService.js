const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Veterinary system prompt
const VETERINARY_SYSTEM_PROMPT = `You are a helpful veterinary assistant chatbot. Your purpose is to provide information and assistance related to pet care and veterinary services.

Guidelines:
1. Only answer questions related to veterinary care, pet health, pet care, and related topics
2. Topics you can discuss include:
   - Pet care and hygiene
   - Vaccination schedules
   - Diet and nutrition for pets
   - Common pet illnesses and symptoms
   - Preventive care
   - General pet health advice
3. If asked about topics unrelated to veterinary care or pets, politely decline: "I'm a veterinary assistant and can only help with pet-related questions. Is there something about your pet's health or care I can help with?"
4. Be friendly, professional, and helpful
5. If a user wants to book an appointment, acknowledge their request and guide them through the booking process
6. Keep responses concise and informative

Always stay within your role as a veterinary assistant.`;

// Model name from environment variable (required)
const MODEL_NAME = process.env.GEMINI_MODEL;

/**
 * Generate AI response using Google Gemini
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI-generated response
 */
async function generateResponse(userMessage, conversationHistory = []) {
  try {
    // Check if API key is configured
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured');
    }
    
    // Check if model name is configured
    if (!MODEL_NAME) {
      throw new Error('GEMINI_MODEL is not configured');
    }

    // Build conversation context
    const history = conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Start chat with system prompt and history
    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: VETERINARY_SYSTEM_PROMPT }],
        },
        {
          role: 'model',
          parts: [{ text: 'I understand. I am a veterinary assistant and will only help with pet-related questions and veterinary services.' }],
        },
        ...history,
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    // Send user message and get response
    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    const text = response.text();

    return text;
  } catch (error) {
    console.error('Error generating Gemini response:', error);
    
    // Provide more detailed error information
    if (error.message && error.message.includes('API_KEY')) {
      throw new Error('Gemini API key is missing or invalid. Please configure GEMINI_API_KEY in your .env file.');
    }
    
    const isModelNotFound = error.message && (
      error.message.includes('404') || 
      error.message.includes('not found') ||
      error.message.includes('not supported')
    );
    
    if (isModelNotFound) {
      console.error(`Model "${MODEL_NAME}" is not available. This may indicate:`);
      console.error('1. Your API key does not have access to this model');
      console.error('2. The model is not available in your region');
      console.error('3. Your API key needs to be regenerated');
      console.error('Please visit https://aistudio.google.com/app/apikey to check your API key');
      throw new Error(`Gemini model "${MODEL_NAME}" not found or not supported. Please check your API key permissions.`);
    }
    
    // Log the full error for debugging
    console.error('Full Gemini error:', JSON.stringify(error, null, 2));
    throw new Error(`Failed to generate AI response: ${error.message || 'Unknown error'}`);
  }
}

module.exports = {
  generateResponse,
};
