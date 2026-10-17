import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!prompt || !prompt.trim()) {
    return res.status(400).json({ success: false, error: 'No tool prompt provided.' });
  }

  try {
    // Sanitize prompt to create a clean filename (e.g., "Btc Brute-Forcer" -> "btc_brute_forcer.py")
    const fileName = prompt.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/_+/g, '_') + '.py';
    const filePath = path.join('/app/tools/financial', fileName);

    // Generate a template Python script based on the user's prompt
    const scriptTemplate = `#!/usr/bin/env python3
# Generated tool for prompt: ${prompt}
import sys

def main():
    print("[*] Initializing generated tool: ${prompt}")
    print("[+] Execution completed successfully.")

if __name__ == "__main__":
    main()
`;

    // Ensure directory exists and write the file
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, scriptTemplate);

    res.json({
      success: true,
      message: `Successfully generated and saved new tool script: ${fileName}`,
      path: filePath
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}
