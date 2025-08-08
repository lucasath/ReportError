import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();

  const log = req.body;

  console.log('[LOG DE ERRO GLOBAL]', log);

  return res.status(200).json({ success: true });
}
