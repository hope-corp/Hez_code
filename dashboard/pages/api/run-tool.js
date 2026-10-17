import { exec } from 'child_process';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  // Explicitly jump out of dashboard/pages/api all the way to root
  const rootDir = path.resolve(process.cwd(), '../../');
  
  const toolPaths = {
    'vanilla_brute': path.join(rootDir, 'tools/vanilla_brute.py'),
    'vanilla_harvester': path.join(rootDir, 'tools/vanilla_harvester.py'),
    'stripe_sk_harvester': path.join(rootDir, 'tools/stripe_sk_harvester.py')
  };

  const targetScript = toolPaths[toolName];

  if (!targetScript) {
    return res.status(400).json({ error: 'Invalid tool selected or path not found.' });
  }

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
