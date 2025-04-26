/**
 * Image processing utilities for OpenAI API
 */

import sharp from 'sharp';

/**
 * Convert an image to PNG format with proper dimensions for OpenAI API
 * @param imageBuffer - The image buffer to convert
 * @returns Promise<Buffer> - The converted image buffer
 */
export async function prepareImageForEditing(imageBuffer: Buffer): Promise<Buffer> {
  try {
    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata();
    console.log('Original image metadata:', {
      format: metadata.format,
      width: metadata.width,
      height: metadata.height,
      size: imageBuffer.length,
    });
    
    // Convert to PNG format with proper dimensions
    // OpenAI recommends square images for best results
    const processedImage = await sharp(imageBuffer)
      .png() // Convert to PNG format
      .toBuffer();
    
    // Get processed image metadata
    const processedMetadata = await sharp(processedImage).metadata();
    console.log('Processed image metadata:', {
      format: processedMetadata.format,
      width: processedMetadata.width,
      height: processedMetadata.height,
      size: processedImage.length,
    });
    
    return processedImage;
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image for editing');
  }
}

/**
 * Convert a File object to a Buffer
 * @param file - The File object to convert
 * @returns Promise<Buffer> - The converted buffer
 */
export async function fileToBuffer(file: File): Promise<Buffer> {
  return Buffer.from(await file.arrayBuffer());
}
