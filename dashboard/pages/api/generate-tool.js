import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, error: 'No tool prompt provided.' });
  }

  const coreScriptPath = path.resolve(process.cwd(), '..', 'src', 'core', 'agent.ts');
  const safePrompt = prompt.replace(/"/g, '\\"');
  const command = `npx ts-node "${coreScriptPath}" "${safePrompt}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: stderr || error.message 
      });
    }

    res.json({
      success: true,
      output: stdout || stderr || 'Agent executed successfully.'
    });
  });
}
