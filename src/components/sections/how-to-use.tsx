"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiYoutube } from 'react-icons/fi';

export default function HowToUse() {
  const [activeTab, setActiveTab] = useState<'arabic' | 'english'>('arabic');

  return (
    <section id="how-to-use" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How to Use <span className="text-blue-500">ClickSoora</span>
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Step-by-step tutorials to help you get the most out of ClickSoora
          </motion.p>
        </div>

        {/* Language Tabs */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              type="button"
              onClick={() => setActiveTab('arabic')}
              className={`px-6 py-3 text-sm font-medium rounded-l-lg ${activeTab === 'arabic' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              Arabic
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('english')}
              className={`px-6 py-3 text-sm font-medium rounded-r-lg ${activeTab === 'english' 
                ? 'bg-blue-600 text-white' 
                : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600'}`}
            >
              English
            </button>
          </div>
        </div>

        {/* Content based on active tab */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          {activeTab === 'arabic' ? (
            <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md">
              <div className="aspect-w-16 aspect-h-9 relative">
                <iframe 
                  className="w-full h-full absolute"
                  src="https://www.youtube.com/embed/zzNoASCoHs0" 
                  title="How to Use ClickSoora (Arabic)"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">كيفية استخدام كليك سورة</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  شرح تفصيلي باللغة العربية لكيفية استخدام تطبيق كليك سورة لإنشاء وتعديل الصور باستخدام الذكاء الاصطناعي.
                </p>
                <a 
                  href="https://youtu.be/zzNoASCoHs0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FiYoutube className="w-5 h-5 mr-2" />
                  مشاهدة على يوتيوب
                </a>
              </div>
            </div>
          ) : (
            <div className="bg-white dark:bg-gray-700 rounded-xl overflow-hidden shadow-md">
              <div className="aspect-w-16 aspect-h-9 relative">
                <iframe 
                  className="w-full h-full absolute"
                  src="https://www.youtube.com/embed/1c3LDfLlwM0" 
                  title="How to Use ClickSoora (English)"
                  frameBorder="0" 
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                  allowFullScreen
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">How to Use ClickSoora</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  A detailed English tutorial on how to use ClickSoora for AI image generation and editing. (Coming Soon)
                </p>
                <a 
                  href="https://youtu.be/1c3LDfLlwM0" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-blue-500 hover:text-blue-700 transition-colors"
                >
                  <FiYoutube className="w-5 h-5 mr-2" />
                  Watch on YouTube
                </a>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
