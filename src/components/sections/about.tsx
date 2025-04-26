"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';
import { FiYoutube, FiGlobe, FiCalendar } from 'react-icons/fi';
import Script from 'next/script';
import { useEffect } from 'react';

export default function About() {
  // Function to load TidyCal script dynamically
  useEffect(() => {
    // Check if the script is already loaded
    const existingScript = document.querySelector('script[src="https://asset-tidycal.b-cdn.net/js/embed.js"]');
    if (!existingScript) {
      const script = document.createElement('script');
      script.src = 'https://asset-tidycal.b-cdn.net/js/embed.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return (
    <section id="about" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            About the <span className="text-blue-500">Creator</span>
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="flex flex-col md:flex-row items-center gap-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="w-full md:w-1/3 flex-shrink-0">
              <div className="relative w-48 h-48 mx-auto overflow-hidden rounded-full border-4 border-blue-100 dark:border-blue-900">
                <Image 
                  src="/Hossamudin hassan image.jpg"
                  alt="Hossamudin Hassan"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            <div className="w-full md:w-2/3 text-center md:text-left">
              <h3 className="text-2xl font-bold mb-2">Hossamudin Hassan</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Muslim Egyptian entrepreneur and AI content creator helping Arab audiences learn about AI and make the most out of it. ClickSoora is a free project created to demonstrate the power of AI image generation.
              </p>
              
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <a 
                  href="https://www.youtube.com/@ePreneurs" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                >
                  <FiYoutube className="w-5 h-5" />
                  <span>@ePreneurs</span>
                </a>
                
                <a 
                  href="https://hossamudin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <FiGlobe className="w-5 h-5" />
                  <span>Hossamudin.com</span>
                </a>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl font-bold mb-4 text-center">Let's Talk AI: Get AI Integrated Into Your Business</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6 text-center max-w-2xl mx-auto">
              Ready to leverage AI to transform your business? Book a strategy session with Hossamudin to explore how AI can solve your specific challenges, streamline operations, and create new opportunities for growth.
            </p>
            
            <div className="tidycal-embed" data-path="hossamudin1/ai-strategy-session-15"></div>
          </motion.div>
          
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              This project is open-source and free to use. If you find it useful, consider following Hossamudin for more content about AI and technology.
            </p>
          </motion.div>
        </div>
      </div>
      
      {/* TidyCal Script */}
      <Script src="https://asset-tidycal.b-cdn.net/js/embed.js" strategy="lazyOnload" />
    </section>
  );
}
