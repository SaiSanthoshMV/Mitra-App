// lib/r2Client.ts

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

// Initialize R2 client (S3-compatible)
export const r2Client = new S3Client({
    region: 'auto',
    endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
});

export const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'study-materials';
export const R2_PUBLIC_BASE_URL = process.env.R2_PUBLIC_BASE_URL || '';

/**
 * Upload a file to Cloudflare R2
 * @param file - The file to upload
 * @param fileName - The name/path for the file in R2
 * @returns The public URL of the uploaded file
 */
export async function uploadToR2(file: Buffer, fileName: string, contentType: string): Promise<string> {
    try {
        const command = new PutObjectCommand({
            Bucket: R2_BUCKET_NAME,
            Key: fileName,
            Body: file,
            ContentType: contentType,
        });

        await r2Client.send(command);

        // Return the public URL
        // Remove any trailing slash from base URL and ensure proper path
        const baseUrl = R2_PUBLIC_BASE_URL.replace(/\/$/, '');
        const publicUrl = `${baseUrl}/${fileName}`;

        return publicUrl;
    } catch (error) {
        console.error('Error uploading to R2:', error);
        throw new Error('Failed to upload file to R2');
    }
}
