import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  // Map frontend identifiers directly to the actual script filenames in /app/tools/
  const scriptFiles = {
    'vanilla_brute': 'vanilla_brute.py',
    'vanilla_harvester': 'vanilla_harvester.py',
    'stripe_sk_harvester': 'stripe_sk_harvester.py' // Update this string if your actual file has a different name
  };

  const fileName = scriptFiles[toolName];
  const targetScript = path.resolve('/app/tools', fileName || '');

  if (!fileName || !fs.existsSync(targetScript)) {
    return res.status(404).json({ 
      success: false, 
      error: `Script file '${fileName}' not found in /app/tools/` 
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
