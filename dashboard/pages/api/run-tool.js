import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  const scriptFiles = {
    'vanilla_brute': 'vanilla_brute.py',
    'vanilla_harvester': 'vanilla_harvester.py',
    'stripe_sk_harvester': 'stripe_sk_harvester.py'
  };

  const fileName = scriptFiles[toolName];
  
  if (!fileName) {
    return res.status(400).json({ success: false, error: 'Invalid tool selected.' });
  }

  // Since Next.js runs in /app/dashboard, go up one level (../) to find root tools/
  const targetScript = path.resolve(process.cwd(), '../tools', fileName);

  if (!fs.existsSync(targetScript)) {
    return res.authCode?.() || res.status(404).json({ 
      success: false, 
      error: `Script file '${fileName}' not found at: ${targetScript}` 
    });
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
