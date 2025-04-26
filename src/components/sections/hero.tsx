"use client";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiDollarSign, FiInfo, FiRefreshCw } from 'react-icons/fi';

// Import custom components
import ImageOptions from '../image-generator/ImageOptions';
import GeneratedImage from '../image-generator/GeneratedImage';
import ImageEditor from '../image-generator/ImageEditor';

// Import services and utilities
import { generateImage, generateImageWithStream } from '@/services/imageGenerationService';
import { formatCost, getEstimatedCost } from '@/utils/costEstimation';

// Type definitions
type DallEQuality = 'standard' | 'high';
type GPTImageQuality = 'low' | 'medium' | 'high' | 'auto';
type ImageQuality = DallEQuality | GPTImageQuality;

type DallESize = '1024x1024' | '1792x1024' | '1024x1792';
type GPTImageSize = '1024x1024' | '1536x1024' | '1024x1536';
type ImageSize = DallESize | GPTImageSize;

type ImageFormat = 'jpeg' | 'png' | 'webp';
type ImageModel = 'dall-e-3' | 'gpt-image-1';

export default function Hero() {
  // Image generation states
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageData, setImageData] = useState('');
  const [error, setError] = useState('');
  const [estimatedCost, setEstimatedCost] = useState(0);
  const [streamingProgress, setStreamingProgress] = useState(0);
  
  // Image options states
  const [model, setModel] = useState<ImageModel>('gpt-image-1'); // Default to GPT Image 1
  const [quality, setQuality] = useState<ImageQuality>('medium'); // Default for GPT Image 1
  const [size, setSize] = useState<ImageSize>('1024x1024');
  const [outputFormat, setOutputFormat] = useState<ImageFormat>('jpeg');
  const [showOptions, setShowOptions] = useState(false);
  const [stream, setStream] = useState(true); // Default streaming to true for GPT Image 1
  const [transparent, setTransparent] = useState(false); // Transparent background option
  
  // UI mode state
  const [mode, setMode] = useState<'generate' | 'edit'>('generate'); // Default to generate mode

  // Handle image generation
  const handleGenerateImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    
    setLoading(true);
    setError('');
    setImageData('');
    setStreamingProgress(0);
    
    try {
      // For GPT Image 1 with streaming
      if (model === 'gpt-image-1' && stream) {
        await generateImageWithStream(
          {
            prompt,
            quality,
            size,
            outputFormat,
            model,
            stream: true,
            transparent: transparent && (outputFormat === 'png' || outputFormat === 'webp'),
          },
          {
            onStart: () => setStreamingProgress(10),
            onGenerating: () => setStreamingProgress(30),
            onProgress: (imageData, cost) => {
              setImageData(imageData);
              setEstimatedCost(cost);
              setStreamingProgress(90);
            },
            onComplete: () => setStreamingProgress(100),
            onError: (errorMessage) => {
              setError(errorMessage);
              setLoading(false);
            },
          }
        );
      } else {
        // For non-streaming requests (DALL-E 3 or GPT Image 1 without streaming)
        const result = await generateImage({
          prompt,
          quality,
          size,
          outputFormat,
          model,
          stream: false,
          transparent: transparent && (outputFormat === 'png' || outputFormat === 'webp'),
        });
        
        setImageData(result.imageData);
        setEstimatedCost(result.estimatedCost);
      }
    } catch (error) {
      console.error('Error generating image:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Reset all states
  const handleReset = () => {
    setPrompt('');
    setImageData('');
    setError('');
    setEstimatedCost(0);
    setStreamingProgress(0);
  };

  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-10">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 bg-clip-text text-transparent">
              {mode === 'generate' ? 'Generate' : 'Edit'} Amazing AI Images
            </span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-300 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {mode === 'generate' 
              ? 'Transform your ideas into stunning visuals with advanced AI technology. Just describe what you want to see!'
              : 'Upload and edit images with AI. Combine multiple images or apply creative transformations!'}
          </motion.p>
          
          {/* Mode toggle */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex rounded-md shadow-sm" role="group">
              <button
                type="button"
                onClick={() => setMode('generate')}
                className={`px-4 py-2 text-sm font-medium rounded-l-lg ${mode === 'generate' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                Generate Images
              </button>
              <button
                type="button"
                onClick={() => setMode('edit')}
                className={`px-4 py-2 text-sm font-medium rounded-r-lg ${mode === 'edit' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
              >
                Edit Images
              </button>
            </div>
          </div>
        </div>

        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="p-6 md:p-8">
            {mode === 'generate' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Create Your Image</h2>
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

                {showOptions && (
                  <ImageOptions 
                    model={model}
                    setModel={setModel}
                    quality={quality}
                    setQuality={setQuality}
                    size={size}
                    setSize={setSize}
                    outputFormat={outputFormat}
                    setOutputFormat={setOutputFormat}
                    stream={stream}
                    setStream={setStream}
                    transparent={transparent}
                    setTransparent={setTransparent}
                  />
                )}

                <form onSubmit={handleGenerateImage}>
                  <div className="mb-4">
                    <textarea 
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      rows={5}
                      placeholder="Describe the image you want to create in detail..."
                      className="block w-full pl-3 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[120px] resize-none"
                      disabled={loading}
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-500">{error}</p>
                    )}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <FiDollarSign className="w-4 h-4 mr-1" />
                      <span>Estimated cost: {formatCost(estimatedCost || getEstimatedCost(model, quality))}</span>
                      <button 
                        type="button" 
                        className="ml-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title={`${model === 'dall-e-3' ? 'DALL-E 3' : 'GPT Image 1'} costs vary based on quality settings`}
                      >
                        <FiInfo className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {imageData && (
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
                        disabled={loading || !prompt.trim()}
                        className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white font-medium rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      >
                        {loading ? (
                          <>
                            <FiRefreshCw className="w-5 h-5 mr-2 animate-spin" />
                            {stream && streamingProgress > 0 ? `Generating (${streamingProgress}%)` : 'Generating...'}
                          </>
                        ) : 'Generate Image'}
                      </button>
                    </div>
                  </div>
                </form>

                <GeneratedImage 
                  imageData={imageData}
                  outputFormat={outputFormat}
                  model={model}
                  transparent={transparent}
                  loading={loading}
                  streamingProgress={streamingProgress}
                  stream={stream}
                />
              </>
            ) : (
              <ImageEditor 
                initialQuality={quality as any}
                initialSize={size}
                initialOutputFormat={outputFormat}
                initialTransparent={transparent}
              />
            )}
          </div>
        </motion.div>

        <motion.div 
          className="mt-12 text-center text-gray-500 dark:text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <p>Powered by OpenAI {model === 'dall-e-3' ? 'DALL-E 3' : 'GPT Image 1'} • No login required • Pay only for what you generate</p>
          
          {/* Limitations section */}
          <div className="mt-6 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg max-w-3xl mx-auto">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Important Limitations</h3>
            <ul className="text-left list-disc list-inside space-y-1">
              <li>Maximum image size: <span className="font-medium">4MB</span> per image</li>
              <li>Supported formats: <span className="font-medium">PNG, JPEG, WebP</span></li>
              <li>Maximum component images for editing: <span className="font-medium">9</span> (plus main image)</li>
              <li>Image editing requires <span className="font-medium">GPT Image 1</span> model</li>
              <li>Transparent background only available with <span className="font-medium">PNG and WebP</span> formats</li>
            </ul>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
