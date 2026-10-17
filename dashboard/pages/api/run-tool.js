import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  // Possible locations where your python files might live inside /app
  const possibleDirs = [
    path.resolve('/app/tools'),
    path.resolve('/app/src'),
    path.resolve(process.cwd(), '../tools'),
    path.resolve(process.cwd(), '../src')
  ];

  let targetScript = null;

  // Search for the requested tool file dynamically
  for (const dir of possibleDirs) {
    const filePath = path.join(dir, `${toolName}.py`);
    if (fs.existsSync(filePath)) {
      targetScript = filePath;
      break;
    }
  }

  if (!targetScript) {
    // Debug: list contents of directories to help identify exact paths
    let debugInfo = "Tried paths in: \n" + possibleDirs.join('\n');
    return res.status(404).json({ 
      success: false, 
      error: `Script for '${toolName}' not found.`,
      stderr: debugInfo 
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
