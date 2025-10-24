
import React, { useState, useEffect, useMemo } from 'react';
import { PromptForm } from './components/PromptForm';
import { PromptResult } from './components/PromptResult';
import { HistoryPanel } from './components/HistoryPanel';
import { ContextFile, Prompt, Rating } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import { generateOptimizedPrompt, testPrompt } from './services/geminiService';
import { MoonIcon } from './components/icons/MoonIcon';
import { SunIcon } from './components/icons/SunIcon';
import { Logo } from './components/icons/Logo';

const App: React.FC = () => {
  const [history, setHistory] = useLocalStorage<Prompt[]>('promptHistory', []);
  const [currentPrompt, setCurrentPrompt] = useState<Prompt | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const [theme, setTheme] = useLocalStorage<'dark' | 'light'>('theme', 'dark');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<Rating | 'All'>('All');


  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const isCurrentPromptSaved = history.some(p => p.id === currentPrompt?.id);

  const filteredHistory = useMemo(() => {
    return history
      .filter(p => {
        if (activeFilter === 'All') return true;
        return p.rating === activeFilter;
      })
      .filter(p => p.originalIdea.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [history, searchTerm, activeFilter]);


  const handleGenerateSubmit = async (idea: string, files: File[]) => {
    setIsLoading(true);
    setError(null);
    setTestResult(null);
    setCurrentPrompt(null);
    try {
      const { structuredPrompt, fullPromptText } = await generateOptimizedPrompt(idea, files);
      const contextFiles: ContextFile[] = files.map(f => ({ name: f.name, type: f.type, size: f.size }));

      const newPrompt: Prompt = {
        id: `prompt_${Date.now()}`,
        originalIdea: idea,
        generatedPrompt: structuredPrompt,
        generatedPromptText: fullPromptText,
        rating: Rating.None,
        createdAt: new Date().toISOString(),
        contextFiles: contextFiles.length > 0 ? contextFiles : undefined,
      };
      setCurrentPrompt(newPrompt);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPrompt = async (promptText: string) => {
    setIsTesting(true);
    setTestResult(null);
    setError(null);
    try {
      const result = await testPrompt(promptText);
      setTestResult(result);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during testing.');
    } finally {
      setIsTesting(false);
    }
  };

  const handleRatePrompt = (id: string, rating: Rating) => {
    const updateInHistory = (prompts: Prompt[]) => prompts.map(p => (p.id === id ? { ...p, rating } : p));
    
    setHistory(updateInHistory);
    
    if (currentPrompt && currentPrompt.id === id) {
      setCurrentPrompt(prev => prev ? { ...prev, rating } : null);
    }
  };

  const handleSavePrompt = (prompt: Prompt) => {
    if (!history.some(p => p.id === prompt.id)) {
        setHistory(prev => [prompt, ...prev]);
    }
  };

  const handleSelectPrompt = (id: string) => {
    const selectedPrompt = history.find(p => p.id === id);
    if (selectedPrompt) {
        setCurrentPrompt(selectedPrompt);
        setTestResult(null); // Clear test result when switching prompts
    }
  };

  const handleDeletePrompt = (id: string) => {
    setHistory(prev => prev.filter(p => p.id !== id));
    if (currentPrompt && currentPrompt.id === id) {
        setCurrentPrompt(null);
        setTestResult(null);
    }
  };


  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="relative flex flex-col items-center justify-center mb-10">
          <div className="flex items-center gap-3">
              <Logo />
              <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                PromptEngine
              </h1>
          </div>
          <p className="mt-2 text-lg text-gray-500 dark:text-gray-400">Your AI-Powered Prompt Optimization Studio</p>
          <button
            onClick={toggleTheme}
            className="absolute top-0 right-0 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-800" />}
          </button>
        </header>

        {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-500 dark:text-red-400 px-4 py-3 rounded-lg relative mb-6" role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <main className="lg:col-span-2 flex flex-col gap-8">
            <PromptForm onSubmit={handleGenerateSubmit} isLoading={isLoading} />
            {currentPrompt && (
              <PromptResult
                prompt={currentPrompt}
                onRate={handleRatePrompt}
                onTest={handleTestPrompt}
                testResult={testResult}
                isTesting={isTesting}
                onSave={handleSavePrompt}
                isSaved={isCurrentPromptSaved}
              />
            )}
            {!isLoading && !currentPrompt && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-10 text-center text-gray-500 dark:text-gray-400">
                <h2 className="text-xl font-medium">Your optimized prompt will appear here.</h2>
                <p>Get started by describing your goal above.</p>
              </div>
            )}
          </main>
          <div className="lg:col-span-1">
            <HistoryPanel
              prompts={filteredHistory}
              onSelectPrompt={handleSelectPrompt}
              onDeletePrompt={handleDeletePrompt}
              activePromptId={currentPrompt?.id ?? null}
              searchTerm={searchTerm}
              onSearchTermChange={setSearchTerm}
              activeFilter={activeFilter}
              onActiveFilterChange={setActiveFilter}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
