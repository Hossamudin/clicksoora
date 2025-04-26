import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function GET(req: NextRequest) {
  try {
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
    
    // Log API key info (without exposing the actual key)
    console.log('Testing OpenAI API with key:', {
      keyLength: process.env.OPENAI_API_KEY.length,
      keyStart: process.env.OPENAI_API_KEY.substring(0, 3) + '...',
      keyEnd: '...' + process.env.OPENAI_API_KEY.substring(process.env.OPENAI_API_KEY.length - 3)
    });
    
    // Test OpenAI API with a simple models list request
    const startTime = Date.now();
    try {
      const response = await openai.models.list();
      const endTime = Date.now();
      
      // Check if GPT Image 1 is available
      const hasGptImage1 = response.data.some(model => model.id === 'gpt-image-1');
      
      return NextResponse.json({
        success: true,
        message: 'OpenAI API is accessible',
        responseTime: `${endTime - startTime}ms`,
        modelsCount: response.data.length,
        hasGptImage1,
        firstFewModels: response.data.slice(0, 5).map(model => model.id)
      });
    } catch (apiError) {
      const endTime = Date.now();
      console.error('OpenAI API test error:', apiError);
      
      return NextResponse.json(
        { 
          error: 'OpenAI API test failed', 
          message: apiError instanceof Error ? apiError.message : String(apiError),
          responseTime: `${endTime - startTime}ms`,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error testing OpenAI API:', error);
    
    return NextResponse.json(
      { error: 'An unexpected error occurred while testing the OpenAI API', message: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}
