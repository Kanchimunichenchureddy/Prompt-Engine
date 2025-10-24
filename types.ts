
export enum Rating {
  None,
  Up,
  Down,
}

export interface StructuredPromptContent {
  persona?: string;
  task: string;
  constraints?: string[];
  format?: string;
  examples?: string[];
}

export interface ContextFile {
  name: string;
  type: string;
  size: number;
}

export interface Prompt {
  id: string;
  originalIdea: string;
  generatedPrompt: StructuredPromptContent;
  generatedPromptText: string;
  rating: Rating;
  createdAt: string;
  contextFiles?: ContextFile[];
}
