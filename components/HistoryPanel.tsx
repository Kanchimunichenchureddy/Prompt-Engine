
import React from 'react';
import { Prompt, Rating } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ThumbsUpIcon } from './icons/ThumbsUpIcon';
import { ThumbsDownIcon } from './icons/ThumbsDownIcon';
import { HistoryIcon } from './icons/HistoryIcon';
import { SearchIcon } from './icons/SearchIcon';
import { EmptyBoxIcon } from './icons/EmptyBoxIcon';
import { PaperClipIcon } from './icons/PaperClipIcon';


interface HistoryPanelProps {
  prompts: Prompt[];
  onSelectPrompt: (id: string) => void;
  onDeletePrompt: (id: string) => void;
  activePromptId: string | null;
  searchTerm: string;
  onSearchTermChange: (term: string) => void;
  activeFilter: Rating | 'All';
  onActiveFilterChange: (filter: Rating | 'All') => void;
}

const FilterButton: React.FC<{
    isActive: boolean;
    onClick: () => void;
    children: React.ReactNode;
}> = ({ isActive, onClick, children }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors flex items-center gap-1.5 ${
            isActive
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
        }`}
    >
        {children}
    </button>
);

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ 
    prompts, 
    onSelectPrompt, 
    onDeletePrompt, 
    activePromptId,
    searchTerm,
    onSearchTermChange,
    activeFilter,
    onActiveFilterChange
}) => {
  return (
    <aside className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full flex flex-col max-h-[calc(100vh-4rem)]">
      <div className="flex items-center gap-3 mb-4">
        <HistoryIcon className="w-7 h-7 text-gray-500 dark:text-gray-400" />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">History</h2>
      </div>
      
      <div className="mb-4 relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="text-gray-400" />
        </div>
        <input 
            type="text"
            placeholder="Search ideas..."
            value={searchTerm}
            onChange={(e) => onSearchTermChange(e.target.value)}
            className="w-full p-2 pl-10 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition"
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <FilterButton isActive={activeFilter === 'All'} onClick={() => onActiveFilterChange('All')}>All</FilterButton>
        <FilterButton isActive={activeFilter === Rating.Up} onClick={() => onActiveFilterChange(Rating.Up)}>
            <ThumbsUpIcon className="w-4 h-4" />
        </FilterButton>
        <FilterButton isActive={activeFilter === Rating.Down} onClick={() => onActiveFilterChange(Rating.Down)}>
            <ThumbsDownIcon className="w-4 h-4" />
        </FilterButton>
      </div>

      {prompts.length === 0 ? (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            <EmptyBoxIcon className="text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">
                {searchTerm || activeFilter !== 'All' ? 'No matching prompts found.' : 'Your saved prompts will appear here.'}
            </p>
             <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                Generate and save a prompt to start your collection.
            </p>
        </div>
      ) : (
        <div className="overflow-y-auto flex-grow -mr-4 pr-4">
          <ul className="space-y-3">
            {prompts.map((prompt) => (
              <li
                key={prompt.id}
                onClick={() => onSelectPrompt(prompt.id)}
                className={`p-3 rounded-md cursor-pointer transition-all duration-200 group relative border-l-4 ${
                  activePromptId === prompt.id 
                  ? 'bg-blue-100 dark:bg-blue-900/50 border-blue-500' 
                  : 'bg-gray-50 dark:bg-gray-700 border-transparent hover:bg-gray-100 dark:hover:bg-gray-600 hover:border-blue-400'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1 overflow-hidden">
                    <div className="flex items-center gap-2">
                      {prompt.contextFiles && prompt.contextFiles.length > 0 && <PaperClipIcon className="w-4 h-4 text-gray-400 flex-shrink-0" />}
                      <p className="font-semibold text-sm truncate text-gray-800 dark:text-white">{prompt.originalIdea}</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {new Date(prompt.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePrompt(prompt.id);
                    }}
                    className="p-1 rounded-full text-gray-400 opacity-0 group-hover:opacity-100 hover:bg-gray-300 dark:hover:bg-gray-500 hover:text-white transition-opacity ml-2"
                    aria-label="Delete prompt"
                  >
                    <TrashIcon />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </aside>
  );
};
