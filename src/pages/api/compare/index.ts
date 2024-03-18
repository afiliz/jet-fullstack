import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Jet, Jets } from "../../../../lib/types";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const jets: Jets = req.body.jets;
  const fn: string = req.body.comparison;
  const prompt = generatePrompt(jets, fn);
  const apiKey = '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';
  const url = 'https://api.openai.com/v1/chat/completions';

  const body = JSON.stringify({
    prompt,
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

function generatePrompt(jets: Jets, fn: string) {
  const jetNames = jets.map(jet => jet.name).join(', ');

  return `Given the following jets: ${jetNames}, 
    rank each by their ${fn}. provide the answer as an array of json objects, 
    with each object containing "rank", "name", and "value" (being ${fn}) for each jet`;
}
