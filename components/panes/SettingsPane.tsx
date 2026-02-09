
import React from 'react';
import { AppSettings } from '../../types';
import { Monitor, Type, Info, Languages } from 'lucide-react';

interface SettingsPaneProps {
  settings: AppSettings;
  setSettings: (s: AppSettings) => void;
}

const SettingsPane: React.FC<SettingsPaneProps> = ({ settings, setSettings }) => {
  
  const handleChange = (key: keyof AppSettings, value: any) => {
      setSettings({ ...settings, [key]: value });
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-panel)] text-[var(--fg-primary)] animate-in fade-in duration-300">
      <div className="p-4 border-b border-[var(--border-color)] shrink-0">
         <h2 className="text-xs font-bold uppercase tracking-widest text-[var(--fg-secondary)]">Settings</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
          
          {/* Appearance Section */}
          <section className="space-y-3">
              <div className="flex items-center gap-2 text-blue-400 mb-2">
                  <Monitor size={14} />
                  <span className="text-xs font-bold uppercase">Appearance</span>
              </div>
              
              <div className="space-y-1">
                  <label className="text-xs text-[var(--fg-secondary)]">Color Theme</label>
                  <select 
                    value={settings.themeId}
                    onChange={(e) => handleChange('themeId', e.target.value)}
                    className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--fg-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                      <option value="acode-dark">ACode Dark</option>
                      <option value="dracula">Dracula</option>
                      <option value="monokai">Monokai</option>
                      <option value="github-light">GitHub Light</option>
                      <option value="nord">Nord</option>
                      <option value="solarized-dark">Solarized Dark</option>
                      <option value="cyberpunk">Cyberpunk</option>
                      <option value="midnight-city">Midnight City</option>
                      <option value="synthwave">SynthWave 84</option>
                      <option value="forest">Forest</option>
                  </select>
              </div>

               <div className="space-y-1">
                  <label className="text-xs text-[var(--fg-secondary)]">Language</label>
                  <div className="flex items-center gap-2">
                      <Languages size={14} className="text-[var(--fg-secondary)]" />
                      <select 
                        value={settings.language}
                        onChange={(e) => handleChange('language', e.target.value)}
                        className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--fg-primary)] focus:outline-none focus:border-[var(--accent)]"
                      >
                          <option value="en">English</option>
                          <option value="id">Indonesia</option>
                          <option value="es">Español</option>
                          <option value="jp">日本語</option>
                      </select>
                  </div>
              </div>
          </section>

          <div className="h-px bg-[var(--border-color)]" />

          {/* Editor Section */}
          <section className="space-y-3">
              <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Type size={14} />
                  <span className="text-xs font-bold uppercase">Text Editor</span>
              </div>
              
              <div className="space-y-1">
                  <label className="text-xs text-[var(--fg-secondary)]">Font Size (px)</label>
                  <input 
                    type="number" 
                    value={settings.fontSize}
                    onChange={(e) => handleChange('fontSize', parseInt(e.target.value))}
                    min={10} max={32}
                    className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--fg-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
              </div>

               <div className="space-y-1">
                  <label className="text-xs text-[var(--fg-secondary)]">Tab Size</label>
                  <select 
                    value={settings.tabSize}
                    onChange={(e) => handleChange('tabSize', parseInt(e.target.value))}
                    className="w-full bg-[var(--bg-root)] border border-[var(--border-color)] rounded px-2 py-1.5 text-xs text-[var(--fg-primary)] focus:outline-none focus:border-[var(--accent)]"
                  >
                      <option value={2}>2 Spaces</option>
                      <option value={4}>4 Spaces</option>
                      <option value={8}>8 Spaces</option>
                  </select>
              </div>

               <div className="flex items-center justify-between py-1">
                  <label className="text-xs text-[var(--fg-secondary)]">Word Wrap</label>
                  <button 
                    onClick={() => handleChange('wordWrap', settings.wordWrap === 'on' ? 'off' : 'on')}
                    className={`w-10 h-5 rounded-full relative transition-colors ${settings.wordWrap === 'on' ? 'bg-[var(--accent)]' : 'bg-[var(--bg-activity)] border border-[var(--border-color)]'}`}
                  >
                      <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all shadow-sm ${settings.wordWrap === 'on' ? 'left-6' : 'left-1'}`} />
                  </button>
              </div>
          </section>

          <div className="h-px bg-[var(--border-color)]" />

           {/* Info Section */}
          <section className="space-y-3">
              <div className="flex items-center gap-2 text-purple-400 mb-2">
                  <Info size={14} />
                  <span className="text-xs font-bold uppercase">About</span>
              </div>
              <div className="bg-[var(--bg-root)] p-3 rounded text-[10px] text-[var(--fg-secondary)] border border-[var(--border-color)]">
                  <p className="mb-1"><span className="font-bold text-[var(--fg-primary)]">ACode Web AI</span> v1.1.0</p>
                  <p>A clone of Acode editor with integrated Gemini AI capabilities.</p>
              </div>
          </section>

      </div>
    </div>
  );
};

export default SettingsPane;
