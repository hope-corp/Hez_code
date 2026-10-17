  const handleGenerateTool = async (e) => {
    e.preventDefault();
    if (!toolPrompt.trim()) return;

    setLoading(true);
    setOutput(`Generating new tool for: "${toolPrompt}"...`);

    try {
      const res = await fetch('/api/generate-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: toolPrompt })
      });
      const data = await res.json();

      if (data.success) {
        setOutput(data.output);
      } else {
        setOutput(`Error: ${data.error}`);
      }
    } catch (err) {
      setOutput(`Failed to communicate with generator API: ${err.message}`);
    } finally {
      setLoading(false);
      setToolPrompt('');
    }
  };
