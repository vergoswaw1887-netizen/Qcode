
import { FileSystemItem, Theme } from './types';

// Start with an empty workspace. 
// The 'root' folder will be automatically created by useFileSystem if this array is empty.
export const INITIAL_FILES: FileSystemItem[] = [];

export const QUICK_KEYS = [
  { label: 'Tab', value: '\t', type: 'char' },
  { label: 'Ctrl', value: 'ctrl', type: 'cmd' },
  { label: 'Alt', value: 'alt', type: 'cmd' },
  { label: 'Esc', value: 'escape', type: 'cmd' },
  { label: '←', value: 'left', type: 'cmd' },
  { label: '↓', value: 'down', type: 'cmd' },
  { label: '↑', value: 'up', type: 'cmd' },
  { label: '→', value: 'right', type: 'cmd' },
  { label: 'End', value: 'end', type: 'cmd' },
  { label: 'Home', value: 'home', type: 'cmd' },
  { label: 'Undo', value: 'undo', type: 'cmd' },
  { label: 'Redo', value: 'redo', type: 'cmd' },
  { label: '{', value: '{', type: 'char' },
  { label: '}', value: '}', type: 'char' },
  { label: '(', value: '(', type: 'char' },
  { label: ')', value: ')', type: 'char' },
  { label: '[', value: '[', type: 'char' },
  { label: ']', value: ']', type: 'char' },
  { label: '<', value: '<', type: 'char' },
  { label: '>', value: '>', type: 'char' },
  { label: '=', value: '=', type: 'char' },
  { label: ';', value: ';', type: 'char' },
  { label: ':', value: ':', type: 'char' },
  { label: '"', value: '"', type: 'char' },
  { label: "'", value: "'", type: 'char' },
  { label: '`', value: '`', type: 'char' },
  { label: '!', value: '!', type: 'char' },
  { label: '$', value: '$', type: 'char' },
  { label: '/', value: '/', type: 'char' },
  { label: '\\', value: '\\', type: 'char' },
];

export const THEMES: Theme[] = [
  {
    id: 'acode-dark',
    name: 'ACode Dark',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#0d1117',
      bgSidebar: '#161b22',
      bgActivity: '#0d1117',
      bgPanel: '#1e2227',
      fgPrimary: '#e2e8f0',
      fgSecondary: '#64748b',
      border: '#30363d',
      accent: '#3b82f6',
      selection: '#1f2937',
      lineHighlight: '#1e293b'
    }
  },
  {
    id: 'dracula',
    name: 'Dracula',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#282a36',
      bgSidebar: '#21222c',
      bgActivity: '#191a21',
      bgPanel: '#282a36',
      fgPrimary: '#f8f8f2',
      fgSecondary: '#6272a4',
      border: '#44475a',
      accent: '#ff79c6',
      selection: '#44475a',
      lineHighlight: '#44475a'
    }
  },
  {
    id: 'monokai',
    name: 'Monokai',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#272822',
      bgSidebar: '#1e1f1c',
      bgActivity: '#171814',
      bgPanel: '#272822',
      fgPrimary: '#f8f8f2',
      fgSecondary: '#75715e',
      border: '#49483e',
      accent: '#a6e22e',
      selection: '#49483e',
      lineHighlight: '#3e3d32'
    }
  },
  {
    id: 'github-light',
    name: 'GitHub Light',
    editorTheme: 'vs-light',
    colors: {
      bgRoot: '#ffffff',
      bgSidebar: '#f6f8fa',
      bgActivity: '#f6f8fa',
      bgPanel: '#ffffff',
      fgPrimary: '#24292f',
      fgSecondary: '#57606a',
      border: '#d0d7de',
      accent: '#0969da',
      selection: '#e6f2ff',
      lineHighlight: '#f1f8ff'
    }
  },
  {
    id: 'nord',
    name: 'Nord',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#2e3440',
      bgSidebar: '#272c36',
      bgActivity: '#242933',
      bgPanel: '#3b4252',
      fgPrimary: '#eceff4',
      fgSecondary: '#d8dee9',
      border: '#434c5e',
      accent: '#88c0d0',
      selection: '#434c5e',
      lineHighlight: '#3b4252'
    }
  },
  {
    id: 'solarized-dark',
    name: 'Solarized Dark',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#002b36',
      bgSidebar: '#073642',
      bgActivity: '#00212b',
      bgPanel: '#073642',
      fgPrimary: '#839496',
      fgSecondary: '#586e75',
      border: '#073642',
      accent: '#2aa198',
      selection: '#073642',
      lineHighlight: '#073642'
    }
  },
  {
    id: 'cyberpunk',
    name: 'Cyberpunk',
    editorTheme: 'hc-black',
    colors: {
      bgRoot: '#0b001a',
      bgSidebar: '#14002e',
      bgActivity: '#05000d',
      bgPanel: '#1a003d',
      fgPrimary: '#00ff9f',
      fgSecondary: '#ff00ff',
      border: '#ff00ff',
      accent: '#00f3ff',
      selection: '#2d0057',
      lineHighlight: '#220042'
    }
  },
  {
    id: 'midnight-city',
    name: 'Midnight City',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#171717',
      bgSidebar: '#262626',
      bgActivity: '#0a0a0a',
      bgPanel: '#1f1f1f',
      fgPrimary: '#e5e5e5',
      fgSecondary: '#a3a3a3',
      border: '#404040',
      accent: '#ef4444',
      selection: '#262626',
      lineHighlight: '#262626'
    }
  },
  {
    id: 'synthwave',
    name: 'SynthWave 84',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#262335',
      bgSidebar: '#241b2f',
      bgActivity: '#191520',
      bgPanel: '#2a2139',
      fgPrimary: '#ff7edb',
      fgSecondary: '#72f1b8',
      border: '#495495',
      accent: '#f97e72',
      selection: '#34294f',
      lineHighlight: '#34294f'
    }
  },
  {
    id: 'forest',
    name: 'Forest',
    editorTheme: 'vs-dark',
    colors: {
      bgRoot: '#1e2925',
      bgSidebar: '#15211b',
      bgActivity: '#0e1713',
      bgPanel: '#26332d',
      fgPrimary: '#e2e8f0',
      fgSecondary: '#86efac',
      border: '#33443c',
      accent: '#22c55e',
      selection: '#2c3e37',
      lineHighlight: '#2c3e37'
    }
  }
];
