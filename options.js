// options.js
document.addEventListener("DOMContentLoaded", async () => {
  // Restore saved API key
  const result = await chrome.storage.local.get("openaiApiKey");
  if (result.openaiApiKey) {
    document.getElementById("apiKey").value = result.openaiApiKey;
  }
});

document.getElementById("save").addEventListener("click", async () => {
  const apiKey = document.getElementById("apiKey").value.trim();
  const status = document.getElementById("status");

  // Validate API key format
  if (!apiKey.startsWith("sk-") || apiKey.length < 20) {
    status.textContent =
      "Please enter a valid OpenAI API key (should start with sk-)";
    status.className = "error";
    return;
  }

  try {
    await chrome.storage.local.set({ openaiApiKey: apiKey });
    status.textContent = "Settings saved successfully!";
    status.className = "success";
    setTimeout(() => {
      status.textContent = "";
      status.className = "";
    }, 3000);
  } catch (error) {
    status.textContent = "Error saving settings: " + error.message;
    status.className = "error";
  }
});
