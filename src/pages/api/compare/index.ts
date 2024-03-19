import { NextApiRequest, NextApiResponse } from 'next';
import { Jets } from "../../../../lib/types";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get selected jets and comparison function, then generate prompt
  const jets: Jets = req.body.jets;
  const fn: string = req.body.comparison;
  const prompt = generatePrompt(jets, fn);
  console.log("prompt", prompt);
  // remember to add your apiKey here. Ideally in environment variable, but 
  // this makes it easy to set up the project
  const apiKey = 'YOUR_API_KEY';
  const url = 'https://api.openai.com/v1/chat/completions';

  const body = JSON.stringify({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-3.5-turbo',
    stream: false
  });

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body
    });
    const data = await response.json();    
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err });
  } 
}

// generates ChatGPT prompt based on selected jets and comparison function
function generatePrompt(jets: Jets, fn: string) {
  const jetNames = jets.map(jet => jet.name).join(', ');

  return `As an expert in knowledge of jets, given the following jets: ${jetNames}, 
    rank each by their ${fn}. Provide the answer as an array of json objects, 
    with each object containing "rank", "name", and "value" (being ${fn}) for each jet. 
    Correctly sort the objects by their value in descending order.
    Include the measurement unit in the value field after sorting. `;
    
}
