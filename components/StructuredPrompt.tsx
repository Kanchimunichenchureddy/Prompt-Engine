
import React from 'react';
import { StructuredPromptContent } from '../types';
import { UserCircleIcon } from './icons/UserCircleIcon';
import { ClipboardDocumentListIcon } from './icons/ClipboardDocumentListIcon';
import { NoSymbolIcon } from './icons/NoSymbolIcon';
import { CodeBracketIcon } from './icons/CodeBracketIcon';
import { LightBulbIcon } from './icons/LightBulbIcon';

interface StructuredPromptProps {
  content: StructuredPromptContent;
}

const PromptSection: React.FC<{
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  className?: string;
}> = ({ icon, title, children, className = '' }) => (
  <div className={`flex items-start gap-4 ${className}`}>
    <div className="flex-shrink-0 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg p-2 mt-1">
      {icon}
    </div>
    <div className="flex-1">
      <h4 className="font-bold text-lg text-gray-800 dark:text-gray-200">{title}</h4>
      <div className="prose prose-sm dark:prose-invert text-gray-700 dark:text-gray-300 max-w-none">
          {children}
      </div>
    </div>
  </div>
);

export const StructuredPrompt: React.FC<StructuredPromptProps> = ({ content }) => {
  return (
    <div className="space-y-6">
      {content.persona && (
        <PromptSection icon={<UserCircleIcon className="w-5 h-5" />} title="Persona">
          <p>{content.persona}</p>
        </PromptSection>
      )}
      <PromptSection icon={<ClipboardDocumentListIcon className="w-5 h-5" />} title="Task">
        <p>{content.task}</p>
      </PromptSection>
      {content.constraints && content.constraints.length > 0 && (
        <PromptSection icon={<NoSymbolIcon className="w-5 h-5" />} title="Constraints">
          <ul className="list-disc pl-5">
            {content.constraints.map((item, index) => <li key={index}>{item}</li>)}
          </ul>
        </PromptSection>
      )}
      {content.format && (
        <PromptSection icon={<CodeBracketIcon className="w-5 h-5" />} title="Output Format">
          <p>{content.format}</p>
        </PromptSection>
      )}
      {content.examples && content.examples.length > 0 && (
        <PromptSection icon={<LightBulbIcon className="w-5 h-5" />} title="Examples">
            <ul className="list-disc pl-5">
                {content.examples.map((item, index) => <li key={index}><pre className="whitespace-pre-wrap font-mono text-xs p-2 bg-gray-100 dark:bg-gray-800 rounded-md"><code>{item}</code></pre></li>)}
            </ul>
        </PromptSection>
      )}
    </div>
  );
};
