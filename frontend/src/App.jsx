import React, { useState } from 'react';
import './App.css';

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('python');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const runCode = async () => {
    setLoading(true);
    setOutput('');
    try {
      const res = await fetch('VITE_BACKEND_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ language, code }),
      });

      const result = await res.json();
      setOutput(result?.run?.output || result?.error || "Error running code");
    } catch (err) {
      setOutput("Something went wrong!");
    }
    setLoading(false);
  };

  return (
    <div className="app-container">
      <h1>⚡ Online Code Editor</h1>

      <div className="controls">
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option value="python">Python</option>
          <option value="c">C</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>
        <button onClick={runCode} disabled={loading}>
          {loading ? <span className="spinner"></span> : '▶ Run Code'}
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Write your code here..."
      ></textarea>

      <div className="output-section">
        <h2>🔽 Output:</h2>
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;
