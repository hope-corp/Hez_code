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

  // Path to your main TypeScript execution entry point inside src/core
  // (e.g., src/core/generator.ts or src/core/index.ts)
  const coreScriptPath = path.join(process.cwd(), 'src', 'core', 'generator.ts');

  // Command to run the TS file using ts-node or node depending on build environment
  const command = `npx ts-node "${coreScriptPath}" "${prompt.replace(/"/g, '\\"')}"`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: stderr || error.message 
      });
    }

    res.json({
      success: true,
      message: 'Core generator executed successfully.',
      output: stdout
    });
  });
}
