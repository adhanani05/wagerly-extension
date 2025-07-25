// displayData.js

document.addEventListener("DOMContentLoaded", () => {
  const contentDiv = document.getElementById("content");
  let messageHistory = [];

  // Create chat container structure
  const chatContainer = document.createElement("div");
  chatContainer.className = "chat-container";

  const messagesContainer = document.createElement("div");
  messagesContainer.className = "chat-messages";

  const inputContainer = document.createElement("div");
  inputContainer.className = "input-container";

  const input = document.createElement("input");
  input.type = "text";
  input.className = "chat-input";
  input.placeholder = "Ask a question about the analysis...";

  const sendButton = document.createElement("button");
  sendButton.className = "send-button";
  sendButton.textContent = "Send";

  inputContainer.appendChild(input);
  inputContainer.appendChild(sendButton);

  chatContainer.appendChild(messagesContainer);
  chatContainer.appendChild(inputContainer);

  contentDiv.appendChild(chatContainer);

  // Function to add a message to the chat
  function addMessage(content, isUser = false, isInitialAnalysis = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${
      isUser
        ? "user-message"
        : isInitialAnalysis
        ? "analysis-message"
        : "assistant-message"
    }`;

    if (isInitialAnalysis) {
      content = content.replace(
        /<h2>Public Sentiment:<\/h2>/g,
        '<h2><span class="analysis-header-icon-1"></span>Public Sentiment:</h2>'
      );
      content = content.replace(
        /<h2>High-Value Bets:<\/h2>/g,
        '<h2><span class="analysis-header-icon-2"></span>High-Value Bets:</h2>'
      );
      content = content.replace(
        /<h2>Strategic Suggestions:<\/h2>/g,
        '<h2><span class="analysis-header-icon-3"></span>Strategic Suggestions:</h2>'
      );
      content = content.replace(
        /<h2>Key Insights:<\/h2>/g,
        '<h2><span class="analysis-header-icon-4"></span>Key Insights:</h2>'
      );
    }

    messageDiv.innerHTML = content;
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    // Add message to history
    messageHistory.push({
      role: isUser ? "user" : "assistant",
      content: content,
    });
  }

  // Show loading spinner
  function showLoading() {
    const loadingDiv = document.createElement("div");
    loadingDiv.className = "loading";
    const spinner = document.createElement("div");
    spinner.className = "loading-spinner";
    loadingDiv.appendChild(spinner);
    messagesContainer.appendChild(loadingDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    return loadingDiv;
  }

  // Function to send message to OpenAI API
  async function sendToOpenAI(userMessage) {
    const apiKey =
      "your-api-key";

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
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
              {
                role: "user",
                content: userMessage,
              },
            ],
          }),
        }
      );

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error("Error:", error);
      return "Sorry, I encountered an error while processing your request. Please try again.";
    }
  }

  // Handle sending messages
  async function handleSend() {
    const text = input.value.trim();
    if (!text) return;

    addMessage(text, true);
    input.value = "";

    const loadingDiv = showLoading();

    // Get response from OpenAI
    const response = await sendToOpenAI(text);
    loadingDiv.remove();
    addMessage(response);
  }

  // Event listeners
  sendButton.addEventListener("click", handleSend);
  input.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  });

  // Listen for initial data and updates
  chrome.runtime.sendMessage({ action: "getData" }, (response) => {
    if (response && response.data) {
      addMessage(response.data, false, true); // Mark as initial analysis
    }
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "refreshContent") {
      chrome.runtime.sendMessage({ action: "getData" }, (response) => {
        if (response && response.data) {
          // Clear existing messages and history
          messagesContainer.innerHTML = "";
          messageHistory = [];
          // Add new analysis
          addMessage(response.data, false, true); // Mark as initial analysis
        }
      });
    }
  });
});
