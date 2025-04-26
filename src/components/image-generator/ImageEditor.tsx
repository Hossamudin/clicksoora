"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiEdit, FiRefreshCw, FiInfo, FiSettings } from 'react-icons/fi';
import ImageUploader from './ImageUploader';
import ImageOptions from './ImageOptions';
import { formatCost, getEstimatedEditCost } from '@/utils/costEstimation';
import { editImage } from '@/services/imageEditingService';

type ImageQuality = 'standard' | 'high' | 'low' | 'medium' | 'auto';
type ImageSize = '1024x1024' | '1792x1024' | '1024x1792' | '1536x1024' | '1024x1536';
type ImageFormat = 'jpeg' | 'png' | 'webp';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

interface ImageEditorProps {
  initialQuality: ImageQuality;
  initialSize: ImageSize;
  initialOutputFormat: ImageFormat;
  initialTransparent: boolean;
}

export default function ImageEditor({ 
  initialQuality,
  initialSize,
  initialOutputFormat,
  initialTransparent
}: ImageEditorProps) {
  // Image options states - we keep these for UI consistency
  // but they're not used in the API call
  const [quality, setQuality] = useState<ImageQuality>(initialQuality);
  const [size, setSize] = useState<ImageSize>(initialSize);
  const [outputFormat, setOutputFormat] = useState<ImageFormat>(initialOutputFormat);
  const [transparent, setTransparent] = useState(initialTransparent);
  const [showOptions, setShowOptions] = useState(false);
  
  // State for image upload
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string>('');
  const [componentImages, setComponentImages] = useState<File[]>([]);
  const [componentImagesPreview, setComponentImagesPreview] = useState<string[]>([]);
  
  // State for image editing
  const [prompt, setPrompt] = useState('');
  const [editedImageData, setEditedImageData] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(getEstimatedEditCost()); // Use our utility function
  const [processingTime, setProcessingTime] = useState<number | null>(null);

  // Handle main image upload
  const handleMainImageUpload = (file: File, previewUrl: string) => {
    setMainImage(file);
    setMainImagePreview(previewUrl);
    setEditedImageData(''); // Clear any previous edited image
  };

  // Handle component images upload
  const handleComponentImagesUpload = (files: File[], previewUrls: string[]) => {
    // Limit to 9 component images (10 total with main image)
    const maxComponentImages = 9;
    const newFiles = [...componentImages, ...files].slice(0, maxComponentImages);
    const newPreviewUrls = [...componentImagesPreview, ...previewUrls].slice(0, maxComponentImages);
    
    setComponentImages(newFiles);
    setComponentImagesPreview(newPreviewUrls);
    setEditedImageData(''); // Clear any previous edited image
  };

  // Clear main image
  const clearMainImage = () => {
    setMainImage(null);
    setMainImagePreview('');
    setEditedImageData(''); // Clear any previous edited image
  };

  // Clear component image at specific index
  const clearComponentImage = (index: number) => {
    setComponentImages(prev => prev.filter((_, i) => i !== index));
    setComponentImagesPreview(prev => prev.filter((_, i) => i !== index));
    setEditedImageData(''); // Clear any previous edited image
  };

  // Handle image editing
  const handleEditImage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mainImage || !prompt.trim()) {
      setError('Please provide both a main image and a prompt');
      return;
    }
    
    setLoading(true);
    setError('');
    setEditedImageData('');
    setProcessingTime(null);
    
    // Record start time for processing time calculation
    const startTime = Date.now();
    
    try {
      console.log('Starting image edit with quality:', quality, 'size:', size);
      
      // Use the imageEditingService instead of direct fetch
      const result = await editImage({
        prompt,
        mainImage,
        componentImages,
        model: 'gpt-image-1', // Explicitly set the model to GPT Image 1
        quality,
        size,
        outputFormat,
        transparent: transparent && (outputFormat === 'png' || outputFormat === 'webp'),
      });
      
      setEditedImageData(result.imageData);
      setEstimatedCost(result.estimatedCost || getEstimatedEditCost(quality));
      
      // Calculate processing time
      const endTime = Date.now();
      setProcessingTime(endTime - startTime);
      
      // Log usage information if available
      if (result.usage) {
        console.log('Image editing usage information:', result.usage);
      }
    } catch (error) {
      console.error('Error editing image:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Reset all states
  const handleReset = () => {
    setPrompt('');
    setEditedImageData('');
    setError('');
    setProcessingTime(null);
  };

  // Format processing time in seconds
  const formatProcessingTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    return `${seconds} second${seconds !== 1 ? 's' : ''}`;
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Image Editor</h2>
        <div className="flex gap-2">
          <button 
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Image Settings"
          >
            <FiSettings className="w-5 h-5" />
          </button>
        </div>
      </div>
      
      {/* We keep the options UI for consistency, but they don't affect the API call */}
      {showOptions && (
        <div className="mb-6">
          <ImageOptions 
            model="gpt-image-1"
            setModel={() => {}} // Only GPT Image 1 supports editing
            quality={quality}
            setQuality={setQuality}
            size={size}
            setSize={setSize}
            outputFormat={outputFormat}
            setOutputFormat={setOutputFormat}
            stream={false}
            setStream={() => {}} // No streaming for editing
            transparent={transparent}
            setTransparent={setTransparent}
          />
        </div>
      )}
      
      <ImageUploader
        onMainImageUpload={handleMainImageUpload}
        onComponentImagesUpload={handleComponentImagesUpload}
        mainImage={mainImage}
        mainImagePreview={mainImagePreview}
        componentImages={componentImages}
        componentImagesPreview={componentImagesPreview}
        clearMainImage={clearMainImage}
        clearComponentImage={clearComponentImage}
      />
      
      <form onSubmit={handleEditImage} className="mt-6">
        <div className="mb-4">
          <label htmlFor="edit-prompt" className="block text-sm font-medium mb-2">Edit Prompt</label>
          <textarea
            id="edit-prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            placeholder="Describe how you want to edit the image..."
            className="block w-full pl-3 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            disabled={loading || !mainImage}
          />
          {error && (
            <p className="mt-2 text-sm text-red-500">{error}</p>
          )}
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
            <FiInfo className="w-4 h-4 mr-1" />
            <span>Estimated cost: {formatCost(estimatedCost)}</span>
            {processingTime && (
              <span className="ml-3">Processing time: {formatProcessingTime(processingTime)}</span>
            )}
          </div>
          
          <div className="flex gap-2">
            {editedImageData && (
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                Reset
              </button>
            )}
            
            <button
              type="submit"
              disabled={loading || !mainImage || !prompt.trim()}
              className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white font-medium rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                  Editing...
                </>
              ) : (
                <>
                  <FiEdit className="w-5 h-5 mr-2" />
                  Edit Image
                </>
              )}
            </button>
          </div>
        </div>
      </form>
      
      {loading && (
        <div className="my-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-blue-800 dark:text-blue-200">
          <p className="flex items-center">
            <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
            <span>Processing your image. This may take up to 3 minutes depending on complexity...</span>
          </p>
        </div>
      )}
      
      {/* Display edited image */}
      {editedImageData && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-2">Edited Image</h3>
          <div className="relative overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 flex justify-center">
            <img
              src={`data:image/${outputFormat};base64,${editedImageData}`}
              alt="Edited image"
              className="max-w-full max-h-[600px] object-contain"
            />
            <a
              href={`data:image/${outputFormat};base64,${editedImageData}`}
              download={`edited-image.${outputFormat}`}
              className="absolute bottom-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Download
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
