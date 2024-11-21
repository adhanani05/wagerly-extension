// content.js
(() => {
  function isValidSite() {
    const validDomains = ["betmgm.com", "draftkings.com"];
    const currentDomain = window.location.hostname;
    return validDomains.some((domain) => currentDomain.includes(domain));
  }

  async function showInvalidSitePage() {
    try {
      const response = await fetch(chrome.runtime.getURL("invalid-sp.html"));
      const htmlContent = await response.text();
      chrome.runtime.sendMessage(
        { action: "storeData", data: htmlContent },
        () => {
          chrome.runtime.sendMessage({ action: "updateContent" });
        }
      );
    } catch (error) {
      console.error("Error loading invalid site page:", error);
    }
  }

  async function getStoredApiKey() {
    try {
      const result = await chrome.storage.local.get("openaiApiKey");
      return result.openaiApiKey;
    } catch (error) {
      console.error("Error getting API key:", error);
      return null;
    }
  }

  async function analyzeContent(prompt) {
    const apiKey = await getStoredApiKey();

    if (!apiKey) {
      chrome.runtime.sendMessage(
        {
          action: "storeData",
          data: `
          <div class="error-message">
            <h3>API Key Required</h3>
            <p>Please set your OpenAI API key in the extension settings to use this feature.</p>
            <button id="openOptionsButton" class="settings-button">Open Settings</button>
          </div>
        `,
        },
        () => {
          chrome.runtime.sendMessage({ action: "updateContent" });
        }
      );
      return;
    }

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
                content:
                  "You are an advanced sports betting analyst AI assistant. Please provide a highly detailed analysis with concise, high-value insights. Structure the response with the following sections: \n" +
                  "- Public Sentiment: \n<h2><img src='icons/speaking_head_in_silhouette.png' class='analysis-header-icon'> Public Sentiment</h2>\n<ul>\n<li>Analyze underlying biases in public opinion toward star players</li>\n<li>Game momentum or standout plays that may influence betting trends</li></ul>\n" +
                  "- High-Value Bets: \n<h2><img src='icons/fire.png' class='analysis-header-icon'> High-Value Bets</h2>\n<ul>\n<li>Highlight specific betting opportunities with odds</li>\n<li>Include rationale for lesser-known players where value exists</li></ul>\n" +
                  "- Strategic Suggestions: \n<h2><img src='icons/chart_with_upwards_trend.png' class='analysis-header-icon'> Strategic Suggestions</h2>\n<ul>\n<li>Suggest strategies for experienced bettors</li>\n<li>Consider public biases and player prop inefficiencies</li></ul>\n" +
                  "- Key Insights: \n<h2><img src='icons/eyes.png' class='analysis-header-icon'> Key Insights</h2>\n<ul>\n<li>Offer high-level takeaways that capture game dynamics</li>\n<li>Emphasize actionable insights for future bets</li></ul>\n" +
                  "Begin each response with: <h2 style='font-size: 20px; margin-bottom: 1rem;'>Event: [Team1 vs Team2]</h2>",
              },
              { role: "user", content: prompt },
            ],
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      const messageContent = data.choices[0].message.content;
      chrome.runtime.sendMessage(
        { action: "storeData", data: messageContent },
        () => {
          chrome.runtime.sendMessage({ action: "updateContent" });
        }
      );
    } catch (error) {
      console.error("Error:", error);
      const errorMessage = error.message.includes("401")
        ? "Invalid API key. Please check your settings and try again."
        : "Error analyzing content. Please try again later.";

      chrome.runtime.sendMessage(
        {
          action: "storeData",
          data: `<div class="error-message">${errorMessage}</div>`,
        },
        () => {
          chrome.runtime.sendMessage({ action: "updateContent" });
        }
      );
    }
  }

  // Main execution
  if (!isValidSite()) {
    showInvalidSitePage();
    return;
  }

  // Clear any existing data first
  chrome.runtime.sendMessage({ action: "storeData", data: "" }, () => {
    chrome.runtime.sendMessage(
      {
        action: "storeData",
        data: '<div class="cool-loading">Analyzing page content...</div>',
      },
      () => {
        chrome.runtime.sendMessage({ action: "updateContent" });
      }
    );
  });

  let prompt = "";
  let hasFetchedData = false;

  const betmgm_root = document.getElementById("main-view");
  if (betmgm_root) {
    prompt += betmgm_root.innerText + "\n";
  }

  const draftkings_root = document.getElementById("event-page-wrapper");
  if (draftkings_root) {
    prompt += draftkings_root.innerText + "\n";
  }

  if (prompt && !hasFetchedData) {
    hasFetchedData = true;
    analyzeContent(prompt);
  } else {
    console.error("Error: No prompt data found.");
    chrome.runtime.sendMessage(
      {
        action: "storeData",
        data: '<div class="error-message">Unable to find betting content on this page.</div>',
      },
      () => {
        chrome.runtime.sendMessage({ action: "updateContent" });
      }
    );
  }
})();
