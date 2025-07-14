"use client";

import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";

interface Project {
  id: number;
  title: string;
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  estimatedTime: string;
  skills: string[];
  steps: ProjectStep[];
  finalCode: string;
  preview?: string;
}

interface ProjectStep {
  id: number;
  title: string;
  description: string;
  code: string;
  hints: string[];
  isCompleted: boolean;
}

export default function MiniProjects() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [userCode, setUserCode] = useState("");
  const [showHints, setShowHints] = useState(false);
  const [completedProjects, setCompletedProjects] = useState<number[]>([]);

  // Load starter code when project or step changes
  useEffect(() => {
    if (selectedProject?.steps?.[currentStep]?.code) {
      setUserCode(selectedProject.steps[currentStep].code);
    }
  }, [selectedProject, currentStep]);

  const projects: Project[] = [
    {
      id: 1,
      title: "Interactive To-Do List",
      description:
        "Build a dynamic to-do list with add, delete, and mark complete functionality.",
      difficulty: "Beginner",
      category: "DOM Manipulation",
      estimatedTime: "45 minutes",
      skills: ["HTML", "CSS", "JavaScript", "DOM"],
      steps: [
        {
          id: 1,
          title: "Create Basic HTML Structure",
          description:
            "Set up the HTML foundation with input field, button, and list container.",
          code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>To-Do List</title>
    <style>
        /* Add your CSS here */
    </style>
</head>
<body>
    <!-- Create the HTML structure here -->
    
</body>
</html>`,
          hints: [
            "You need an input field for new tasks",
            "Add a button to submit new tasks",
            "Create a container (ul or div) for the task list",
          ],
          isCompleted: false,
        },
        {
          id: 2,
          title: "Style the Interface",
          description:
            "Add CSS to make the to-do list look modern and appealing.",
          code: `/* Add CSS styles here */
body {
    font-family: Arial, sans-serif;
    /* Add more styles */
}

.todo-container {
    /* Style the main container */
}

.todo-input {
    /* Style the input field */
}

.todo-button {
    /* Style the add button */
}

.todo-list {
    /* Style the task list */
}

.todo-item {
    /* Style individual tasks */
}`,
          hints: [
            "Use flexbox or grid for layout",
            "Add padding and margins for spacing",
            "Consider hover effects for buttons",
          ],
          isCompleted: false,
        },
        {
          id: 3,
          title: "Add Task Functionality",
          description: "Implement JavaScript to add new tasks to the list.",
          code: `// JavaScript for adding tasks
function addTask() {
    // Get input value
    
    // Create new task element
    
    // Add to the list
    
    // Clear input
}

// Add event listener to button`,
          hints: [
            "Get the input value using getElementById or querySelector",
            "Create a new list item element",
            "Append the new element to the list container",
          ],
          isCompleted: false,
        },
        {
          id: 4,
          title: "Delete Task Feature",
          description: "Add the ability to delete tasks from the list.",
          code: `// Add delete functionality
function deleteTask(taskElement) {
    // Remove the task from the list
}

// Modify addTask to include delete button
function addTask() {
    // Previous code...
    
    // Add delete button to each task
    const deleteBtn = document.createElement('button');
    // Set up delete button
}`,
          hints: [
            "Add a delete button to each task",
            "Use remove() method to delete elements",
            "Consider using event delegation",
          ],
          isCompleted: false,
        },
        {
          id: 5,
          title: "Mark Complete Feature",
          description:
            "Allow users to mark tasks as completed with visual feedback.",
          code: `// Add complete/incomplete functionality
function toggleComplete(taskElement) {
    // Toggle completed state
}

// Add completed styles
.completed {
    text-decoration: line-through;
    opacity: 0.6;
}`,
          hints: [
            "Add a checkbox or click handler",
            "Toggle a CSS class for completed tasks",
            "Use classList.toggle() method",
          ],
          isCompleted: false,
        },
      ],
      finalCode: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Interactive To-Do List</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: white;
        }
        
        .todo-container {
            background: rgba(255, 255, 255, 0.1);
            padding: 30px;
            border-radius: 15px;
            backdrop-filter: blur(10px);
        }
        
        h1 {
            text-align: center;
            margin-bottom: 30px;
        }
        
        .input-container {
            display: flex;
            margin-bottom: 30px;
            gap: 10px;
        }
        
        .todo-input {
            flex: 1;
            padding: 15px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
        }
        
        .todo-button {
            padding: 15px 25px;
            background: #4CAF50;
            color: white;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-weight: bold;
        }
        
        .todo-list {
            list-style: none;
            padding: 0;
        }
        
        .todo-item {
            background: rgba(255, 255, 255, 0.1);
            margin: 10px 0;
            padding: 15px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .completed {
            text-decoration: line-through;
            opacity: 0.6;
        }
        
        .delete-btn {
            background: #f44336;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 5px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="todo-container">
        <h1>My To-Do List</h1>
        <div class="input-container">
            <input type="text" id="todoInput" class="todo-input" placeholder="Enter a new task...">
            <button onclick="addTask()" class="todo-button">Add Task</button>
        </div>
        <ul id="todoList" class="todo-list"></ul>
    </div>

    <script>
        function addTask() {
            const input = document.getElementById('todoInput');
            const task = input.value.trim();
            
            if (task === '') return;
            
            const li = document.createElement('li');
            li.className = 'todo-item';
            li.innerHTML = \`
                <span onclick="toggleComplete(this)">\${task}</span>
                <button onclick="deleteTask(this)" class="delete-btn">Delete</button>
            \`;
            
            document.getElementById('todoList').appendChild(li);
            input.value = '';
        }
        
        function deleteTask(button) {
            button.parentElement.remove();
        }
        
        function toggleComplete(span) {
            span.classList.toggle('completed');
        }
        
        // Allow Enter key to add tasks
        document.getElementById('todoInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') addTask();
        });
    </script>
</body>
</html>`,
      preview: "A beautiful, interactive to-do list with glassmorphism design",
    },
    {
      id: 2,
      title: "Random Quote Generator",
      description:
        "Create a web app that displays random inspirational quotes with share functionality.",
      difficulty: "Beginner",
      category: "API Integration",
      estimatedTime: "30 minutes",
      skills: ["JavaScript", "Fetch API", "CSS", "DOM"],
      steps: [
        {
          id: 1,
          title: "HTML Structure",
          description: "Create the basic layout for displaying quotes.",
          code: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Random Quote Generator</title>
</head>
<body>
    <!-- Create structure for quote display -->
    
</body>
</html>`,
          hints: [
            "Need a container for the quote text",
            "Add a container for the author",
            "Include a button to get new quotes",
          ],
          isCompleted: false,
        },
        {
          id: 2,
          title: "Quote Data & Logic",
          description: "Add JavaScript to handle quote generation and display.",
          code: `const quotes = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    // Add more quotes here
];

function getRandomQuote() {
    // Get random quote from array
    
    // Display the quote
}`,
          hints: [
            "Create an array of quote objects",
            "Use Math.random() to select quotes",
            "Update DOM elements with new quote",
          ],
          isCompleted: false,
        },
      ],
      finalCode: `<!-- Complete Random Quote Generator -->`,
      preview: "An elegant quote generator with smooth animations",
    },
    {
      id: 3,
      title: "Color Palette Generator",
      description:
        "Build a tool that generates random color palettes for designers.",
      difficulty: "Intermediate",
      category: "Creative Tools",
      estimatedTime: "60 minutes",
      skills: ["JavaScript", "Color Theory", "CSS", "Local Storage"],
      steps: [
        {
          id: 1,
          title: "Color Generation Logic",
          description:
            "Create functions to generate random colors in different formats.",
          code: `// Color generation functions
function generateRandomColor() {
    // Generate random RGB values
    
    // Return color object with different formats
}

function generatePalette(count = 5) {
    // Generate array of colors
}`,
          hints: [
            "Generate RGB values between 0-255",
            "Convert to HEX format",
            "Consider HSL for better color harmony",
          ],
          isCompleted: false,
        },
      ],
      finalCode: `<!-- Complete Color Palette Generator -->`,
      preview: "A professional color palette tool with export functionality",
    },
  ];

  const startProject = (project: Project) => {
    setSelectedProject(project);
    setCurrentStep(0);
    setUserCode(project.steps[0].code);
    setShowHints(false);
  };

  const nextStep = () => {
    if (!selectedProject || currentStep >= selectedProject.steps.length - 1)
      return;

    // Mark current step as completed
    const updatedProject = { ...selectedProject };
    updatedProject.steps[currentStep].isCompleted = true;
    setSelectedProject(updatedProject);

    // Move to next step
    const nextStepIndex = currentStep + 1;
    setCurrentStep(nextStepIndex);
    setUserCode(selectedProject.steps[nextStepIndex].code);
    setShowHints(false);
  };

  const completeProject = () => {
    if (!selectedProject) return;

    setCompletedProjects([...completedProjects, selectedProject.id]);
    setSelectedProject(null);
    setCurrentStep(0);
    setUserCode("");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "text-green-400 bg-green-400/10";
      case "Intermediate":
        return "text-yellow-400 bg-yellow-400/10";
      case "Advanced":
        return "text-red-400 bg-red-400/10";
      default:
        return "text-gray-400 bg-gray-400/10";
    }
  };

  if (!selectedProject) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🚀</div>
          <h3 className="text-2xl font-bold text-white mb-2">Mini Projects</h3>
          <p className="text-gray-400 mb-6">
            Build real-world projects step by step and expand your portfolio
          </p>

          <div className="grid md:grid-cols-3 gap-4 max-w-lg mx-auto mb-8">
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-[#28c7f9]">
                {projects.length}
              </div>
              <div className="text-sm text-gray-400">Projects</div>
            </div>
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-[#8e5ff5]">
                {completedProjects.length}
              </div>
              <div className="text-sm text-gray-400">Completed</div>
            </div>
            <div className="bg-dark-300/40 rounded-lg p-4">
              <div className="text-lg font-bold text-yellow-400">Portfolio</div>
              <div className="text-sm text-gray-400">Building</div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:border-white/20 transition-colors"
            >
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xl font-bold text-white">
                    {project.title}
                  </h4>
                  {completedProjects.includes(project.id) && (
                    <span className="text-green-400 text-2xl">✅</span>
                  )}
                </div>

                <div className="flex items-center space-x-3 mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(
                      project.difficulty
                    )}`}
                  >
                    {project.difficulty}
                  </span>
                  <span className="px-3 py-1 rounded-full text-sm font-medium text-[#28c7f9] bg-[#28c7f9]/10">
                    {project.category}
                  </span>
                  <span className="text-sm text-gray-400">
                    ⏱️ {project.estimatedTime}
                  </span>
                </div>

                <p className="text-gray-400 mb-4">{project.description}</p>

                <div className="mb-4">
                  <div className="text-sm text-gray-400 mb-2">
                    Skills you&apos;ll learn:
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {project.skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-[#8e5ff5]/20 text-[#8e5ff5] rounded text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-sm text-gray-400 mb-4">
                  {project.steps.length} steps • Step-by-step guidance
                </div>
              </div>

              <button
                onClick={() => startProject(project)}
                disabled={completedProjects.includes(project.id)}
                className={`w-full px-6 py-3 rounded-xl text-white font-bold transition-transform ${
                  completedProjects.includes(project.id)
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] hover:scale-105"
                }`}
              >
                {completedProjects.includes(project.id)
                  ? "Completed"
                  : "Start Project"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const currentStepData = selectedProject.steps[currentStep];
  const isLastStep = currentStep === selectedProject.steps.length - 1;

  return (
    <div className="max-w-6xl mx-auto">
      {/* Project Header */}
      <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white mb-1">
              {selectedProject.title}
            </h3>
            <p className="text-gray-400">{selectedProject.description}</p>
          </div>

          <button
            onClick={() => setSelectedProject(null)}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg text-white text-sm transition-colors"
          >
            Exit Project
          </button>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-400">
            Step {currentStep + 1} of {selectedProject.steps.length}
          </div>
          <div className="text-sm font-medium text-[#28c7f9]">
            {Math.round(
              ((currentStep + 1) / selectedProject.steps.length) * 100
            )}
            % Complete
          </div>
        </div>

        <div className="w-full bg-dark-300 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-[#28c7f9] to-[#8e5ff5] h-2 rounded-full transition-all duration-500"
            style={{
              width: `${
                ((currentStep + 1) / selectedProject.steps.length) * 100
              }%`,
            }}
          ></div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Instructions */}
        <div className="space-y-6">
          <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h4 className="text-lg font-bold text-white mb-4">
              {currentStepData.title}
            </h4>
            <p className="text-gray-300 mb-6">{currentStepData.description}</p>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowHints(!showHints)}
                className="px-4 py-2 bg-yellow-500/20 text-yellow-400 rounded-lg hover:bg-yellow-500/30 transition-colors"
              >
                {showHints ? "Hide" : "Show"} Hints (
                {currentStepData.hints.length})
              </button>

              <button
                onClick={isLastStep ? completeProject : nextStep}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-green-400 rounded-lg text-white font-bold hover:scale-105 transition-transform"
              >
                {isLastStep ? "Complete Project" : "Next Step"}
              </button>
            </div>
          </div>

          {/* Hints */}
          {showHints && (
            <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h5 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="text-yellow-400 mr-2">💡</span>
                Hints
              </h5>
              <div className="space-y-3">
                {currentStepData.hints.map((hint, index) => (
                  <div
                    key={index}
                    className="p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20"
                  >
                    <div className="text-sm font-medium text-yellow-400 mb-1">
                      Tip {index + 1}:
                    </div>
                    <div className="text-gray-300">{hint}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Final Preview */}
          {isLastStep && (
            <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl p-6">
              <h5 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="text-green-400 mr-2">🎯</span>
                Final Result
              </h5>
              <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="text-gray-300">{selectedProject.preview}</div>
              </div>
            </div>
          )}
        </div>

        {/* Code Editor */}
        <div className="bg-dark-200/60 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-white/10">
            <h4 className="text-lg font-bold text-white">Code Editor</h4>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-400">
                Step {currentStep + 1}
              </span>
              <button
                onClick={() => setUserCode(currentStepData.code)}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded text-white text-sm transition-colors"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="border border-gray-700 rounded-lg overflow-hidden">
            <Editor
              height="384px"
              defaultLanguage="javascript"
              value={userCode}
              onChange={(value) => setUserCode(value || "")}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: "on",
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                insertSpaces: true,
                wordWrap: "on",
                contextmenu: false,
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
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
