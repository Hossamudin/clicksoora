import Link from 'next/link';
import { FiYoutube, FiGlobe, FiGithub, FiHeart } from 'react-icons/fi';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 dark:bg-gray-800 pt-12 pb-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4">ClickSoora</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Free AI Image Generator powered by GPT model. A project by Hossamudin Hassan.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.youtube.com/@ePreneurs" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-500 transition-colors"
              >
                <FiYoutube className="w-5 h-5" />
              </a>
              
              <a 
                href="https://hossamudin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="Website"
                className="text-gray-600 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500 transition-colors"
              >
                <FiGlobe className="w-5 h-5" />
              </a>
              
              <a 
                href="https://github.com/hossamudin/clicksoora" 
                target="_blank" 
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
              >
                <FiGithub className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#top" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="#features" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  Features
                </Link>
              </li>
              <li>
                <Link href="#how-it-works" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="#about" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://github.com/hossamudin/clicksoora" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors"
                >
                  GitHub Repository
                </a>
              </li>
              <li>
                <a 
                  href="https://github.com/hossamudin/clicksoora/issues" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors"
                >
                  Report an Issue
                </a>
              </li>
              <li>
                <a 
                  href="https://openai.com/blog/dall-e/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors"
                >
                  Learn about AI Image Generation
                </a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/license" className="text-gray-600 hover:text-primary-600 dark:text-gray-300 dark:hover:text-primary-500 transition-colors">
                  License
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 mt-8 border-t border-gray-200 dark:border-gray-700 text-center">
          <p className="text-gray-600 dark:text-gray-300 flex items-center justify-center gap-1">
            <span> {currentYear} ClickSoora. Made with</span>
            <FiHeart className="w-4 h-4 text-accent-500" />
            <span>by</span>
            <a 
              href="https://hossamudin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors font-medium"
            >
              Hossamudin Hassan
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
