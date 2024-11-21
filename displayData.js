// displayData.js
document.addEventListener("DOMContentLoaded", async () => {
  const contentDiv = document.getElementById("content");
  let messageHistory = [];

  // Setup chat interface
  function setupChat() {
    const chatContainer = document.createElement("div");
    chatContainer.className = "chat-container";

    const messagesContainer = document.createElement("div");
    messagesContainer.className = "chat-messages";
    messagesContainer.id = "chat-messages";

    const inputContainer = document.createElement("div");
    inputContainer.className = "input-container";

    const input = document.createElement("input");
    input.type = "text";
    input.className = "chat-input";
    input.placeholder = "Ask a question about the analysis...";

    const sendButton = document.createElement("button");
    sendButton.className = "send-button";
    sendButton.textContent = "Send";

    const settingsButton = document.createElement("button");
    settingsButton.className = "settings-button";
    settingsButton.textContent = "⚙️";
    settingsButton.title = "Settings";
    settingsButton.onclick = () => chrome.runtime.openOptionsPage();

    inputContainer.appendChild(input);
    inputContainer.appendChild(sendButton);
    inputContainer.appendChild(settingsButton);

    chatContainer.appendChild(messagesContainer);
    chatContainer.appendChild(inputContainer);
    contentDiv.appendChild(chatContainer);

    setupMessageHandling(messagesContainer, input, sendButton);
    loadInitialContent(messagesContainer);
  }

  async function setupMessageHandling(messagesContainer, input, sendButton) {
    async function handleSendMessage() {
      const message = input.value.trim();
      if (!message) return;

      input.value = "";
      addMessage(messagesContainer, message, "user");

      const apiKey = await chrome.storage.local.get("openaiApiKey");
      if (!apiKey.openaiApiKey) {
        addMessage(
          messagesContainer,
          "Please set your OpenAI API key in the extension settings to continue.",
          "assistant"
        );
        return;
      }

      addLoadingMessage(messagesContainer);
      try {
        const response = await sendToOpenAI(message);
        removeLoadingMessage(messagesContainer);
        addMessage(messagesContainer, response, "assistant");
        messageHistory.push({ role: "assistant", content: response });
      } catch (error) {
        removeLoadingMessage(messagesContainer);
        addMessage(
          messagesContainer,
          "Error processing your request. Please try again.",
          "assistant"
        );
      }
    }

    sendButton.addEventListener("click", handleSendMessage);
    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") handleSendMessage();
    });
  }

  async function sendToOpenAI(userMessage) {
    const apiKey = await chrome.storage.local.get("openaiApiKey");
    if (!apiKey.openaiApiKey) {
      throw new Error("API key not set");
    }

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey.openaiApiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            max_completion_tokens: 150,
            messages: [
              {
                role: "system",
                content:
                  "You are an advanced sports betting analyst AI assistant. Provide a concise, high-value response. Do not use asteriks or any special characters in your response.",
              },
              ...messageHistory,
              { role: "user", content: userMessage },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      throw error;
    }
  }

  function addMessage(container, message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message`;
    messageDiv.innerHTML = message;
    container.appendChild(messageDiv);
    container.scrollTop = container.scrollHeight;

    if (type === "user") {
      messageHistory.push({ role: "user", content: message });
    }
  }

  function addLoadingMessage(container) {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "message loading";
    loadingDiv.innerHTML = '<div class="loading-spinner"></div>';
    loadingDiv.id = "loading-message";
    container.appendChild(loadingDiv);
    container.scrollTop = container.scrollHeight;
  }

  function removeLoadingMessage(container) {
    const loadingMessage = container.querySelector("#loading-message");
    if (loadingMessage) {
      loadingMessage.remove();
    }
  }

  async function loadInitialContent(container) {
    // Clear existing messages first
    container.innerHTML = "";
    messageHistory = []; // Reset message history

    chrome.runtime.sendMessage({ action: "getData" }, (response) => {
      if (response && response.data) {
        // Add the system message to message history
        messageHistory.push({
          role: "system",
          content:
            "You are an advanced sports betting analyst AI assistant. Provide a concise, high-value response. Do not use asteriks or any special characters in your response.",
        });

        // Add the initial analysis as an assistant message
        messageHistory.push({
          role: "assistant",
          content: response.data,
        });

        addMessage(container, response.data, "analysis");
      }
    });
  }

  // Initialize the chat interface
  setupChat();

  // Listen for content updates
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "refreshContent") {
      const messagesContainer = document.getElementById("chat-messages");
      if (messagesContainer) {
        loadInitialContent(messagesContainer);
      }
    }
  });
});
