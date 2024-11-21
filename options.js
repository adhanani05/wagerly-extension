document.addEventListener("DOMContentLoaded", async () => {
  let e = await chrome.storage.local.get("openaiApiKey");
  e.openaiApiKey && (document.getElementById("apiKey").value = e.openaiApiKey);
}),
  document.getElementById("save").addEventListener("click", async () => {
    let e = document.getElementById("apiKey").value.trim(),
      t = document.getElementById("status");
    if (!e.startsWith("sk-") || e.length < 20) {
      (t.textContent =
        "Please enter a valid OpenAI API key (should start with sk-)"),
        (t.className = "error");
      return;
    }
    try {
      await chrome.storage.local.set({ openaiApiKey: e }),
        (t.textContent = "Settings saved successfully!"),
        (t.className = "success"),
        setTimeout(() => {
          (t.textContent = ""), (t.className = "");
        }, 3e3);
    } catch (a) {
      (t.textContent = "Error saving settings: " + a.message),
        (t.className = "error");
    }
  });
