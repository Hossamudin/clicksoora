"use client";

import { motion } from 'framer-motion';
import { FiYoutube } from 'react-icons/fi';

export default function Videos() {
  return (
    <section id="videos" className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <span className="text-blue-500">Tutorial</span> Videos
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Learn how to get the best results with AI image generation through these helpful tutorials
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Video Card 1 */}
          <motion.div
            className="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="aspect-w-16 aspect-h-9 relative">
              <iframe 
                className="w-full h-full absolute"
                src="https://www.youtube.com/embed/ZHo1Q870FnM" 
                title="How to use GPT 4o image generation to get the best images with Hossamudin (Arabic)"
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">How to use GPT 4o for Image Generation (Arabic)</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Learn how to get the best results from GPT 4o for image generation with tips and techniques explained in Arabic.
              </p>
              <a 
                href="https://www.youtube.com/watch?v=ZHo1Q870FnM" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
              >
                <FiYoutube className="w-5 h-5 mr-2" />
                Watch on YouTube
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
