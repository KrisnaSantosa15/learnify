"use client";

import React, { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";

// Custom hook to add dropdown styles
const useDropdownStyles = () => {
  useEffect(() => {
    // Create style element for dropdown options
    const styleElement = document.createElement("style");
    styleElement.textContent = `
      .custom-dropdown option {
        background-color: #1f2937 !important;
        color: white !important;
        border: none !important;
        padding: 8px 12px !important;
      }
      .custom-dropdown option:checked {
        background-color: #3b82f6 !important;
        color: white !important;
      }
      .custom-dropdown option:hover {
        background-color: #374151 !important;
        color: white !important;
      }
      .custom-dropdown:focus option:checked {
        background-color: #3b82f6 !important;
        color: white !important;
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
};

interface CodeEditorProps {
  code: string;
  onChange: (value: string) => void;
  language?: string;
  theme?: string;
  height?: string;
  readOnly?: boolean;
  fontSize?: number;
  onSubmit?: () => void;
  onHint?: () => void;
  hints?: string[];
  hintsUsed?: number;
  isCompleted?: boolean;
  title?: string;
  onLanguageChange?: (language: string) => void;
  availableLanguages?: string[];
  onReset?: () => void;
}

export default function CodeEditor({
  code,
  onChange,
  language = "javascript",
  theme = "vs-dark",
  height = "600px",
  readOnly = false,
  fontSize = 16,
  onSubmit,
  onHint,
  hints = [],
  hintsUsed = 0,
  isCompleted = false,
  title = "Code Editor",
  onLanguageChange,
  availableLanguages = ["javascript", "html", "css", "python"],
  onReset,
}: CodeEditorProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editorFontSize, setEditorFontSize] = useState(fontSize);
  const [editorTheme, setEditorTheme] = useState(theme);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [wordWrap, setWordWrap] = useState(true);

  // Apply custom dropdown styles
  useDropdownStyles();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const editorRef = useRef<any>(null);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEditorDidMount = (editor: any) => {
    editorRef.current = editor;
  };

  const formatCode = () => {
    if (editorRef.current) {
      editorRef.current.getAction("editor.action.formatDocument").run();
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    if (isFullscreen) {
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen]);

  const editorComponent = (
    <div className={`relative ${isFullscreen ? "h-screen" : ""}`}>
      <Editor
        height={isFullscreen ? "calc(100vh - 80px)" : height}
        language={language}
        value={code}
        onChange={(value) => onChange(value || "")}
        theme={editorTheme}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: false },
          fontSize: editorFontSize,
          lineNumbers: showLineNumbers ? "on" : "off",
          roundedSelection: false,
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          insertSpaces: true,
          wordWrap: wordWrap ? "on" : "off",
          contextmenu: true,
          readOnly: readOnly,
          suggestOnTriggerCharacters: true,
          quickSuggestions: {
            other: true,
            comments: true,
            strings: true,
          },
          parameterHints: {
            enabled: true,
          },
          autoIndent: "full",
          formatOnType: true,
          formatOnPaste: true,
          mouseWheelZoom: true,
          folding: true,
          autoClosingBrackets: "always",
          autoClosingQuotes: "always",
          suggestFontSize: editorFontSize,
          suggestLineHeight: Math.floor(editorFontSize * 1.5),
          hover: {
            enabled: true,
            delay: 300,
          },
          padding: {
            top: 20,
            bottom: 20,
          },
          scrollbar: {
            verticalScrollbarSize: 12,
            horizontalScrollbarSize: 12,
          },
        }}
      />

      {/* Success Animation */}
      {isCompleted && (
        <div className="absolute inset-0 bg-green-500/10 backdrop-blur-sm flex items-center justify-center rounded-lg">
          <div className="text-center animate-bounce">
            <div className="text-6xl mb-4">🎉</div>
            <div className="text-2xl font-bold text-green-400">
              Code Completed!
            </div>
            <div className="text-lg text-green-300 mt-2">
              Great job! Your solution is working perfectly.
            </div>
          </div>
        </div>
      )}
    </div>
  );

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-dark-100 z-50 flex flex-col">
        {/* Fullscreen Header */}
        <div className="bg-dark-300/50 backdrop-blur-sm border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
              <span className="text-white font-medium">{title}</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={formatCode}
                className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
              >
                ⚡ Format
              </button>
              <button
                onClick={copyCode}
                className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
              >
                📋 Copy
              </button>
              <button
                onClick={toggleFullscreen}
                className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
              >
                🗗 Exit Fullscreen
              </button>
            </div>
          </div>
        </div>

        {/* Fullscreen Editor */}
        <div className="flex-1">{editorComponent}</div>
      </div>
    );
  }

  return (
    <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-dark-300/50">
        <div className="flex items-center space-x-3">
          <div className="flex space-x-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          <span className="text-gray-400 text-sm font-mono">
            {title.toLowerCase().replace(/\s+/g, "-")}.{language}
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <div className="px-3 py-1 bg-[#28c7f9]/20 text-[#28c7f9] rounded-lg text-sm font-medium">
            {language.toUpperCase()}
          </div>

          {/* Language Selector */}
          {onLanguageChange && (
            <select
              value={language}
              onChange={(e) => onLanguageChange(e.target.value)}
              className="px-3 py-1 bg-dark-300 border border-white/20 text-white rounded-lg text-sm custom-dropdown"
              style={{
                colorScheme: "dark",
                backgroundColor: "#1f2937",
                color: "white",
              }}
            >
              <option
                value="auto"
                style={{ backgroundColor: "#1f2937", color: "white" }}
              >
                Auto
              </option>
              {availableLanguages.map((lang) => (
                <option
                  key={lang}
                  value={lang}
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          )}

          {/* Hint Button */}
          {onHint && (
            <button
              onClick={onHint}
              disabled={hintsUsed >= hints.length || isCompleted}
              className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-lg text-sm hover:bg-yellow-500/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              💡 Hint ({hintsUsed}/{hints.length})
            </button>
          )}

          {/* Reset Button */}
          {onReset && (
            <button
              onClick={onReset}
              className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
            >
              🔄 Reset
            </button>
          )}

          <button
            onClick={formatCode}
            className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg text-sm hover:bg-blue-500/30 transition-colors"
          >
            ⚡ Format
          </button>

          <button
            onClick={copyCode}
            className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
          >
            📋 Copy
          </button>

          <button
            onClick={() => setShowSettings(!showSettings)}
            className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
          >
            ⚙️ Settings
          </button>

          <button
            onClick={toggleFullscreen}
            className="px-3 py-1 bg-gray-600/50 hover:bg-gray-600 rounded-lg text-white text-sm transition-colors"
          >
            🗖 Fullscreen
          </button>

          {onSubmit && (
            <button
              onClick={onSubmit}
              disabled={isCompleted}
              className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-400 rounded-lg text-white font-bold hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🚀 Submit
            </button>
          )}
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="p-4 border-b border-white/10 bg-dark-300/30">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Font Size
              </label>
              <select
                value={editorFontSize}
                onChange={(e) => setEditorFontSize(Number(e.target.value))}
                className="w-full px-3 py-1 bg-dark-300 border border-white/20 text-white rounded-lg text-sm custom-dropdown"
                style={{
                  colorScheme: "dark",
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
              >
                <option
                  value={12}
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  12px
                </option>
                <option
                  value={14}
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  14px
                </option>
                <option
                  value={16}
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  16px
                </option>
                <option
                  value={18}
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  18px
                </option>
                <option
                  value={20}
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  20px
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Theme
              </label>
              <select
                value={editorTheme}
                onChange={(e) => setEditorTheme(e.target.value)}
                className="w-full px-3 py-1 bg-dark-300 border border-white/20 text-white rounded-lg text-sm custom-dropdown"
                style={{
                  colorScheme: "dark",
                  backgroundColor: "#1f2937",
                  color: "white",
                }}
              >
                <option
                  value="vs-dark"
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  Dark
                </option>
                <option
                  value="vs-light"
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  Light
                </option>
                <option
                  value="hc-black"
                  style={{ backgroundColor: "#1f2937", color: "white" }}
                >
                  High Contrast
                </option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Line Numbers
              </label>
              <button
                onClick={() => setShowLineNumbers(!showLineNumbers)}
                className={`w-full px-3 py-1 rounded-lg text-sm transition-colors ${
                  showLineNumbers
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-600/50 text-gray-400"
                }`}
              >
                {showLineNumbers ? "ON" : "OFF"}
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-1">
                Word Wrap
              </label>
              <button
                onClick={() => setWordWrap(!wordWrap)}
                className={`w-full px-3 py-1 rounded-lg text-sm transition-colors ${
                  wordWrap
                    ? "bg-green-500/20 text-green-400"
                    : "bg-gray-600/50 text-gray-400"
                }`}
              >
                {wordWrap ? "ON" : "OFF"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor */}
      <div className="relative">{editorComponent}</div>
    </div>
  );
}
