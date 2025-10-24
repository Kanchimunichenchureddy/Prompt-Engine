
import { GoogleGenAI, Type } from "@google/genai";
import { StructuredPromptContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const fileToGenerativePart = async (file: File) => {
  const base64EncodedData = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
  return {
    inlineData: {
      data: base64EncodedData,
      mimeType: file.type,
    },
  };
};

const promptSchema = {
    type: Type.OBJECT,
    properties: {
        persona: { type: Type.STRING, description: "The persona the AI should adopt (e.g., 'expert travel guide')." },
        task: { type: Type.STRING, description: "The primary, specific task for the AI to perform." },
        constraints: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of rules or restrictions (e.g., 'Under 200 words')." },
        format: { type: Type.STRING, description: "The desired output format (e.g., 'JSON object with keys: name, ingredients')." },
        examples: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A few examples of desired input/output." },
    },
    required: ["task"],
};


export const generateOptimizedPrompt = async (idea: string, files: File[]): Promise<{ structuredPrompt: StructuredPromptContent, fullPromptText: string }> => {
  try {
    const textPart = { text: `User idea: "${idea}"` };
    const fileParts = await Promise.all(files.map(fileToGenerativePart));

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-pro',
      contents: { parts: [textPart, ...fileParts] },
      config: {
        responseMimeType: "application/json",
        responseSchema: promptSchema,
        systemInstruction: `You are a world-class AI prompt engineer. Your task is to take a user's simple idea, and any provided files (images, text, etc.) as context, and transform it into a highly effective, detailed, and optimized prompt for a large language model.

        Analyze the user's text and all provided files to understand the full context.

        Guidelines:
        1.  **Clarity and Specificity:** The prompt must be unambiguous and provide specific instructions.
        2.  **Context:** Incorporate insights from the provided text and files.
        3.  **Persona:** Define a persona for the AI (e.g., "You are a senior software engineer," "You are a creative storyteller").
        4.  **Format:** Specify the desired output format (e.g., JSON, markdown, a list of bullet points).
        5.  **Constraints:** Add constraints or negative constraints (e.g., "Do not include any personal opinions," "The response must be under 200 words").
        6.  **Examples:** If applicable, provide a brief example of the desired input/output.

        The final output must be a JSON object matching the provided schema.`,
      }
    });

    const structuredPrompt: StructuredPromptContent = JSON.parse(response.text);

    // Reconstruct the full text prompt for display and copying
    let fullPromptText = "";
    if (structuredPrompt.persona) fullPromptText += `**Persona:**\n${structuredPrompt.persona}\n\n`;
    if (structuredPrompt.task) fullPromptText += `**Task:**\n${structuredPrompt.task}\n\n`;
    if (structuredPrompt.constraints?.length) fullPromptText += `**Constraints:**\n- ${structuredPrompt.constraints.join('\n- ')}\n\n`;
    if (structuredPrompt.format) fullPromptText += `**Output Format:**\n${structuredPrompt.format}\n\n`;
    if (structuredPrompt.examples?.length) fullPromptText += `**Examples:**\n- ${structuredPrompt.examples.join('\n- ')}\n\n`;
    
    return { structuredPrompt, fullPromptText: fullPromptText.trim() };

  } catch (error) {
    console.error("Error generating optimized prompt:", error);
    throw new Error("Failed to generate prompt. Please check your API key and try again.");
  }
};

export const testPrompt = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
    });
    return response.text.trim();
  } catch (error) {
    console.error("Error testing prompt:", error);
    throw new Error("Failed to get a test response from the model.");
  }
};
