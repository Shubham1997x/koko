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

/**
 * Generate AI response using Google Gemini
 * @param {string} userMessage - The user's message
 * @param {Array} conversationHistory - Previous messages in the conversation
 * @returns {Promise<string>} - The AI-generated response
 */
async function generateResponse(userMessage, conversationHistory = []) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Build conversation context
    const history = conversationHistory.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }],
    }));

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
    throw new Error('Failed to generate AI response');
  }
}

module.exports = {
  generateResponse,
};

