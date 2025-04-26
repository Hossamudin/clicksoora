import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client with a longer timeout
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  timeout: 300000, // 5 minutes in milliseconds
  maxRetries: 2, // Allow 2 retries for transient errors
});

// Cost estimation for GPT-1 image editing (in USD)
const COST_ESTIMATES = {
  low: 0.020,
  medium: 0.070,
  high: 0.190,
  standard: 0.020, // Default to low quality cost
  auto: 0.020, // Default to low quality cost
};

// Maximum image size in bytes (25MB as per OpenAI docs)
const MAX_IMAGE_SIZE = 25 * 1024 * 1024;

// Maximum prompt length for GPT Image 1 (32000 characters)
const MAX_PROMPT_LENGTH = 32000;

// Supported image formats
const SUPPORTED_FORMATS = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];

// Helper function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[DEBUG ${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
}

export async function POST(req: NextRequest) {
  debugLog('🚀 Received edit request');
  
  try {
    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      debugLog('❌ OpenAI API key is missing');
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured', 
          message: 'Please set the OPENAI_API_KEY environment variable'
        },
        { status: 500 }
      );
    }
    
    debugLog('✅ OpenAI API key is present', { 
      keyLength: process.env.OPENAI_API_KEY.length,
      keyStart: process.env.OPENAI_API_KEY.substring(0, 3) + '...',
      keyEnd: '...' + process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)
    });

    // Parse form data with images
    debugLog('📦 Parsing form data');
    const formData = await req.formData();
    
    // Log all form data keys for debugging
    const formDataKeys = Array.from(formData.keys());
    debugLog('📋 Form data keys', formDataKeys);
    
    const prompt = formData.get('prompt') as string;
    const mainImage = formData.get('mainImage') as File;
    const maskFile = formData.get('mask') as File | null;
    const quality = formData.get('quality') as string || 'standard';
    const size = formData.get('size') as string || 'auto';
    const model = formData.get('model') as string || 'gpt-image-1';
    
    // Get component images (multiple files with the same name)
    const componentImages: File[] = [];
    for (const [key, value] of formData.entries()) {
      if (key === 'componentImages' && value instanceof File) {
        componentImages.push(value);
      }
    }

    debugLog('📝 Extracted request parameters', {
      prompt: prompt?.substring(0, 50) + (prompt?.length > 50 ? '...' : ''),
      mainImagePresent: !!mainImage,
      mainImageType: mainImage?.type,
      mainImageSize: mainImage?.size,
      componentImagesCount: componentImages.length,
      hasMask: !!maskFile,
      quality,
      size,
      model
    });

    // Validate required parameters
    if (!prompt) {
      debugLog('❌ Missing prompt');
      return NextResponse.json(
        { error: 'Please provide a valid prompt', message: 'A prompt is required for image editing' },
        { status: 400 }
      );
    }

    if (!mainImage) {
      debugLog('❌ Missing main image');
      return NextResponse.json(
        { error: 'Please provide a main image', message: 'A main image is required for editing' },
        { status: 400 }
      );
    }

    // Validate prompt length
    if (prompt.length > MAX_PROMPT_LENGTH) {
      debugLog('❌ Prompt too long', { length: prompt.length, maxLength: MAX_PROMPT_LENGTH });
      return NextResponse.json(
        { error: `Prompt exceeds maximum length of ${MAX_PROMPT_LENGTH} characters`, message: 'Please shorten your prompt' },
        { status: 400 }
      );
    }

    // Validate image format
    if (!SUPPORTED_FORMATS.includes(mainImage.type)) {
      debugLog('❌ Unsupported main image format', { format: mainImage.type });
      return NextResponse.json(
        { error: 'Main image must be in PNG, JPEG, or WebP format', message: `Received format: ${mainImage.type}` },
        { status: 400 }
      );
    }

    // Validate image sizes (OpenAI limit is 25MB, but we're setting a lower limit for better performance)
    const MAX_IMAGE_SIZE_MB = 4; 
    const MAX_IMAGE_SIZE_BYTES = MAX_IMAGE_SIZE_MB * 1024 * 1024;
    
    // Check main image size
    if (mainImage.size > MAX_IMAGE_SIZE_BYTES) {
      debugLog('❌ Main image too large', { size: mainImage.size, maxSize: MAX_IMAGE_SIZE_BYTES });
      return NextResponse.json({
        error: `Image too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
        details: {
          imageSize: `${(mainImage.size / (1024 * 1024)).toFixed(2)}MB`,
          maxSize: `${MAX_IMAGE_SIZE_MB}MB`
        }
      }, { status: 400 });
    }
    
    // Check component images sizes
    for (let i = 0; i < componentImages.length; i++) {
      if (componentImages[i].size > MAX_IMAGE_SIZE_BYTES) {
        debugLog('❌ Component image too large', { index: i, size: componentImages[i].size, maxSize: MAX_IMAGE_SIZE_BYTES });
        return NextResponse.json({
          error: `Component image ${i+1} too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
          details: {
            imageSize: `${(componentImages[i].size / (1024 * 1024)).toFixed(2)}MB`,
            maxSize: `${MAX_IMAGE_SIZE_MB}MB`
          }
        }, { status: 400 });
      }
    }
    
    // Check mask size if provided
    if (maskFile && maskFile.size > MAX_IMAGE_SIZE_BYTES) {
      debugLog('❌ Mask image too large', { size: maskFile.size, maxSize: MAX_IMAGE_SIZE_BYTES });
      return NextResponse.json({
        error: `Mask image too large. Maximum size is ${MAX_IMAGE_SIZE_MB}MB.`,
        details: {
          imageSize: `${(maskFile.size / (1024 * 1024)).toFixed(2)}MB`,
          maxSize: `${MAX_IMAGE_SIZE_MB}MB`
        }
      }, { status: 400 });
    }

    // Validate component images (max 9 additional images for a total of 10)
    if (componentImages.length > 9) {
      debugLog('❌ Too many component images', { count: componentImages.length });
      return NextResponse.json(
        { error: 'Maximum of 9 component images allowed', message: `Received ${componentImages.length} component images` },
        { status: 400 }
      );
    }

    // Validate each component image
    for (const img of componentImages) {
      if (!SUPPORTED_FORMATS.includes(img.type)) {
        debugLog('❌ Unsupported component image format', { format: img.type });
        return NextResponse.json(
          { error: 'All component images must be in PNG, JPEG, or WebP format', message: `Received format: ${img.type}` },
          { status: 400 }
        );
      }
    }

    // Validate mask if provided
    if (maskFile) {
      if (maskFile.type !== 'image/png') {
        debugLog('❌ Unsupported mask format', { format: maskFile.type });
        return NextResponse.json(
          { error: 'Mask must be in PNG format', message: `Received format: ${maskFile.type}` },
          { status: 400 }
        );
      }
    }

    try {
      // Create an array of image files for the API
      const imageFiles: File[] = [mainImage, ...componentImages];
      debugLog('✅ Images prepared for API', { count: imageFiles.length });
      
      // Prepare parameters for OpenAI API
      const params: OpenAI.Images.ImageEditParams = {
        model: "gpt-image-1",
        prompt,
        image: imageFiles,
        n: 1,
      };

      // Only include size if it's not auto
      if (size !== 'auto') {
        params.size = size as OpenAI.Images.ImageEditParams['size'];
      }

      // Only include quality if it's not auto
      if (quality !== 'auto') {
        params.quality = quality as OpenAI.Images.ImageEditParams['quality'];
      }

      // Add mask if provided
      if (maskFile) {
        params.mask = maskFile;
      }

      debugLog('🚀 Sending request to OpenAI API', { 
        prompt, 
        model: params.model,
        imageCount: imageFiles.length,
        hasMask: !!params.mask,
        size: params.size || 'auto',
        quality: params.quality || 'auto'
      });

      // Call OpenAI API
      const response = await openai.images.edit(params);

      // Get the base64 data of the edited image
      const imageData = response.data?.[0]?.b64_json;

      if (!imageData) {
        debugLog('❌ No image data in response', response);
        throw new Error('No image was generated');
      }

      // Get usage information if available
      const usage = response.usage ? {
        totalTokens: response.usage.total_tokens,
        inputTokens: response.usage.input_tokens,
        outputTokens: response.usage.output_tokens,
        inputTokensDetails: response.usage.input_tokens_details
      } : null;

      debugLog('✅ Successfully edited image');
      if (usage) {
        debugLog('📊 Usage information', usage);
      }

      // Calculate estimated cost based on quality
      const estimatedCost = COST_ESTIMATES[quality as keyof typeof COST_ESTIMATES] || COST_ESTIMATES.standard;
      debugLog('💰 Estimated cost calculated', { quality, estimatedCost });

      // Return the image data, estimated cost, and usage information
      return NextResponse.json({ 
        imageData, 
        estimatedCost,
        usage
      });
    } catch (error) {
      debugLog('❌ Error in image processing', {
        error: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      throw error; // Re-throw to be caught by the outer catch block
    }
  } catch (error) {
    debugLog('❌ Error editing image', {
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    
    // Handle different types of errors
    if (error instanceof OpenAI.APIError) {
      const status = error.status || 500;
      debugLog('❌ OpenAI API Error details', {
        status,
        message: error.message,
        type: error.type,
        code: error.code,
      });
      
      return NextResponse.json(
        { 
          error: error.message || 'OpenAI API error',
          message: `${error.type}: ${error.code || 'unknown error code'}`,
          details: {
            type: error.type,
            code: error.code,
          }
        },
        { status }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'An unexpected error occurred during image editing', 
        message: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}
