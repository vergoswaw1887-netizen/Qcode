
import { GoogleGenAI, Chat, Type } from "@google/genai";
import { GeneratedFile } from "../types";

const SYSTEM_INSTRUCTION = `You are an Elite Universal Software Architect & Senior Principal Engineer embedded within "ACode AI Mobile".

YOUR EXPERTISE:
1. **Web**: React, TypeScript, Tailwind, Node.js, Vue, Svelte, HTML/CSS.
2. **Systems**: C++, Rust, Go (Golang), C, Assembly.
3. **Data/AI**: Python (Pandas, PyTorch, TensorFlow), R, Julia.
4. **Mobile**: React Native, Flutter (Dart), Swift, Kotlin, Java.
5. **Game Dev**: Lua (Roblox), C# (Unity), GDScript (Godot).
6. **DevOps**: Docker, Kubernetes, Terraform, Bash/Shell scripting.

RULES FOR CODE GENERATION:
1. **Real-Time File System Access**: You are creating files directly in the user's IDE.
2. **Structure**: When asked to create an app, game, or system, ALWAYS provide the full folder structure.
   - For Python: Include 'main.py', 'requirements.txt', 'venv/'.
   - For Go: Include 'main.go', 'go.mod'.
   - For Rust: Include 'src/main.rs', 'Cargo.toml'.
   - For C++: Include 'main.cpp', 'CMakeLists.txt'.
3. **Refactoring/Editing**: If the user asks to "Change", "Fix", "Update", or "Refactor" an existing file, you MUST regenerate the FULL content of that file so it updates correctly in the editor.
4. **Professional Standards**: Use clean architecture, proper error handling, and comments.

BEHAVIOR:
- Be concise. Don't explain basic imports unless asked.
- If asked for a "User Profile Card", generate the component file AND a usage example.
`;

let chatSession: Chat | null = null;
let aiInstance: GoogleGenAI | null = null;

const getAI = (): GoogleGenAI => {
  if (!aiInstance) {
    aiInstance = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }
  return aiInstance;
};

export const initializeChat = () => {
  const ai = getAI();
  chatSession = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    }
  });
};

export const sendMessageToGemini = async (
  message: string, 
  currentFileContext?: { name: string; content: string }
): Promise<string> => {
  if (!chatSession) initializeChat();
  if (!chatSession) throw new Error("Failed to initialize chat session.");

  let fullMessage = message;
  if (currentFileContext) {
    fullMessage = `CONTEXT: You are looking at the file "${currentFileContext.name}".\n\nCONTENT:\n\`\`\`\n${currentFileContext.content}\n\`\`\`\n\nUSER REQUEST: ${message}`;
  }

  try {
    const response = await chatSession.sendMessage({ message: fullMessage });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error processing request. Check network or API key.";
  }
};

export const explainCode = async (code: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Explain this code concisely for a developer:\n\n\`\`\`\n${code}\n\`\`\``,
    });
    return response.text || "No explanation available.";
  } catch (error) {
    console.error("Explain Code Error:", error);
    return "Failed to generate explanation.";
  }
};

export const analyzeCodeForErrors = async (code: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Analyze for bugs, syntax errors, and security flaws. Return a Markdown report.\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
        });
        return response.text || "No errors found.";
    } catch (error) {
        return "Failed to analyze code.";
    }
};

export const reviewCode = async (code: string, fileName: string = 'Snippet'): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Review "${fileName}". Focus on: Security, Performance, Style, and Logic.\n\nCode:\n\`\`\`\n${code}\n\`\`\``,
    });
    return response.text || "No review generated.";
  } catch (error) {
    return "Failed to review code.";
  }
};

export const enhancePrompt = async (simpleInput: string): Promise<string> => {
    const ai = getAI();
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: `Improve this prompt for an LLM to generate high-quality code. Add details about stack, modern practices, and error handling.\n\nInput: "${simpleInput}"\n\nReturn ONLY the improved prompt string.`,
        });
        return response.text || simpleInput;
    } catch (error) {
        return simpleInput;
    }
};

// -- UNIVERSAL CODE GENERATOR --
// Handles both creating NEW projects and UPDATING existing files
export const generateProjectStructure = async (prompt: string, activeContext?: { name: string; content: string }): Promise<{ files: GeneratedFile[], description: string }> => {
  const ai = getAI();
  
  let fullPrompt = `
  TASK: Generate/Update code files based on: "${prompt}".
  
  MODE: Universal Code Generator (Web, Python, Go, C++, Rust, System, Game Dev).
  
  INSTRUCTIONS:
  1. Return a JSON object with a 'files' array.
  2. If the user asks to UPDATE/FIX a file, return the FULL updated content of that file with the SAME path.
  3. If creating a new project, provide all necessary config files (e.g., package.json, go.mod, requirements.txt, Cargo.toml).
  `;

  if (activeContext) {
      fullPrompt += `\n\nCONTEXT (Active File): The user is currently editing "${activeContext.name}". \nContent:\n${activeContext.content}\n\nIf the request relates to this file, include it in the 'files' array with updated content.`;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            files: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  path: { type: Type.STRING, description: "Relative file path (e.g., src/main.rs, app.py, components/User.tsx)" },
                  content: { type: Type.STRING, description: "Full source code content" },
                  language: { type: Type.STRING, description: "Language ID (typescript, python, go, rust, cpp, etc.)" }
                },
                required: ["path", "content"]
              }
            },
            description: {
              type: Type.STRING,
              description: "Brief summary of changes or structure"
            }
          },
          required: ["files", "description"]
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text);
    }
    throw new Error("No text returned from Gemini");
    
  } catch (error) {
    console.error("Gemini Project Generation Error:", error);
    return {
        files: [],
        description: `Failed to generate code. \n\nError: ${(error as Error).message}`
    };
  }
};
