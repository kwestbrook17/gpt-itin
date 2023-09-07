import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const { park, days } = req.body; // Retrieve both park and days from the request body
  if (park.trim().length === 0 || isNaN(days)) { // Check if days is a valid number
    res.status(400).json({
      error: {
        message: "Please enter a valid national park name and a valid number of days.",
      }
    });
    return;
  }

  try {
    // Modify the prompt to ask for an itinerary for the given park and number of days
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(park, days), // Pass both park and days as arguments
      temperature: 0.6,
      max_tokens: 500,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(park, days) {
  // Modify the prompt to ask for an itinerary for the specified national park and number of days
  return `Generate a ${days}-day itinerary for a visit to ${park}.`;
}
