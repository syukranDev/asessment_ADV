const axios = require('axios');

async function getPointsOfInterest(result_count, lat, long) {
  const prompt = `List ${result_count ?? 5} interesting places to visit near latitude ${lat} and longitude ${long}. For each place, include name, description, location's logitude latitiude and the estimated distance in kilometers from the given coordinates as "distance_km". Respond in JSON array format.`;
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

    // notedev: extract JSON from markdown code block if any la
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

module.exports = { getPointsOfInterest };