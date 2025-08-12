const axios = require('axios');

async function getPlaceDescription(placeName) {
  const prompt = `Provide a very brief description of the place "${placeName}" in 1 or 2 short sentences only. Respond in a valid JSON format with the field "description_place".`;
  
  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': process.env.GOOGLE_GEMINI_API_KEY
        }
      }
    );

    const candidates = response.data.candidates;
    if (!candidates || !candidates[0]?.content?.parts[0]?.text) {
      throw new Error('Invalid response from Google Gemini API');
    }
    let text = candidates[0].content.parts[0].text;

    // extract JSON from markdown code block if any
    const match = text.match(/```json\s*([\s\S]*?)\s*```/i) || text.match(/```([\s\S]*?)```/);
    if (match) {
      text = match[1];
    }

    console.log(JSON.parse(text));
    return JSON.parse(text);
  } catch (error) {
    if (error.response && error.response.data && error.response.data.error) {
      throw new Error(`Google Gemini API error: ${error.response.data.error.message}`);
    }
    throw error;
  }
}

module.exports = { getPlaceDescription };