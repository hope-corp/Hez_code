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

  // Check all possible locations inside the container environment
  const possiblePaths = [
    path.resolve('/app/tools', fileName),
    path.resolve('/app/Hez_code/tools', fileName),
    path.resolve(process.cwd(), 'tools', fileName),
    path.resolve(process.cwd(), '../tools', fileName)
  ];

  let targetScript = null;
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      targetScript = p;
      break;
    }
  }

  if (!targetScript) {
    let foundFiles = [];
    try {
      const toolsDir = path.resolve('/app/tools');
      if (fs.existsSync(toolsDir)) {
        foundFiles = fs.readdirSync(toolsDir);
      }
    } catch (e) {}

    return res.status(404).json({ 
      success: false, 
      error: `Could not find script file '${fileName}'.`,
      availableFilesInTools: foundFiles,
      searchedPaths: possiblePaths
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
