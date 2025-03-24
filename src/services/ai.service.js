
const OpenAI = require('openai');

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  project: process.env.OPENAI_PROJECT_ID // 👈 Add this line
});
// Add this after the openai initialization
console.log('OpenAI API Key exists:', !!process.env.OPENAI_API_KEY);
console.log('OpenAI API Key starts with:', process.env.OPENAI_API_KEY ? process.env.OPENAI_API_KEY.substring(0, 5) + '...' : 'undefined');
console.log("ENV API key ends with:", process.env.OPENAI_API_KEY?.slice(-6));
console.log("ENV Project ID:", process.env.OPENAI_PROJECT_ID);

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
    throw new Error('Failed to process natural language query');
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
    throw new Error('Failed to transcribe audio');
  }
};

module.exports = {
  processNaturalLanguageQuery,
  transcribeAudio
};