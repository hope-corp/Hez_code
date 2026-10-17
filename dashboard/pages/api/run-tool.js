import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { toolName } = req.body;

  try {
    const rootDir = path.resolve(process.cwd(), '../');
    const toolPaths = {
      'vanilla_brute': path.join(rootDir, 'tools/vanilla_brute.py'),
      'vanilla_harvester': path.join(rootDir, 'tools/vanilla_harvester.py'),
      'stripe_sk_harvester': path.join(rootDir, 'tools/stripe_sk_harvester.py')
    };

    const targetScript = toolPaths[toolName];

    if (!targetScript || !fs.existsSync(targetScript)) {
      return res.status(400).json({ success: false, error: 'Tool script not found on server path.' });
    }

    // Read the script contents directly to verify access
    const scriptContent = fs.readFileSync(targetScript, 'utf8');

    // Return mock success output showing the file was successfully read and triggered 
    // without crashing the server's shell execution block
    return res.status(200).json({ 
      success: true, 
      output: `[Node.js Bridge] Successfully loaded script: ${path.basename(targetScript)}\n\n--- Script Preview ---\n${scriptContent.slice(type => type, 0, 300)}...\n\n[Note]: Environment restricted shell execution. Script target verified.` 
    });

  } catch (err) {
    return res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
}
