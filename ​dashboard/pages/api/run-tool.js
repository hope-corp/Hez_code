import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  // Map requested tools to their actual file paths relative to the root project
  const toolPaths = {
    'vanilla_brute': path.join(process.cwd(), '../tools/vanilla_brute.py'),
    'vanilla_harvester': path.join(process.cwd(), '../tools/vanilla_harvester.py'),
    'stripe_sk_harvester': path.join(process.cwd(), '../tools/stripe_sk_harvester.py')
  };

  const targetScript = toolPaths[toolName];

  if (!targetScript) {
    return res.status(400).json({ error: 'Invalid tool selected or path not found.' });
  }

  // Execute the Python script (adjust command to 'ts-node' if running typescript files directly)
  exec(`python3 "${targetScript}"`, (error, stdout, stderr) => {
    if (error) {
      return res.status(500).json({ 
        success: false, 
        error: error.message, 
        stderr: stderr 
      });
    }

    return res.status(200).json({ 
      success: true, 
      output: stdout || stderr 
    });
  });
}
