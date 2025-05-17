// frontend/src/components/CodeEditor.jsx
import { useState, useEffect } from "react";

const languages = ["python", "c", "cpp", "java"];

export default function CodeEditor() {
  const [code, setCode] = useState("print('Hello World!')");  // Default code
  const [language, setLanguage] = useState("python");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [serverStatus, setServerStatus] = useState("Unknown");

  // Check server status on load
  useEffect(() => {
    const checkServer = async () => {
      try {
        const result = await fetch("http://localhost:8000/run", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: "print('test')", language: "python" })
        });
        
        if (result.ok) {
          setServerStatus("Connected");
        } else {
          setServerStatus(`Error: ${result.status}`);
        }
      } catch (error) {
        setServerStatus(`Connection failed: ${error.message}`);
        console.error("Server connection error:", error);
      }
    };
    
    checkServer();
  }, []);

  const runCode = async () => {
    if (!code.trim()) {
      setOutput("Please enter some code first");
      return;
    }
    
    setIsRunning(true);
    setOutput("Running code...");
    
    console.log(`Running ${language} code:`, code);
    
    try {
      const res = await fetch("http://localhost:8000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });
      
      console.log("Response status:", res.status);
      
      if (!res.ok) {
        throw new Error(`Server responded with status: ${res.status}`);
      }
      
      const data = await res.json();
      console.log("Response data:", data);
      
      if (data && typeof data.output === 'string') {
        setOutput(data.output || "No output");
      } else {
        setOutput("Invalid response format from server");
        console.error("Invalid response:", data);
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      console.error("Error running code:", error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="language-select"
          >
            {languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.toUpperCase()}
              </option>
            ))}
          </select>
          <span className="server-status">Server: {serverStatus}</span>
        </div>
        <button 
          onClick={runCode} 
          disabled={isRunning}
          className="run-button"
        >
          {isRunning ? "Running..." : "Run Code"}
        </button>
      </div>
      
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={`Write your ${language} code here...`}
        className="code-textarea"
        spellCheck="false"
      />
      
      <div className="output-container">
        <div className="output-header">Output</div>
        <pre className="output">{output}</pre>
      </div>
    </div>
  );
}