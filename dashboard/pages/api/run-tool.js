const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  // Map tool names to physical script file paths
  const toolPaths = {
    'stripe_sk_harvester': '/app/tools/financial/stripe_sk_harvester.py',
    // Add other tool path mappings here as needed
  };

  const scriptPath = toolPaths[toolName];
  if (!scriptPath) {
    return res.status(400).json({ success: false, error: 'Invalid tool selected.' });
  }

  exec(`python3 "${scriptPath}"`, (error, stdout, stderr) => {
    let savedKeysContent = '';
    
    // Automatically look for sk_keys.txt in the current directory or tool directory
    const possibleKeyPaths = [
      path.join(process.cwd(), 'sk_keys.txt'),
      path.join('/app/tools/financial', 'sk_keys.txt'),
      path.join(__dirname, 'sk_keys.txt')
    ];

    for (const p of possibleKeyPaths) {
      if (fs.existsSync(p)) {
        try {
          savedKeysContent = fs.readFileSync(p, 'utf8');
          break;
        } catch (e) {
          // ignore read errors and try next
        }
      }
    }

    res.json({
      success: !error,
      output: stdout,
      stderr: stderr,
      savedKeys: savedKeysContent
    });
  });
}
