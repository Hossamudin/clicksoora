"use client";

import { FiDownload } from 'react-icons/fi';

type ImageFormat = 'jpeg' | 'png' | 'webp';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

interface GeneratedImageProps {
  imageData: string;
  outputFormat: ImageFormat;
  model: ImageModel;
  transparent: boolean;
  loading: boolean;
  streamingProgress: number;
  stream: boolean;
}

export default function GeneratedImage({
  imageData,
  outputFormat,
  model,
  transparent,
  loading,
  streamingProgress,
  stream
}: GeneratedImageProps) {
  // If loading with streaming and we have image data, show the streaming progress
  if (loading && stream && streamingProgress > 0 && imageData) {
    return (
      <div className="mt-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative w-full aspect-square">
          <div className="absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
            <p className="text-gray-500 dark:text-gray-400">Generating image... {streamingProgress}%</p>
          </div>
          <img 
            src={`data:image/${outputFormat};base64,${imageData}`}
            alt="Generated AI image (in progress)" 
            className="w-full h-auto relative z-10"
          />
        </div>
      </div>
    );
  }

  // If not loading and we have image data, show the final image
  if (!loading && imageData) {
    return (
      <div className="mt-8 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="relative w-full aspect-square">
          <img 
            src={`data:image/${outputFormat};base64,${imageData}`}
            alt="Generated AI image" 
            className="w-full h-auto"
            style={transparent ? { background: 'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEgAACxIB0t1+/AAAABZ0RVh0Q3JlYXRpb24gVGltZQAxMC8yOS8xMiKqq3kAAAAcdEVYdFNvZnR3YXJlAEFkb2JlIEZpcmV3b3JrcyBDUzVxteM2AAAAVklEQVQ4jWP8//8/AyWAiYFCQDsDPn/+fEFXV5eRkCYWXDYxMjJeJWQKE7LnAQsLC1EuYGFhIWgKrGpgYR4wA7j9M6hcMGoBFrX19fUkpwUAOb8UlADjHdIAAAAASUVORK5CYII=")' } : {}}
          />
        </div>
        <div className="p-4 bg-gray-50 dark:bg-gray-900 flex justify-between items-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Generated with {model === 'dall-e-3' ? 'DALL-E 3' : 'GPT Image 1'}
            {transparent ? ' (transparent background)' : ''}
          </p>
          <a 
            href={`data:image/${outputFormat};base64,${imageData}`}
            download={`clicksoora-image.${outputFormat}`}
            className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FiDownload className="w-4 h-4" />
            <span>Download</span>
          </a>
        </div>
      </div>
    );
  }

  // Return null if no image to display
  return null;
}
