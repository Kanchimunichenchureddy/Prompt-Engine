
import React, { useState } from 'react';
import { PencilIcon } from './icons/PencilIcon';
import { SparklesIcon } from './icons/SparklesIcon';
import { FileUpload } from './FileUpload';

interface PromptFormProps {
  onSubmit: (idea: string, files: File[]) => void;
  isLoading: boolean;
}

const Spinner: React.FC = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

export const PromptForm: React.FC<PromptFormProps> = ({ onSubmit, isLoading }) => {
  const [idea, setIdea] = useState('');
  const [files, setFiles] = useState<File[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (idea.trim() && !isLoading) {
      onSubmit(idea.trim(), files);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="flex-shrink-0 bg-blue-500/10 text-blue-500 dark:bg-blue-500/20 dark:text-blue-400 rounded-lg p-2">
            <PencilIcon className="w-6 h-6" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">1. Describe Your Goal</h2>
      </div>
      <p className="text-gray-500 dark:text-gray-400 mb-6 ml-14">Enter an idea, and optionally upload files for context. Our AI will engineer an optimized prompt for you.</p>
      
      <div className="ml-14">
        <form onSubmit={handleSubmit}>
          <textarea
            value={idea}
            onChange={(e) => setIdea(e.target.value)}
            placeholder="e.g., A function that calculates the Fibonacci sequence in Python"
            className="w-full h-32 p-4 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition duration-200"
            disabled={isLoading}
          />

          <FileUpload onFilesChange={setFiles} disabled={isLoading} />
          
          <button
            type="submit"
            disabled={isLoading || !idea.trim()}
            className="mt-6 w-full flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition duration-200"
          >
            {isLoading ? <><Spinner /> Generating...</> : <><SparklesIcon className="w-5 h-5" /> Generate Prompt</>}
          </button>
        </form>
      </div>
    </div>
  );
};
