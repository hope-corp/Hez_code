// --- Add this at the bottom of src/core/agent.ts ---
if (require.main === module) {
  const taskPrompt = process.argv[2] || "Generate tool";
  
  // Initialize the agent with a default configuration
  const agent = new HezCodeAgent({
    target: "local",
    domain: "financial", // Matches your financial tools domain
    aggressive: true,
    evasion: false,
    undercover: false
  });

  // Execute the task and print the result to stdout so the dashboard captures it
  agent.execute(taskPrompt).then(output => {
    console.log(output);
  }).catch(err => {
    console.error("[Error] Agent execution failed:", err);
  });
}
