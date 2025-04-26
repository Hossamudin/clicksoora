"use client";

import { useEffect } from 'react';
import { FiInfo } from 'react-icons/fi';

type DallEQuality = 'standard' | 'high';
type GPTImageQuality = 'low' | 'medium' | 'high' | 'auto';
type ImageQuality = DallEQuality | GPTImageQuality;

type DallESize = '1024x1024' | '1792x1024' | '1024x1792';
type GPTImageSize = '1024x1024' | '1536x1024' | '1024x1536';
type ImageSize = DallESize | GPTImageSize;

type ImageFormat = 'jpeg' | 'png' | 'webp';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

interface ImageOptionsProps {
  model: ImageModel;
  setModel: (model: ImageModel) => void;
  quality: ImageQuality;
  setQuality: (quality: ImageQuality) => void;
  size: ImageSize;
  setSize: (size: ImageSize) => void;
  outputFormat: ImageFormat;
  setOutputFormat: (format: ImageFormat) => void;
  stream: boolean;
  setStream: (stream: boolean) => void;
  transparent: boolean;
  setTransparent: (transparent: boolean) => void;
}

export default function ImageOptions({
  model,
  setModel,
  quality,
  setQuality,
  size,
  setSize,
  outputFormat,
  setOutputFormat,
  stream,
  setStream,
  transparent,
  setTransparent,
}: ImageOptionsProps) {
  // Check if transparent background is available
  const isTransparencyAvailable = () => {
    return model === 'gpt-image-1' && (outputFormat === 'png' || outputFormat === 'webp');
  };

  // Update quality when model changes
  useEffect(() => {
    if (model === 'dall-e-3') {
      setQuality('standard');
      setStream(false); // DALL-E 3 doesn't support streaming
      setTransparent(false); // DALL-E 3 doesn't support transparent backgrounds
    } else {
      setQuality('medium');
    }
  }, [model, setQuality, setStream, setTransparent]);

  // Update transparent option when format changes
  useEffect(() => {
    if (outputFormat === 'jpeg') {
      setTransparent(false); // JPEG doesn't support transparency
    }
  }, [outputFormat, setTransparent]);

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="text-lg font-medium mb-3">Image Options</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Model</label>
          <select 
            value={model}
            onChange={(e) => setModel(e.target.value as ImageModel)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            <option value="gpt-image-1">GPT Image 1</option>
            <option value="dall-e-3">DALL-E 3</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Quality</label>
          <select 
            value={quality}
            onChange={(e) => setQuality(e.target.value as ImageQuality)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            {model === 'dall-e-3' ? (
              <>
                <option value="standard">Standard</option>
                <option value="high">HD</option>
              </>
            ) : (
              <>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="auto">Auto</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Size</label>
          <select 
            value={size}
            onChange={(e) => setSize(e.target.value as ImageSize)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            <option value="1024x1024">Square (1024×1024)</option>
            {model === 'dall-e-3' ? (
              <>
                <option value="1792x1024">Landscape (1792×1024)</option>
                <option value="1024x1792">Portrait (1024×1792)</option>
              </>
            ) : (
              <>
                <option value="1536x1024">Landscape (1536×1024)</option>
                <option value="1024x1536">Portrait (1024×1536)</option>
              </>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Format</label>
          <select 
            value={outputFormat}
            onChange={(e) => setOutputFormat(e.target.value as ImageFormat)}
            className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800"
          >
            <option value="jpeg">JPEG</option>
            <option value="png">PNG</option>
            <option value="webp">WebP</option>
          </select>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {model === 'gpt-image-1' && (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={stream}
              onChange={(e) => setStream(e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-500"
            />
            <span className="text-sm text-gray-700 dark:text-gray-300">Enable streaming (see image generation progress)</span>
          </label>
        )}
        
        {isTransparencyAvailable() && (
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={transparent}
              onChange={(e) => setTransparent(e.target.checked)}
              disabled={!isTransparencyAvailable()}
              className="mr-2 h-4 w-4 text-blue-500 disabled:opacity-50"
            />
            <span className={`text-sm ${isTransparencyAvailable() ? 'text-gray-700 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}`}>
              Transparent background (only for PNG/WebP with GPT Image 1)
            </span>
          </label>
        )}
      </div>
    </div>
  );
}
