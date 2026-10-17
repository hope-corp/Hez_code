import { exec } from 'child_process';
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

  // Dynamically search the entire container filesystem for the script file
  exec(`find / -name "${fileName}" 2>/dev/null`, (findErr, stdout) => {
    const foundPaths = stdout.trim().split('\n').filter(Boolean);
    const targetScript = foundPaths[0];

    if (!targetScript || !fs.existsSync(targetScript)) {
      return res.status(404).json({ 
        success: false, 
        error: `Could not find '${fileName}' anywhere in the container. Check if a .dockerignore file is excluding your tools/ folder.` 
      });
    }

    // Execute the dynamically located script using python3
    exec(`python3 "${targetScript}"`, (execErr, stdoutExec, stderrExec) => {
      if (execErr) {
        return res.status(500).json({ 
          success: false, 
          error: execErr.message, 
          stderr: stderrExec 
        });
      }

      return res.status(200).json({ 
        success: true, 
        output: stdoutExec || stderrExec 
      });
    });
  });
}
