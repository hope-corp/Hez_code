import Head from 'next/head'
import { useState } from 'react'

export default function Home() {
  const [output, setOutput] = useState('Select a tool to execute...');
  const [loading, setLoading] = useState(false);

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
        setOutput(data.output || 'Tool executed successfully with no output.');
      } else {
        setOutput(`Error: ${data.error}\n${data.stderr || ''}`);
      }
    } catch (err) {
      setOutput(`Failed to communicate with server: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <Head>
        <title>Hez_code Dashboard</title>
      </Head>
      <main className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Hez_code Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
        </div>

        {/* Real-time Output Terminal */}
        <div className="bg-black border border-gray-700 p-4 rounded-lg font-mono text-sm">
          <div className="text-gray-500 mb-2 border-b border-gray-800 pb-1">Execution Terminal Output:</div>
          <pre className="whitespace-pre-wrap text-green-400">{loading ? 'Running...' : output}</pre>
        </div>
      </main>
    </div>
  );
}
