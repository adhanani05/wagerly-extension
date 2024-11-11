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
      "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";

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
            max_completion_tokens: 600,
            messages: [
              {
                role: "system",
                content: `You are an advanced sports betting analyst AI assistant. Structure all your responses in a clear, organized format with sections and bullet points where appropriate. Keep responses concise but informative. Base your responses on the initial analysis and previous context. Use HTML tags for formatting (<h2> for headers, <p> for paragraphs, <ul>/<li> for lists).`,
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
