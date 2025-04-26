"use client";

import { motion } from 'framer-motion';
import { FiZap, FiLock, FiGlobe, FiDownload, FiEdit, FiImage, FiDollarSign } from 'react-icons/fi';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    className="relative p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 dark:border-gray-700"
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    viewport={{ once: true, margin: "-100px" }}
  >
    <div className="flex items-center space-x-4 mb-4">
      <div className="p-3 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-500">
        {icon}
      </div>
      <h3 className="text-xl font-semibold">{title}</h3>
    </div>
    <p className="text-gray-600 dark:text-gray-300">{description}</p>
  </motion.div>
);

export default function Features() {
  const features = [
    {
      icon: <FiImage className="w-6 h-6" />,
      title: "GPT Image 1 Powered",
      description: "Leverage OpenAI's GPT Image 1 model for highly detailed and creative image generation and editing based on your descriptions.",
      delay: 0.1
    },
    {
      icon: <FiZap className="w-6 h-6" />,
      title: "High Definition",
      description: "Generate stunning high-definition images with incredible detail and clarity for your creative projects.",
      delay: 0.2
    },
    {
      icon: <FiGlobe className="w-6 h-6" />,
      title: "Multiple Sizes",
      description: "Choose from square, landscape, or portrait formats to perfectly fit your needs and use cases.",
      delay: 0.3
    },
    {
      icon: <FiEdit className="w-6 h-6" />,
      title: "Advanced Editing",
      description: "Edit and combine images with AI assistance. Upload your images and transform them with simple text prompts.",
      delay: 0.4
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "Easy Downloads",
      description: "Download your generated images in various formats (JPEG, PNG, WebP) for use in personal or commercial projects.",
      delay: 0.5
    },
    {
      icon: <FiDollarSign className="w-6 h-6" />,
      title: "Cost Transparency",
      description: "See the estimated cost before generating images, with clear pricing based on quality settings.",
      delay: 0.6
    },
    {
      icon: <FiLock className="w-6 h-6" />,
      title: "Privacy First",
      description: "We respect your privacy and don't store your prompts or generated images permanently.",
      delay: 0.7
    },
  ];

  return (
    <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl sm:text-4xl font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            Powerful <span className="text-blue-500">Features</span>
          </motion.h2>
          <motion.p 
            className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Discover what makes ClickSoora the perfect tool for your creative AI image generation needs
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
      </div>
    </section>
  );
}
