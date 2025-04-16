
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
          content: `You are a friendly real estate assistant for Easy-Rent, a platform exclusively for property rentals (not sales).
                    Respond conversationally to users' messages. If they greet you,
                    respond to their greeting and ask how you can help them find a rental property.
                    Always make it clear that Easy-Rent is only for renting properties, not buying or selling.
                    Always analyze their message for property search criteria and include a
                    JSON object called "searchParams" with these properties if mentioned:
                    - propertyType (apartment, house, studio, room)
                    - minPrice (numeric value only)
                    - maxPrice (numeric value only)
                    - bedrooms (numeric value only)
                    - bathrooms (numeric value only)
                    - city (string)
                    - district (string)
                    - microdistrict (string)
                    - minArea/maxArea (numeric values for square meters)
                    - parking (boolean)
                    - paymentPeriod (daily, weekly, monthly, yearly)
                    
                    If their message doesn't contain search criteria, include an empty searchParams object.
                    For property searches, respond conversationally first, then include the searchParams object.`
        },
        {
          role: "user",
          content: query
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });

    console.log('OpenAI response received');
    
    // Extract the content from the response
    const content = response.choices[0].message.content;
    console.log('Raw content:', content);
    
    // Extract the JSON object from the response
    try {
      // Look for a JSON object in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      let extractedParameters = {};
      
      if (jsonMatch) {
        extractedParameters = JSON.parse(jsonMatch[0]);
      }
      
      // Return both the full response and the extracted parameters
      return {
        conversationalResponse: content,
        searchParams: extractedParameters.searchParams || {}
      };
    } catch (parseError) {
      console.error('Failed to parse JSON response:', parseError);
      console.error('Response content:', content);
      return {
        conversationalResponse: content,
        searchParams: {}
      };
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