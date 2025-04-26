import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cost estimation for image generation (in USD)
const COST_ESTIMATES = {
  'dall-e-3': {
    standard: 0.04,
    hd: 0.08,
  },
  'gpt-image-1': {
    low: 0.01,
    medium: 0.02,
    high: 0.03,
    auto: 0.02, // Default to medium cost for auto quality
  }
};

export async function POST(req: NextRequest) {
  try {
    // Get parameters from request body
    const { 
      prompt, 
      quality = 'standard', 
      size = '1024x1024',
      outputFormat = 'jpeg',
      model = 'gpt-image-1', // Default to GPT Image 1
      stream = false, // Whether to stream the response
      transparent = false, // Whether to generate an image with transparent background
    } = await req.json();
    
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json(
        { error: 'Please provide a valid prompt' },
        { status: 400 }
      );
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { 
          error: 'OpenAI API key is not configured', 
          message: 'Please set the OPENAI_API_KEY environment variable'
        },
        { status: 500 }
      );
    }

    // Calculate estimated cost based on model
    let estimatedCost = 0;
    if (model === 'dall-e-3') {
      const dalleQuality = quality === 'high' ? 'hd' : 'standard';
      estimatedCost = COST_ESTIMATES['dall-e-3'][dalleQuality as keyof typeof COST_ESTIMATES['dall-e-3']];
    } else if (model === 'gpt-image-1') {
      estimatedCost = COST_ESTIMATES['gpt-image-1'][quality as keyof typeof COST_ESTIMATES['gpt-image-1']];
    }

    // Log generation parameters
    console.log('Generating image with parameters:', {
      model,
      prompt: prompt.substring(0, 50) + '...',
      quality,
      size,
      stream,
      transparent,
      outputFormat,
    });

    // Handle streaming for GPT Image 1
    if (model === 'gpt-image-1' && stream) {
      const encoder = new TextEncoder();
      
      // Create a readable stream for sending chunks to the client
      const readableStream = new ReadableStream({
        async start(controller) {
          try {
            // Send initial message
            const startMessage = JSON.stringify({ status: 'starting' });
            controller.enqueue(encoder.encode(startMessage + '\n'));
            
            // Generate image
            // Note: OpenAI doesn't support true streaming for image generation yet
            // This is a simulated streaming approach
            const generatingMessage = JSON.stringify({ status: 'generating' });
            controller.enqueue(encoder.encode(generatingMessage + '\n'));
            
            // Generate the image (non-streaming since API doesn't support it yet)
            const response = await openai.images.generate({
              model: "gpt-image-1",
              prompt: prompt,
              size: size as '1024x1024' | '1536x1024' | '1024x1536',
              quality: quality as 'low' | 'medium' | 'high' | 'auto',
              output_format: outputFormat,
              ...(transparent && (outputFormat === 'png' || outputFormat === 'webp') ? { background: 'transparent' } : {}),
            });
            
            if (response.data?.[0]?.b64_json) {
              // Send the image data
              const progressMessage = JSON.stringify({
                status: 'progress',
                imageData: response.data[0].b64_json,
                estimatedCost,
                model,
                quality,
                size,
                outputFormat,
                transparent
              });
              controller.enqueue(encoder.encode(progressMessage + '\n'));
            }

            // Send completion message
            const completeMessage = JSON.stringify({ status: 'complete' });
            controller.enqueue(encoder.encode(completeMessage + '\n'));
            controller.close();
          } catch (error) {
            console.error('Error in stream:', error);
            let errorMessage = 'Unknown error during image generation';
            if (error instanceof Error) {
              errorMessage = error.message;
            } else if (typeof error === 'string') {
              errorMessage = error;
            } else if (error instanceof OpenAI.APIError) {
              errorMessage = `OpenAI API Error: ${error.message}`;
            }
            
            const errorResponse = JSON.stringify({ 
              status: 'error', 
              error: errorMessage
            });
            controller.enqueue(encoder.encode(errorResponse + '\n'));
            controller.close();
          }
        }
      });

      return new Response(readableStream, {
        headers: {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
        },
      });
    }

    // Non-streaming image generation
    let response;
    if (model === 'dall-e-3') {
      const dalleQuality = quality === 'high' ? 'hd' : 'standard';
      response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: size as '1024x1024' | '1792x1024' | '1024x1792',
        quality: dalleQuality as 'standard' | 'hd',
      });
    } else if (model === 'gpt-image-1') {
      response = await openai.images.generate({
        model: "gpt-image-1",
        prompt: prompt,
        size: size as '1024x1024' | '1536x1024' | '1024x1536',
        quality: quality as 'low' | 'medium' | 'high' | 'auto',
        output_format: outputFormat,
        ...(transparent && (outputFormat === 'png' || outputFormat === 'webp') ? { background: 'transparent' } : {}),
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid model specified' },
        { status: 400 }
      );
    }

    console.log('Image generation response received');

    // Get the URL or base64 data of the generated image
    let imageBase64;
    if (response.data?.[0]?.url) {
      // For DALL-E 3, fetch the image and convert to base64
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const imageArrayBuffer = await imageResponse.arrayBuffer();
      const imageBuffer = Buffer.from(imageArrayBuffer);
      imageBase64 = imageBuffer.toString('base64');
    } else if (response.data?.[0]?.b64_json) {
      // For GPT Image 1, use the provided base64 data
      imageBase64 = response.data[0].b64_json;
    } else {
      console.error('No image data in response:', response);
      throw new Error('No image was generated');
    }

    // Return the image data and estimated cost
    return NextResponse.json({ 
      imageData: imageBase64, 
      estimatedCost,
      model,
      quality,
      size,
      outputFormat,
      transparent
    });
  } catch (error) {
    console.error('Error generating image:', error);
    
    // Handle different types of errors
    if (error instanceof OpenAI.APIError) {
      const status = error.status || 500;
      console.error('OpenAI API Error:', {
        status,
        message: error.message,
        type: error.type,
        code: error.code,
      });
      
      return NextResponse.json(
        { 
          error: error.message || 'OpenAI API error',
          details: {
            type: error.type,
            code: error.code,
          }
        },
        { status }
      );
    }
    
    return NextResponse.json(
      { error: 'An unexpected error occurred during image generation', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
