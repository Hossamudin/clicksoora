"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX, FiPlus } from 'react-icons/fi';

interface ImageUploaderProps {
  onMainImageUpload: (file: File, previewUrl: string) => void;
  onComponentImagesUpload: (files: File[], previewUrls: string[]) => void;
  mainImage: File | null;
  mainImagePreview: string;
  componentImages: File[];
  componentImagesPreview: string[];
  clearMainImage: () => void;
  clearComponentImage: (index: number) => void;
}

export default function ImageUploader({
  onMainImageUpload,
  onComponentImagesUpload,
  mainImage,
  mainImagePreview,
  componentImages,
  componentImagesPreview,
  clearMainImage,
  clearComponentImage
}: ImageUploaderProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const componentImageInputRef = useRef<HTMLInputElement>(null);

  // Handle main image upload
  const handleMainImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const previewUrl = URL.createObjectURL(file);
    onMainImageUpload(file, previewUrl);
    
    // Reset input value to allow uploading the same file again
    if (event.target.value) event.target.value = '';
  };

  // Handle component images upload
  const handleComponentImagesUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFiles: File[] = [];
    const newPreviewUrls: string[] = [];

    // Convert FileList to array and create preview URLs
    Array.from(files).forEach(file => {
      newFiles.push(file);
      newPreviewUrls.push(URL.createObjectURL(file));
    });

    onComponentImagesUpload(newFiles, newPreviewUrls);
    
    // Reset input value to allow uploading the same file again
    if (event.target.value) event.target.value = '';
  };

  return (
    <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
      <h3 className="text-lg font-medium mb-4">Upload Images</h3>
      
      {/* Main Image Upload */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Main Image</label>
        <div className="flex items-center space-x-4">
          <input
            type="file"
            ref={mainImageInputRef}
            onChange={handleMainImageUpload}
            accept="image/*"
            className="hidden"
          />
          
          {!mainImage ? (
            <button
              type="button"
              onClick={() => mainImageInputRef.current?.click()}
              className="flex items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
            >
              <FiUpload className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          ) : (
            <div className="relative w-32 h-32">
              <img 
                src={mainImagePreview} 
                alt="Main image preview" 
                className="w-32 h-32 object-cover rounded-lg" 
              />
              <button
                type="button"
                onClick={clearMainImage}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          )}
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <p>Upload the main image you want to edit or use as reference</p>
            <p>Supported formats: JPEG, PNG, WebP</p>
          </div>
        </div>
      </div>
      
      {/* Component Images Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Component Images (Optional, max 9)</label>
        <div className="flex flex-wrap gap-2">
          <input
            type="file"
            ref={componentImageInputRef}
            onChange={handleComponentImagesUpload}
            accept="image/*"
            multiple
            className="hidden"
          />
          
          {/* Add button for component images (only show if less than 9 component images) */}
          {componentImages.length < 9 && (
            <button
              type="button"
              onClick={() => componentImageInputRef.current?.click()}
              className="flex items-center justify-center w-24 h-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
              disabled={componentImages.length >= 9}
            >
              <FiPlus className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          )}
          
          {/* Display component image previews */}
          {componentImagesPreview.map((previewUrl, index) => (
            <div key={index} className="relative w-24 h-24">
              <img 
                src={previewUrl} 
                alt={`Component image ${index + 1}`} 
                className="w-24 h-24 object-cover rounded-lg" 
              />
              <button
                type="button"
                onClick={() => clearComponentImage(index)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Upload additional images to combine with the main image (up to 9 additional images)
        </p>
      </div>
    </div>
  );
}
