/**
 * Image Generation Service
 * Handles all API calls to the image generation endpoints
 */

type ImageQuality = 'standard' | 'high' | 'low' | 'medium' | 'auto';
type ImageSize = '1024x1024' | '1792x1024' | '1024x1792' | '1536x1024' | '1024x1536';
type ImageFormat = 'jpeg' | 'png' | 'webp';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

interface GenerateImageParams {
  prompt: string;
  model: ImageModel;
  quality: ImageQuality;
  size: ImageSize;
  outputFormat: ImageFormat;
  stream: boolean;
  transparent: boolean;
}

interface StreamChunk {
  status: 'starting' | 'generating' | 'progress' | 'complete' | 'error';
  imageData?: string;
  estimatedCost?: number;
  error?: string;
}

interface StreamCallbacks {
  onStart?: () => void;
  onGenerating?: () => void;
  onProgress?: (imageData: string, estimatedCost: number) => void;
  onComplete?: () => void;
  onError?: (error: string) => void;
}

interface GenerateImageResponse {
  imageData: string;
  estimatedCost: number;
}

/**
 * Process a single line from the stream response
 */
function processStreamLine(line: string, callbacks: StreamCallbacks): void {
  if (!line.trim()) return;
  
  try {
    const data = JSON.parse(line) as StreamChunk;
    
    if (data.status === 'starting' && callbacks.onStart) {
      callbacks.onStart();
    } else if (data.status === 'generating' && callbacks.onGenerating) {
      callbacks.onGenerating();
    } else if (data.status === 'progress' && data.imageData && callbacks.onProgress) {
      callbacks.onProgress(data.imageData, data.estimatedCost || 0);
    } else if (data.status === 'complete' && callbacks.onComplete) {
      callbacks.onComplete();
    } else if (data.status === 'error' && callbacks.onError) {
      callbacks.onError(data.error || 'Unknown error during image generation');
    }
  } catch (parseError) {
    console.error('Error parsing stream chunk:', parseError);
    // Don't throw here, just log the error and continue
    // This prevents the stream processing from breaking on a single bad chunk
  }
}

/**
 * Generate an image using the API with streaming support
 */
export async function generateImageWithStream(
  params: GenerateImageParams,
  callbacks: StreamCallbacks
): Promise<void> {
  try {
    // Set timeout to prevent infinite loading - increased to 3 minutes
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 3 minutes. The image might still be processing.')), 180000);
    });
    
    // Race between the actual request and the timeout
    const response = await Promise.race([
      fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          quality: params.quality,
          size: params.size,
          outputFormat: params.outputFormat,
          model: params.model,
          stream: true,
          transparent: params.transparent && (params.outputFormat === 'png' || params.outputFormat === 'webp'),
        }),
      }),
      timeoutPromise
    ]) as Response;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const reader = response.body?.getReader();
    if (!reader) throw new Error('Failed to read response stream');

    // Process the stream
    const decoder = new TextDecoder();
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      // Decode the chunk and add it to our buffer
      buffer += decoder.decode(value, { stream: true });
      
      // Process complete lines
      const lines = buffer.split('\n');
      // Keep the last line in the buffer if it's incomplete
      buffer = lines.pop() || '';
      
      // Process each complete line
      for (const line of lines) {
        if (line.trim()) {
          processStreamLine(line, callbacks);
        }
      }
    }
    
    // Process any remaining data in the buffer
    if (buffer.trim()) {
      processStreamLine(buffer, callbacks);
    }
  } catch (error) {
    if (callbacks.onError) {
      callbacks.onError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } else {
      throw error;
    }
  }
}

/**
 * Generate an image using the API without streaming
 */
export async function generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
  try {
    // Set timeout to prevent infinite loading - increased to 3 minutes
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Request timed out after 3 minutes. The image might still be processing.')), 180000);
    });
    
    // Race between the actual request and the timeout
    const response = await Promise.race([
      fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt,
          quality: params.quality,
          size: params.size,
          outputFormat: params.outputFormat,
          model: params.model,
          stream: false,
          transparent: params.transparent && (params.outputFormat === 'png' || params.outputFormat === 'webp'),
        }),
      }),
      timeoutPromise
    ]) as Response;

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Server responded with ${response.status}`);
    }

    const data = await response.json();
    return {
      imageData: data.imageData,
      estimatedCost: data.estimatedCost || 0,
    };
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}
