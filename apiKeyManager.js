// apiKeyManager.js
class APIKeyManager {
  static async getAPIKey() {
    const result = await chrome.storage.local.get("openaiApiKey");
    return result.openaiApiKey;
  }

  static async setAPIKey(apiKey) {
    await chrome.storage.local.set({ openaiApiKey: apiKey });
  }

  static async checkAPIKey() {
    const apiKey = await this.getAPIKey();
    return !!apiKey;
  }

  static validateAPIKeyFormat(apiKey) {
    return apiKey.startsWith("sk-") && apiKey.length > 20;
  }
}

// Set up API key modal functionality
document.addEventListener("DOMContentLoaded", async () => {
  const modal = document.getElementById("api-key-modal");
  const saveButton = document.getElementById("save-api-key");
  const apiKeyInput = document.getElementById("api-key-input");

  const hasApiKey = await APIKeyManager.checkAPIKey();
  if (!hasApiKey) {
    modal.style.display = "flex";
  }

  saveButton.addEventListener("click", async () => {
    const apiKey = apiKeyInput.value.trim();

    if (!APIKeyManager.validateAPIKeyFormat(apiKey)) {
      alert("Please enter a valid OpenAI API key (should start with sk-)");
      return;
    }

    await APIKeyManager.setAPIKey(apiKey);
    modal.style.display = "none";
    location.reload();
  });
});
