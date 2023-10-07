import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured.",
      },
    });
    return;
  }

  const { resume, jobDescription } = req.body;

  try {
    const coverLetter = await generateCoverLetter(resume, jobDescription);
    res.status(200).json({ coverLetter });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      error: {
        message: "An error occurred during your request.",
      },
    });
  }
}

async function generateCoverLetter(resume, jobDescription) {
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(resume, jobDescription),
      temperature: 0.6,
      max_tokens: 500,
    });
    return completion.data.choices[0].text;
  } catch (error) {
    throw new Error(`Error generating cover letter: ${error.message}`);
  }
}

function generatePrompt(resume, jobDescription) {
  return `Dear Hiring Manager,\n\nI am writing to express my interest in the position of [Job Title] at [Company Name]. With a background in [relevant skills/experience], I am confident in my ability to contribute to your team and help [specific goals of the company].\n\nPlease find attached my resume for your review. I have highlighted key experiences that align with the requirements outlined in the job description. I am particularly excited about the opportunity to [mention specific tasks or projects mentioned in the job description].\n\nThank you for considering my application. I look forward to the possibility of discussing how my skills and experiences align with the needs of [Company Name].\n\nSincerely,\n[Your Name]`;
}
