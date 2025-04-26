/**
 * Image Editing Service
 * Handles all API calls to the image editing endpoints
 */

import { isDemoMode, getSampleImageData, getSampleCostEstimation } from '@/utils/demoMode';

type ImageQuality = 'standard' | 'high' | 'low' | 'medium' | 'auto';
type ImageSize = '1024x1024' | '1792x1024' | '1024x1792' | '1536x1024' | '1024x1536' | 'auto';
type ImageFormat = 'jpeg' | 'png' | 'webp';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

interface EditImageParams {
  prompt: string;
  mainImage: File;
  componentImages?: File[];
  mask?: File;
  model: ImageModel;
  quality: ImageQuality;
  size: ImageSize;
  outputFormat: ImageFormat;
  transparent: boolean;
}

interface EditImageResponse {
  imageData: string;
  estimatedCost: number;
  usage?: {
    totalTokens: number;
    inputTokens: number;
    outputTokens: number;
    inputTokensDetails?: {
      textTokens: number;
      imageTokens: number;
    };
  } | null;
}

// Helper function to log detailed information
function debugLog(message: string, data?: any) {
  const timestamp = new Date().toISOString();
  console.log(`[CLIENT ${timestamp}] ${message}`);
  if (data) {
    try {
      console.log(JSON.stringify(data, null, 2));
    } catch (error) {
      console.log('Could not stringify data:', data);
    }
  }
}

/**
 * Edit an image using the API
 */
export async function editImage(params: EditImageParams): Promise<EditImageResponse> {
  // Check if we're in demo mode
  if (isDemoMode()) {
    console.log('Running in demo mode - returning sample edited image data');
    return {
      imageData: getSampleImageData(),
      estimatedCost: getSampleCostEstimation()
    };
  }

  debugLog('ud83dude80 Starting image edit request', {
    prompt: params.prompt.substring(0, 30) + '...',
    model: params.model,
    quality: params.quality,
    size: params.size,
    hasComponentImages: params.componentImages && params.componentImages.length > 0,
    hasMask: !!params.mask,
    mainImageType: params.mainImage.type,
    mainImageSize: `${(params.mainImage.size / (1024 * 1024)).toFixed(2)}MB`
  });

  try {
    // Create a FormData object to send files
    const formData = new FormData();
    debugLog('ud83dudce6 Creating form data');
    
    // Add main parameters
    formData.append('prompt', params.prompt);
    formData.append('mainImage', params.mainImage);
    formData.append('quality', params.quality);
    formData.append('size', params.size);
    formData.append('model', params.model); // Explicitly send the model parameter
    
    // Add mask if provided
    if (params.mask) {
      formData.append('mask', params.mask);
      debugLog('ud83dudcce Added mask to form data');
    }
    
    // Add component images if provided
    if (params.componentImages && params.componentImages.length > 0) {
      params.componentImages.forEach((image, index) => {
        formData.append('componentImages', image);
        debugLog(`ud83dudcce Added component image ${index + 1} to form data`, {
          type: image.type,
          size: `${(image.size / (1024 * 1024)).toFixed(2)}MB`
        });
      });
    }
    
    // Log all form data keys for debugging
    debugLog('ud83dudccb Form data keys', Array.from(formData.keys()));
    
    // Set a longer timeout for the fetch request (3 minutes)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      controller.abort();
      debugLog('u23f0 Request timed out after 3 minutes');
    }, 180000); // 3 minutes
    
    try {
      // Make API request
      debugLog('ud83dudd0d Sending fetch request to /api/edit');
      const startTime = Date.now();
      
      // First, check if the OpenAI API is accessible
      try {
        debugLog('ud83dudd0c Testing OpenAI API connection');
        const testResponse = await fetch('/api/test-openai', {
          method: 'GET',
          headers: {
            'Cache-Control': 'no-cache'
          }
        });
        
        const testData = await testResponse.json();
        if (!testResponse.ok) {
          debugLog('u274c OpenAI API test failed', testData);
          throw new Error(`OpenAI API test failed: ${testData.message || 'Unknown error'}`);
        }
        
        debugLog('u2705 OpenAI API test successful', testData);
      } catch (testError) {
        debugLog('u274c Error testing OpenAI API', {
          error: testError instanceof Error ? testError.message : String(testError)
        });
        // Continue with the edit request even if the test fails
      }
      
      const response = await fetch('/api/edit', {
        method: 'POST',
        body: formData,
        signal: controller.signal
      });
      
      const endTime = Date.now();
      debugLog(`u2705 Received response from server in ${endTime - startTime}ms`, {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries())
      });
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        debugLog('u274c Server returned an error response', {
          status: response.status,
          statusText: response.statusText
        });
        
        let errorData;
        try {
          errorData = await response.json();
          debugLog('u274c Error response JSON', errorData);
        } catch (parseError) {
          debugLog('u274c Could not parse error response as JSON', {
            error: parseError instanceof Error ? parseError.message : String(parseError),
            responseText: await response.text().catch(() => 'Could not get response text')
          });
          errorData = {
            error: 'Failed to parse error response',
            message: `Server responded with status ${response.status}`
          };
        }
        
        throw new Error(errorData.error || errorData.message || `Server responded with ${response.status}`);
      }
      
      debugLog('ud83dudd0e Parsing successful response');
      let data;
      try {
        data = await response.json();
        debugLog('u2705 Successfully parsed response JSON', {
          hasImageData: !!data.imageData,
          estimatedCost: data.estimatedCost,
          hasUsage: !!data.usage
        });
      } catch (parseError) {
        debugLog('u274c Could not parse success response as JSON', {
          error: parseError instanceof Error ? parseError.message : String(parseError),
          responseText: await response.text().catch(() => 'Could not get response text')
        });
        throw new Error('Failed to parse server response');
      }
      
      if (!data.imageData) {
        debugLog('u274c Response missing image data');
        throw new Error('Server response missing image data');
      }
      
      debugLog('u2705 Successfully received edited image data');
      
      return {
        imageData: data.imageData,
        estimatedCost: data.estimatedCost || 0,
        usage: data.usage || null
      };
    } catch (error) {
      // Check if this is an abort error (timeout)
      if (error instanceof DOMException && error.name === 'AbortError') {
        debugLog('u23f0 Request aborted due to timeout');
        throw new Error('Request timed out after 3 minutes. The image editing process took too long.');
      }
      
      debugLog('u274c Fetch error', {
        error: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : 'Unknown',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
      
      throw error;
    }
  } catch (error) {
    debugLog('u274c Error editing image', {
      error: error instanceof Error ? error.message : String(error),
      name: error instanceof Error ? error.name : 'Unknown',
      stack: error instanceof Error ? error.stack : 'No stack trace'
    });
    throw error;
  }
}
