
import React, { useState, useEffect } from 'react';
import { Prompt, Rating } from '../types';
import { ClipboardIcon } from './icons/ClipboardIcon';
import { CheckIcon } from './icons/CheckIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { HowToUse } from './HowToUse';
import { SparklesIcon } from './icons/SparklesIcon';
import { BeakerIcon } from './icons/BeakerIcon';
import { BookmarkIcon } from './icons/BookmarkIcon';
import { StructuredPrompt } from './StructuredPrompt';
import { PaperClipIcon } from './icons/PaperClipIcon';

interface PromptResultProps {
  prompt: Prompt;
  onRate: (id: string, rating: Rating) => void;
  onTest: (prompt: string) => void;
  testResult: string | null;
  isTesting: boolean;
  onSave: (prompt: Prompt) => void;
  isSaved: boolean;
}

const ActionButton: React.FC<{ onClick: () => void; children: React.ReactNode; className?: string; disabled?: boolean; }> = ({ onClick, children, className = '', disabled=false }) => (
    <button onClick={onClick} disabled={disabled} className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 flex items-center gap-2 ${className}`}>
        {children}
    </button>
);

const TestSpinner: React.FC = () => (
    <div className="flex items-center justify-center space-x-2">
        <div className="w-2 h-2 rounded-full animate-pulse bg-blue-400"></div>
        <div className="w-2 h-2 rounded-full animate-pulse bg-blue-400" style={{animationDelay: '0.2s'}}></div>
        <div className="w-2 h-2 rounded-full animate-pulse bg-blue-400" style={{animationDelay: '0.4s'}}></div>
        <span className="text-gray-500 dark:text-gray-400 ml-2">Getting response...</span>
    </div>
);


export const PromptResult: React.FC<PromptResultProps> = ({ prompt, onRate, onTest, testResult, isTesting, onSave, isSaved }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setCopied(false);
  }, [prompt.id]);

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.generatedPromptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRate = (newRating: Rating) => {
    const finalRating = prompt.rating === newRating ? Rating.None : newRating;
    onRate(prompt.id, finalRating);
  };
  
  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
                <div className="flex-shrink-0 bg-purple-500/10 text-purple-500 dark:bg-purple-500/20 dark:text-purple-400 rounded-lg p-2">
                    <SparklesIcon className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">2. Optimized Prompt</h2>
            </div>
             <button onClick={handleCopy} className="p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-md transition-colors duration-200 flex items-center gap-2 text-sm">
                {copied ? <><CheckIcon className="w-5 h-5 text-green-400" /> Copied!</> : <><ClipboardIcon className="w-5 h-5 text-gray-500 dark:text-gray-400" /> Copy</>}
            </button>
        </div>

        {prompt.contextFiles && prompt.contextFiles.length > 0 && (
            <div className="ml-14 mb-6 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-300">
                    <PaperClipIcon className="w-4 h-4" />
                    <span>Generated with context from {prompt.contextFiles.length} file(s):</span>
                </div>
                 <ul className="text-xs text-gray-500 dark:text-gray-400 mt-2 list-disc pl-5 space-y-1">
                    {prompt.contextFiles.map(file => <li key={file.name}>{file.name}</li>)}
                </ul>
            </div>
        )}

        <div className="relative bg-gray-100 dark:bg-gray-900/50 p-6 rounded-md ml-14">
            <StructuredPrompt content={prompt.generatedPrompt} />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 ml-14">
          <ActionButton onClick={() => onTest(prompt.generatedPromptText)} disabled={isTesting} className="bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-500 dark:disabled:bg-gray-600">
            <BeakerIcon /> Test Prompt
          </ActionButton>
          <ActionButton onClick={() => onSave(prompt)} disabled={isSaved} className="bg-green-600 text-white hover:bg-green-700 disabled:bg-gray-500 dark:disabled:bg-gray-600">
              <BookmarkIcon /> {isSaved ? 'Saved' : 'Save to History'}
          </ActionButton>
          <div className="flex items-center gap-1 ml-auto">
              <ActionButton onClick={() => handleRate(Rating.Up)} className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${prompt.rating === Rating.Up ? 'bg-blue-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-300'}`}>
                  <ThumbsUpIcon />
              </ActionButton>
              <ActionButton onClick={() => handleRate(Rating.Down)} className={`hover:bg-gray-200 dark:hover:bg-gray-700 ${prompt.rating === Rating.Down ? 'bg-red-500 text-white' : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-300'}`}>
                  <ThumbsDownIcon />
              </ActionButton>
          </div>
        </div>
        
        {(isTesting || testResult) && (
          <div className="mt-6">
            <div className="flex items-center gap-3 mb-3">
                <div className="flex-shrink-0 bg-green-500/10 text-green-600 dark:bg-green-500/20 dark:text-green-400 rounded-lg p-2">
                    <BeakerIcon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200">3. Test Result</h3>
            </div>
            <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md border border-gray-200 dark:border-gray-700 ml-14">
              {isTesting ? <TestSpinner /> : <pre className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap text-sm">{testResult}</pre>}
            </div>
          </div>
        )}
      </div>
      <HowToUse />
    </>
  );
};
