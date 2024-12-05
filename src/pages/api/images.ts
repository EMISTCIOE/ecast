import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const imagesDirectory = path.join(process.cwd(), 'public','assets','images');
  
  fs.readdir(imagesDirectory, (err, files) => {
    if (err) {
      res.status(500).json({ error: 'Failed to read images' });
      return;
    }
    const imageFiles = files.filter((file) =>
      file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
    );

    res.status(200).json(imageFiles.map(file => `/assets/images/${file}`));
  });
}
