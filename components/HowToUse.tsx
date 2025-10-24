import React from 'react';
import { GeminiLogo } from './icons/GeminiLogo';
import { ChatGptLogo } from './icons/ChatGptLogo';
import { ClaudeLogo } from './icons/ClaudeLogo';
import { ExternalLinkIcon } from './icons/ExternalLinkIcon';

const ServiceCard: React.FC<{ name: string; description: string; url: string; logo: React.ReactNode }> = ({ name, description, url, logo }) => (
    <a href={url} target="_blank" rel="noopener noreferrer" className="block p-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-colors group">
        <div className="flex items-center gap-3">
            {logo}
            <h4 className="font-bold text-gray-800 dark:text-gray-200 group-hover:text-blue-500 dark:group-hover:text-blue-400">{name}</h4>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-9">{description}</p>
    </a>
);

export const HowToUse: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 bg-gray-500/10 text-gray-600 dark:bg-gray-500/20 dark:text-gray-400 rounded-lg p-2">
            <ExternalLinkIcon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">4. Where to Use This Prompt</h2>
      </div>
      <p className="text-gray-600 dark:text-gray-400 mb-6 ml-14">
        This optimized prompt can be used with any advanced Large Language Model. Copy the prompt above and paste it into one of the following platforms to get started:
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-14">
        <ServiceCard
          name="Google Gemini"
          description="Paste this prompt directly into the Gemini chat interface for powerful, multimodal responses."
          url="https://gemini.google.com/"
          logo={<GeminiLogo />}
        />
        <ServiceCard
          name="OpenAI ChatGPT"
          description="Use this prompt in the ChatGPT interface to leverage its conversational AI capabilities."
          url="https://chat.openai.com/"
          logo={<ChatGptLogo />}
        />
        <ServiceCard
          name="Anthropic Claude"
          description="Try this prompt with Claude for a different perspective and a focus on helpfulness and safety."
          url="https://claude.ai/"
          logo={<ClaudeLogo />}
        />
         <ServiceCard
          name="Other Platforms"
          description="This prompt is designed to be versatile. Experiment with it on other AI platforms as well!"
          url="#"
          logo={<div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-xs font-mono text-gray-600 dark:text-gray-300">...</div>}
        />
      </div>
    </div>
  );
};