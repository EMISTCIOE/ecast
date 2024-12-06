import { NextApiRequest, NextApiResponse } from 'next';
import { ServicePrincipalCredentials, PDFServices, MimeType, CreatePDFJob, CreatePDFResult, SDKError, ServiceUsageError, ServiceApiError } from '@adobe/pdfservices-node-sdk';
import * as fs from 'fs';
import path from 'path';
import https from 'https';
import { pipeline } from 'stream/promises';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { imageUrl, fileName } = req.query;

    if (!imageUrl || !fileName) {
      return res.status(400).json({ error: 'Missing imageUrl or fileName' });
    }

    try {
      const credentials = new ServicePrincipalCredentials({
        clientId: process.env.PDF_SERVICES_CLIENT_ID as string,
        clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET as string,
      });

      const pdfServices = new PDFServices({ credentials });

      // Download the image from the URL provided in the query
      const imageUrlDecoded = decodeURIComponent(imageUrl as string);
      const fileExtension = path.extname(imageUrlDecoded).slice(1).toUpperCase();
      const mimeType = fileExtension === 'PNG' ? MimeType.PNG : fileExtension === 'JPEG' ? MimeType.JPEG : MimeType.PNG;

      // Temp path to save the image
      const tempImagePath = path.join('/tmp', `${Date.now()}.${fileExtension.toLowerCase()}`);

      // Download the image
      const fileStream = fs.createWriteStream(tempImagePath);
      https.get(imageUrlDecoded, (response) => {
        response.pipe(fileStream);
        fileStream.on('finish', async () => {
          try {
            const readStream = fs.createReadStream(tempImagePath);
            const inputAsset = await pdfServices.upload({
              readStream,
              mimeType: mimeType,
            });

            // Create a job to convert the image to PDF
            const job = new CreatePDFJob({ inputAsset });

            // Submit the job
            const pollingURL = await pdfServices.submit({ job });
            const pdfServicesResponse = await pdfServices.getJobResult<CreatePDFResult>({
              pollingURL,
              resultType: CreatePDFResult, // Use the correct class for resultType
            });

            // Check if the result is not null
            if (pdfServicesResponse.result) {
              const resultAsset = pdfServicesResponse.result.asset;
              const streamAsset = await pdfServices.getContent({ asset: resultAsset });

              // Set response headers for PDF download
              res.setHeader('Content-Type', 'application/pdf');
              res.setHeader('Content-Disposition', `attachment; filename=${fileName}`);

              // Pipe the PDF to the response
              await pipeline(streamAsset.readStream, res);
            } else {
              res.status(500).json({ error: 'Error generating PDF from image.' });
            }

            // Cleanup temporary image file
            fs.unlinkSync(tempImagePath);
          } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Error processing the PDF generation.' });
            fs.unlinkSync(tempImagePath); // Cleanup temporary image file
          }
        });
      });

    } catch (err) {
      console.error('Error generating PDF', err);
      if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
        return res.status(500).json({ error: 'Error with Adobe PDF Services SDK' });
      }
      return res.status(500).json({ error: 'Unexpected error occurred' });
    }
  } else {
    // Handle unsupported HTTP methods
    res.status(405).json({ error: 'Method Not Allowed' });
  }
}
