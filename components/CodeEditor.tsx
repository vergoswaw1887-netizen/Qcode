
import React, { useRef, useEffect } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import QuickKeys from './QuickKeys';
import { Theme } from '../types';

interface CodeEditorProps {
  code: string;
  language: string;
  onChange: (value: string | undefined) => void;
  currentTheme: Theme;
  showQuickKeys: boolean;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ code, language, onChange, currentTheme, showQuickKeys }) => {
  const editorRef = useRef<any>(null);
  const monacoRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    monaco.editor.defineTheme('custom-theme', {
      base: currentTheme.editorTheme as any,
      inherit: true,
      rules: [],
      colors: {
        'editor.background': currentTheme.colors.bgRoot,
        'editor.lineHighlightBackground': currentTheme.colors.lineHighlight,
        'editorCursor.foreground': currentTheme.colors.accent,
        'editor.selectionBackground': currentTheme.colors.selection,
        'editorLineNumber.foreground': currentTheme.colors.fgSecondary,
        'editorLineNumber.activeForeground': currentTheme.colors.fgPrimary,
      }
    });
    monaco.editor.setTheme('custom-theme');

    // JS/TS Diagnostics config
    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });
  };

  useEffect(() => {
    if (monacoRef.current && currentTheme) {
        monacoRef.current.editor.defineTheme('custom-theme', {
            base: currentTheme.editorTheme as any,
            inherit: true,
            rules: [],
            colors: {
                'editor.background': currentTheme.colors.bgRoot,
                'editor.lineHighlightBackground': currentTheme.colors.lineHighlight,
                'editorCursor.foreground': currentTheme.colors.accent,
                'editor.selectionBackground': currentTheme.colors.selection,
                'editorLineNumber.foreground': currentTheme.colors.fgSecondary,
                'editorLineNumber.activeForeground': currentTheme.colors.fgPrimary,
            }
        });
        monacoRef.current.editor.setTheme('custom-theme');
    }
  }, [currentTheme]);

  const handleQuickKeyPress = (value: string, type: 'char' | 'cmd') => {
      if (!editorRef.current) return;
      const editor = editorRef.current;
      editor.focus();

      if (type === 'char') {
          editor.trigger('keyboard', 'type', { text: value });
      } else if (type === 'cmd') {
          switch(value) {
              case 'left': editor.trigger('', 'cursorLeft', {}); break;
              case 'right': editor.trigger('', 'cursorRight', {}); break;
              case 'up': editor.trigger('', 'cursorUp', {}); break;
              case 'down': editor.trigger('', 'cursorDown', {}); break;
              case 'home': editor.trigger('', 'cursorHome', {}); break;
              case 'end': editor.trigger('', 'cursorEnd', {}); break;
              case 'escape': editor.trigger('', 'escape', {}); break;
              case 'undo': editor.trigger('', 'undo', {}); break;
              case 'redo': editor.trigger('', 'redo', {}); break;
          }
      }
  };

  return (
    <div className="h-full w-full flex flex-col overflow-hidden bg-[var(--bg-root)] relative">
      <div className="flex-1 relative">
        <Editor
            height="100%"
            language={language}
            value={code}
            onChange={onChange}
            theme="custom-theme"
            onMount={handleEditorDidMount}
            options={{
                minimap: { enabled: false }, // Disable minimap on mobile to save space
                fontSize: 14,
                fontFamily: "'Fira Code', 'Consolas', monospace",
                fontLigatures: true,
                wordWrap: 'on', // Force word wrap for mobile
                scrollBeyondLastLine: false,
                automaticLayout: true,
                padding: { top: 16, bottom: 16 },
                cursorBlinking: 'smooth',
                smoothScrolling: true,
                renderValidationDecorations: 'on',
                // Mobile optimizations
                formatOnType: true,
                formatOnPaste: true,
                dragAndDrop: true,
                tabSize: 2,
            }}
            loading={<div className="text-[var(--fg-secondary)] text-xs p-4 flex items-center gap-2"><span>Loading Editor...</span></div>}
        />
      </div>
      {/* QuickKeys positioned at bottom */}
      <QuickKeys isVisible={showQuickKeys} onKeyPress={handleQuickKeyPress} />
    </div>
  );
};

export default CodeEditor;
