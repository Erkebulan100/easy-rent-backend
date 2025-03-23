const OpenAI = require('openai');

// Initialize OpenAI client
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('OpenAI API Key format check:', process.env.OPENAI_API_KEY ? 
  `Starts with: ${process.env.OPENAI_API_KEY.substring(0, 7)}... Length: ${process.env.OPENAI_API_KEY.length}` : 
  'undefined');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Process a natural language query to extract property search parameters
 * @param {string} query - Natural language query from user
 * @returns {Promise<Object>} - Extracted search parameters
 */
const processNaturalLanguageQuery = async (query) => {
  try {
    console.log('Processing query:', query);
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a real estate assistant. Extract search parameters from the query. 
                    Return a JSON object with these properties if mentioned:
                    - propertyType (apartment, house, studio, room)
                    - minPrice (numeric value only)
                    - maxPrice (numeric value only)
                    - bedrooms (numeric value only)
                    - city (string)
                    - location (specific area or district within city)
                    Only include parameters that are explicitly mentioned in the query.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.1,
      max_tokens: 500
    });

    console.log('OpenAI response received');
    
    // Extract and parse the JSON response
    const content = response.choices[0].message.content;
    console.log('Raw content:', content);
    
    try {
      const extractedParameters = JSON.parse(content);
      console.log('Extracted parameters:', extractedParameters);
      return extractedParameters;
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response content:', content);
      throw new Error('Failed to parse response from AI assistant');
    }
  } catch (error) {
    console.error('OpenAI API error:', error);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    
    // Fallback to a basic keyword extraction for development purposes
    console.log('Using fallback keyword extraction');
    const fallbackParameters = {};
    
    // Simple keyword matching
    if (query.toLowerCase().includes('apartment')) fallbackParameters.propertyType = 'apartment';
    else if (query.toLowerCase().includes('house')) fallbackParameters.propertyType = 'house';
    else if (query.toLowerCase().includes('studio')) fallbackParameters.propertyType = 'studio';
    else if (query.toLowerCase().includes('room')) fallbackParameters.propertyType = 'room';
    
    // Extract city
    if (query.toLowerCase().includes('bishkek')) fallbackParameters.city = 'Bishkek';
    
    // Extract bedrooms
    const bedroomMatch = query.match(/(\d+)\s*bedroom/i);
    if (bedroomMatch) fallbackParameters.bedrooms = parseInt(bedroomMatch[1]);
    
    // Extract price
    const priceMatch = query.match(/\$(\d+)/);
    if (priceMatch) {
      const price = parseInt(priceMatch[1]);
      fallbackParameters.maxPrice = price;
      fallbackParameters.minPrice = Math.max(0, price - 100);
    }
    
    console.log('Fallback parameters:', fallbackParameters);
    return fallbackParameters;
  }
};

/**
 * Convert audio to text using Whisper API
 * @param {Buffer} audioBuffer - Audio file buffer
 * @returns {Promise<string>} - Transcribed text
 */
const transcribeAudio = async (audioBuffer) => {
  try {
    const response = await openai.audio.transcriptions.create({
      file: audioBuffer,
      model: "whisper-1",
    });

    return response.text;
  } catch (error) {
    console.error('Whisper API error:', error);
    
    // Return fallback message for development
    return "This is a fallback transcription. The API couldn't process your audio.";
  }
};

module.exports = {
  processNaturalLanguageQuery,
  transcribeAudio
};