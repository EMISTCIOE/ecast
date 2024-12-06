import { 
    ServicePrincipalCredentials, 
    PDFServices, 
    MimeType, 
    CreatePDFJob, 
    CreatePDFResult, 
    SDKError, 
    ServiceUsageError, 
    ServiceApiError 
} from '@adobe/pdfservices-node-sdk';
import * as fs from 'fs';

(async () => {
    let readStream: fs.ReadStream | null = null;
    try {
        // Initial setup, create credentials instance
        const credentials = new ServicePrincipalCredentials({
            clientId: process.env.PDF_SERVICES_CLIENT_ID as string,
            clientSecret: process.env.PDF_SERVICES_CLIENT_SECRET as string,
        });

        // Create a PDF Services instance
        const pdfServices = new PDFServices({
            credentials,
        });

        // Path to the image file (e.g., PNG, JPEG, etc.)
        const imagePath = './your-image.png'; // Change to your image file path
        
        // Read the image file and upload it as an asset
        readStream = fs.createReadStream(imagePath);
        const inputAsset = await pdfServices.upload({
            readStream,
            mimeType: MimeType.PNG, // Adjust based on your image format (e.g., MimeType.JPEG)
        });

        // Create a job to convert the image to PDF
        const job = new CreatePDFJob({
            inputAsset,
        });

        // Submit the job and get the result
        const pollingURL = await pdfServices.submit({
            job,
        });
        const pdfServicesResponse = await pdfServices.getJobResult({
            pollingURL,
            resultType: CreatePDFResult,
        });

        // Check if the result is not null
        if (pdfServicesResponse.result) {
            // Get the resulting PDF asset
            const resultAsset = pdfServicesResponse.result.asset;
            const streamAsset = await pdfServices.getContent({
                asset: resultAsset,
            });

            // Save the output PDF
            const outputFilePath = './output.pdf';
            console.log(`Saving asset at ${outputFilePath}`);

            const outputStream = fs.createWriteStream(outputFilePath);
            streamAsset.readStream.pipe(outputStream);
        } else {
            console.error("Error: The result is null. Job might have failed.");
        }
    } catch (err) {
        if (err instanceof SDKError || err instanceof ServiceUsageError || err instanceof ServiceApiError) {
            console.error('Exception encountered while executing operation', err);
        } else {
            console.error('Unexpected error encountered while executing operation', err);
        }
    } finally {
        if (readStream) {
            readStream.destroy();
        }
    }
})();
