
import { useState, useMemo } from 'react';
import { FileSystemItem, FileType, GeneratedFile } from '../types';
import { INITIAL_FILES } from '../constants';

// Templates for new files
const TEMPLATES: Record<string, string> = {
  html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Project</title>
    <style>
      body { font-family: sans-serif; padding: 20px; background: #f0f0f0; }
    </style>
</head>
<body>
    <h1>Hello World</h1>
    <script>
      console.log("App started");
    </script>
</body>
</html>`,
  css: `body {
    margin: 0;
    padding: 0;
    font-family: system-ui, -apple-system, sans-serif;
}`,
  js: `console.log('Hello from JavaScript!');`,
  ts: `const greeting: string = 'Hello TypeScript';\nconsole.log(greeting);`,
  json: `{\n  "name": "project",\n  "version": "1.0.0"\n}`,
  jsx: `import React from 'react';\n\nexport default function App() {\n  return <h1>Hello React</h1>;\n}`,
  tsx: `import React from 'react';\n\nexport default function App() {\n  return <h1>Hello React TS</h1>;\n}`,
  // -- POLYGLOT TEMPLATES --
  py: `# Python Script\ndef main():\n    print("Hello from Python!")\n\nif __name__ == "__main__":\n    main()`,
  go: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello from Go!")\n}`,
  rs: `fn main() {\n    println!("Hello from Rust!");\n}`,
  java: `public class Main {\n    public static void main(String[] args) {\n        System.out.println("Hello from Java!");\n    }\n}`,
  cpp: `#include <iostream>\n\nint main() {\n    std::cout << "Hello from C++!" << std::endl;\n    return 0;\n}`,
  c: `#include <stdio.h>\n\nint main() {\n    printf("Hello from C!\\n");\n    return 0;\n}`,
  php: `<?php\n\necho "Hello from PHP!";\n?>`,
  dart: `void main() {\n  print('Hello from Dart!');\n}`,
  lua: `print("Hello from Lua!")`
};

export const useFileSystem = () => {
  // Initialize state once. Ensure a Root folder always exists.
  const [files, setFiles] = useState<FileSystemItem[]>(() => {
    // Ensure INITIAL_FILES is an array
    const safeInitial = Array.isArray(INITIAL_FILES) ? INITIAL_FILES : [];
    const hasRoot = safeInitial.some(f => f.id === 'root');
    // If no initial files, start with just the root folder. 
    if (!hasRoot) {
      return [{ id: 'root', name: 'TERMINAL HOME', type: FileType.FOLDER, parentId: null, isOpen: true }, ...safeInitial];
    }
    return [...safeInitial];
  });
  
  const [activeFileId, setActiveFileId] = useState<string | null>(null);

  const activeFile = useMemo(() => 
    Array.isArray(files) ? files.find(f => f.id === activeFileId) : undefined, 
    [files, activeFileId]
  );

  const toggleFolder = (folderId: string) => {
    setFiles(prev => prev.map(f => 
      f.id === folderId ? { ...f, isOpen: !f.isOpen } : f
    ));
  };

  const updateFileContent = (newContent: string | undefined) => {
    if (!activeFileId || newContent === undefined) return;
    setFiles(prev => prev.map(f => 
      f.id === activeFileId ? { ...f, content: newContent, isModified: true } : f
    ));
  };

  const checkDuplicate = (parentId: string, name: string) => {
      if (!Array.isArray(files)) return false;
      return files.some(f => {
          const fileParent = f.parentId || 'root';
          const targetParent = parentId || 'root';
          return fileParent === targetParent && f.name.toLowerCase() === name.toLowerCase();
      });
  };

  const addFile = (parentId: string | null, name: string): string | null => {
    if (!name) return null;
    const targetParentId = parentId || 'root';

    if (checkDuplicate(targetParentId, name)) return null;
    
    const ext = name.split('.').pop()?.toLowerCase() || '';
    const initialContent = TEMPLATES[ext] || '';

    const newFile: FileSystemItem = {
      id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name,
      type: FileType.FILE,
      parentId: targetParentId,
      content: initialContent,
      language: ext || 'text',
      isModified: true,
      history: []
    };
    
    setFiles(prev => {
      const next = prev.map(f => f.id === targetParentId ? { ...f, isOpen: true } : f);
      return [...next, newFile];
    });
    
    setActiveFileId(newFile.id);
    return name;
  };

  const addFolder = (parentId: string | null, name: string): string | null => {
    if (!name) return null;
    const targetParentId = parentId || 'root';
    
    if (name.includes('.') && name.split('.').length > 1) {
        return null;
    }

    if (checkDuplicate(targetParentId, name)) return null;

    const newFolder: FileSystemItem = {
      id: `folder-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: name,
      type: FileType.FOLDER,
      parentId: targetParentId,
      isOpen: true
    };
    
    setFiles(prev => {
      const next = prev.map(f => f.id === targetParentId ? { ...f, isOpen: true } : f);
      return [...next, newFolder];
    });
    return name;
  };

  const renameItem = (id: string, newName: string): boolean => {
    if (id === 'root') return false;
    const item = files.find(f => f.id === id);
    if (!item) return false;
    if (newName === item.name) return true;
    
    const parentId = item.parentId || 'root';
    if (checkDuplicate(parentId, newName)) {
        return false;
    }
    
    setFiles(prev => prev.map(f => f.id === id ? { ...f, name: newName } : f));
    return true;
  };

  const deleteItem = (id: string) => {
    if (id === 'root') return;
    
    const getDescendants = (parentId: string): string[] => {
      const children = files.filter(f => f.parentId === parentId);
      let ids = children.map(c => c.id);
      children.forEach(c => {
        ids = [...ids, ...getDescendants(c.id)];
      });
      return ids;
    };

    const idsToDelete = [id, ...getDescendants(id)];
    setFiles(prev => prev.filter(f => !idsToDelete.includes(f.id)));
    
    if (activeFileId && idsToDelete.includes(activeFileId)) {
      setActiveFileId(null);
    }
  };

  const resetWorkspace = () => {
    setFiles([{ id: 'root', name: 'TERMINAL HOME', type: FileType.FOLDER, parentId: null, isOpen: true }]);
    setActiveFileId(null);
  };

  const mergeGeneratedFiles = (generatedFiles: GeneratedFile[]) => {
    setFiles(prev => {
        let newFileSystem = [...prev];
        if (!newFileSystem.find(f => f.id === 'root')) {
          newFileSystem.push({ id: 'root', name: 'TERMINAL HOME', type: FileType.FOLDER, parentId: null, isOpen: true });
        }

        generatedFiles.forEach(file => {
            const cleanPath = file.path.replace(/^\.\//, '');
            const parts = cleanPath.split('/');
            const fileName = parts.pop()!;
            let currentParentId = 'root';

            // Ensure directory structure exists
            parts.forEach((part) => {
                const existingFolder = newFileSystem.find(f => 
                    f.name === part && f.type === FileType.FOLDER && (f.parentId || 'root') === currentParentId
                );

                if (existingFolder) {
                    currentParentId = existingFolder.id;
                } else {
                    const newFolderId = `folder-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
                    newFileSystem.push({
                        id: newFolderId, name: part, type: FileType.FOLDER, parentId: currentParentId, isOpen: true
                    });
                    currentParentId = newFolderId;
                }
            });

            // Check if file exists to UPDATE it, otherwise CREATE it
            const existingFileIndex = newFileSystem.findIndex(f => 
                f.name === fileName && f.type === FileType.FILE && (f.parentId || 'root') === currentParentId
            );

            const language = file.language || fileName.split('.').pop() || 'text';

            if (existingFileIndex !== -1) {
                // UPDATE existing file (Core requirement: changes reflect immediately)
                newFileSystem[existingFileIndex] = {
                    ...newFileSystem[existingFileIndex],
                    content: file.content,
                    language: language,
                    isModified: true
                };
            } else {
                // CREATE new file
                newFileSystem.push({
                    id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
                    name: fileName, type: FileType.FILE, parentId: currentParentId,
                    content: file.content, 
                    language: language,
                    isModified: true, history: []
                });
            }
        });
        return newFileSystem;
    });
  };

  const setAllFilesUnmodified = () => {
    setFiles(prev => prev.map(f => ({ ...f, isModified: false })));
  };

  return {
    files,
    activeFile,
    activeFileId,
    setActiveFileId,
    toggleFolder,
    updateFileContent,
    addFile,
    addFolder,
    renameItem,
    deleteItem,
    resetWorkspace,
    mergeGeneratedFiles,
    setAllFilesUnmodified
  };
};
