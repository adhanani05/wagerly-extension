class APIKeyManager {
  static async getAPIKey() {
    let e = await chrome.storage.local.get("openaiApiKey");
    return e.openaiApiKey;
  }
  static async setAPIKey(e) {
    await chrome.storage.local.set({ openaiApiKey: e });
  }
  static async checkAPIKey() {
    let e = await this.getAPIKey();
    return !!e;
  }
  static validateAPIKeyFormat(e) {
    return e.startsWith("sk-") && e.length > 20;
  }
}
document.addEventListener("DOMContentLoaded", async () => {
  let e = document.getElementById("api-key-modal"),
    a = document.getElementById("save-api-key"),
    t = document.getElementById("api-key-input"),
    i = await APIKeyManager.checkAPIKey();
  i || (e.style.display = "flex"),
    a.addEventListener("click", async () => {
      let a = t.value.trim();
      if (!APIKeyManager.validateAPIKeyFormat(a)) {
        alert("Please enter a valid OpenAI API key (should start with sk-)");
        return;
      }
      await APIKeyManager.setAPIKey(a),
        (e.style.display = "none"),
        location.reload();
    });
});
