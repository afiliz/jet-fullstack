import prisma from '../../../../lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { Jet, Jets } from "../../../../lib/types";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const result = await prisma.post.findMany({});
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ error: err });
  }
}
