"use client";

import { motion } from 'framer-motion';

interface StepProps {
  number: number;
  title: string;
  description: string;
  delay: number;
}

const Step = ({ number, title, description, delay }: StepProps) => (
  <motion.div
    className="relative"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-100px" }}
  >
    <div className="flex items-start space-x-6">
      <div className="flex-shrink-0">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white font-bold text-lg">
          {number}
        </div>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 dark:text-gray-300">{description}</p>
      </div>
    </div>
  </motion.div>
);

export default function HowItWorks() {
  const steps = [
    {
      number: 1,
      title: "Describe Your Vision",
      description: "Enter a detailed description of the image you want to create. The more specific you are, the better the results will be. The new GPT Image 1, as well as, DALL-E 3 is excellent at following detailed instructions.",
      delay: 0.1
    },
    {
      number: 2,
      title: "Select the Model, and Choose Quality & Size",
      description: "Select between GPT Image 1, and Dalle 3 standard or high-definition quality, and choose from square, landscape, or portrait formats to best suit your needs.",
      delay: 0.2
    },
    {
      number: 3,
      title: "Generate Your Image",
      description: "Click the generate button and watch as DALL-E 3 creates a unique image based on your description. The process takes just seconds.",
      delay: 0.3
    },
    {
      number: 4,
      title: "Download & Share",
      description: "Once generated, download your image in your preferred format and use it for your projects, social media, or creative endeavors.",
      delay: 0.4
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            How <span className="text-blue-500">It Works</span>
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Creating stunning AI images is easy with ClickSoora's DALL-E 3 image generation
          </motion.p>
        </div>

        <div className="max-w-3xl mx-auto space-y-12">
          {steps.map((step, index) => (
            <Step key={index} {...step} />
          ))}
        </div>

        <motion.div 
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <a 
            href="#top"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 text-white font-medium rounded-lg transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try It Now
          </a>
        </motion.div>
      </div>
    </section>
  );
}
