/**
 * Cost estimation utilities for image generation
 */

type ImageQuality = 'standard' | 'high' | 'low' | 'medium' | 'auto';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

// Cost per million tokens
const TOKEN_COSTS = {
  'text': 0.005, // $5 per million tokens
  'image-input': 0.010, // $10 per million tokens
  'image-output': 0.040, // $40 per million tokens
};

// Approximate cost per image based on quality and model
const IMAGE_COSTS = {
  'dall-e-3': {
    'standard': 0.040, // $0.04 per image
    'high': 0.080, // $0.08 per image (HD)
  },
  'gpt-image-1': {
    'low': 0.020, // $0.02 per image
    'medium': 0.070, // $0.07 per image
    'high': 0.190, // $0.19 per image
    'auto': 0.070, // Default to medium cost for auto quality
    'standard': 0.020, // Same as low quality
  },
  'gpt-image-1-edit': {
    'low': 0.020, // $0.02 per image
    'medium': 0.070, // $0.07 per image
    'high': 0.190, // $0.19 per image
    'auto': 0.070, // Default to medium cost for auto quality
    'standard': 0.020, // Same as low quality
    'default': 0.020, // Base cost for editing (same as low)
  }
};

/**
 * Get the estimated cost for image generation based on model and quality
 */
export function getEstimatedCost(model: ImageModel, quality: ImageQuality): number {
  if (model === 'dall-e-3') {
    // For DALL-E 3, quality is either standard or high (HD)
    const dalleQuality = quality === 'high' ? 'high' : 'standard';
    return IMAGE_COSTS['dall-e-3'][dalleQuality];
  } else if (model === 'gpt-image-1') {
    // For GPT Image 1, quality can be low, medium, high, or auto
    return IMAGE_COSTS['gpt-image-1'][quality as keyof typeof IMAGE_COSTS['gpt-image-1']] || 
           IMAGE_COSTS['gpt-image-1']['medium']; // Default to medium if quality not found
  }
  
  // Default fallback
  return 0.05;
}

/**
 * Get the estimated cost for image editing based on quality
 */
export function getEstimatedEditCost(quality: ImageQuality = 'standard'): number {
  return IMAGE_COSTS['gpt-image-1-edit'][quality as keyof typeof IMAGE_COSTS['gpt-image-1-edit']] || 
         IMAGE_COSTS['gpt-image-1-edit']['default'];
}

/**
 * Format a cost value as a string with currency symbol
 */
export function formatCost(cost: number): string {
  return `$${cost.toFixed(3)}`;
}
