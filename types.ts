
export enum FileType {
  FILE = 'FILE',
  FOLDER = 'FOLDER'
}

export interface FileSystemItem {
  id: string;
  name: string;
  type: FileType;
  content?: string; // Only for files
  language?: string; // Only for files
  parentId: string | null;
  isOpen?: boolean; // For folders
  isModified?: boolean; // For Git simulation
  history?: string[]; // Stack of previous content versions
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface TerminalLog {
  type: 'info' | 'error' | 'success';
  message: string;
  timestamp: number;
}

export interface Theme {
  id: string;
  name: string;
  colors: {
    bgRoot: string;      // Main background (editor)
    bgSidebar: string;   // Sidebar/Header background
    bgActivity: string;  // Activity bar background
    bgPanel: string;     // Panels/Modals
    fgPrimary: string;   // Main text
    fgSecondary: string; // Muted text
    border: string;      // Borders
    accent: string;      // Primary action color
    selection: string;   // Selection background
    lineHighlight: string;
  };
  editorTheme: string; // Mapping to Monaco theme
}

export interface AppSettings {
  fontSize: number;
  wordWrap: 'on' | 'off';
  themeId: string; // Changed from 'theme' to 'themeId' to support custom themes
  tabSize: number;
  language: string;
  showQuickKeys: boolean;
}

export interface GeneratedFile {
  path: string;
  content: string;
  language?: string;
}
