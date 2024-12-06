import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name, event_name } = req.query;

  if (!name || !event_name) {
    return res.status(400).json({ error: 'Missing name or event_name parameter' });
  }

  // Call Django backend here to generate certificate and get the URL
  try {
    const response = await fetch(`http://127.0.0.1:8000/certificates/generate-certificate/?name=${name}&event_name=${event_name}`);
    const data = await response.json();

    if (data.url) {
      return res.status(200).json({ url: data.url });
    } else {
      return res.status(500).json({ error: 'Failed to generate certificate' });
    }
  } catch (error) {
    console.error('Error contacting the backend:', error);
    return res.status(500).json({ error: 'Error contacting the backend' });
  }
}
