(() => {
  function e() {
    let e = window.location.hostname;
    return ["betmgm.com", "draftkings.com"].some((t) => e.includes(t));
  }
  async function t() {
    try {
      let e = await fetch(chrome.runtime.getURL("invalid-sp.html")),
        t = await e.text();
      chrome.runtime.sendMessage({ action: "storeData", data: t }, () => {
        chrome.runtime.sendMessage({ action: "updateContent" });
      });
    } catch (n) {
      console.error("Error loading invalid site page:", n);
    }
  }
  async function n() {
    try {
      let e = await chrome.storage.local.get("openaiApiKey");
      return e.openaiApiKey;
    } catch (t) {
      return console.error("Error getting API key:", t), null;
    }
  }
  async function a(e) {
    let t = await n();
    if (!t) {
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
      let a = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${t}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          max_completion_tokens: 700,
          messages: [
            {
              role: "system",
              content:
                "You are an advanced sports betting analyst AI assistant. Please provide a highly detailed analysis with concise, high-value insights. Structure the response with the following sections: \n- Public Sentiment: \n<h2><img src='icons/speaking_head_in_silhouette.png' class='analysis-header-icon'> Public Sentiment</h2>\n<ul>\n<li>Analyze underlying biases in public opinion toward star players</li>\n<li>Game momentum or standout plays that may influence betting trends</li></ul>\n- High-Value Bets: \n<h2><img src='icons/fire.png' class='analysis-header-icon'> High-Value Bets</h2>\n<ul>\n<li>Highlight specific betting opportunities with odds</li>\n<li>Include rationale for lesser-known players where value exists</li></ul>\n- Strategic Suggestions: \n<h2><img src='icons/chart_with_upwards_trend.png' class='analysis-header-icon'> Strategic Suggestions</h2>\n<ul>\n<li>Suggest strategies for experienced bettors</li>\n<li>Consider public biases and player prop inefficiencies</li></ul>\n- Key Insights: \n<h2><img src='icons/eyes.png' class='analysis-header-icon'> Key Insights</h2>\n<ul>\n<li>Offer high-level takeaways that capture game dynamics</li>\n<li>Emphasize actionable insights for future bets</li></ul>\nBegin each response with: <h2 style='font-size: 20px; margin-bottom: 1rem;'>Event: [Team1 vs Team2]</h2>",
            },
            { role: "user", content: e },
          ],
        }),
      });
      if (!a.ok) throw Error(`HTTP error! status: ${a.status}`);
      let i = await a.json(),
        s = i.choices[0].message.content;
      chrome.runtime.sendMessage({ action: "storeData", data: s }, () => {
        chrome.runtime.sendMessage({ action: "updateContent" });
      });
    } catch (o) {
      console.error("Error:", o);
      let r = o.message.includes("401")
        ? "Invalid API key. Please check your settings and try again."
        : "Error analyzing content. Please try again later.";
      chrome.runtime.sendMessage(
        { action: "storeData", data: `<div class="error-message">${r}</div>` },
        () => {
          chrome.runtime.sendMessage({ action: "updateContent" });
        }
      );
    }
  }
  if (!e()) {
    t();
    return;
  }
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
  let i = "Please analyze the following sports betting content:\n\n",
    s = document.getElementById("main-view");
  if (s) {
    let o = s.innerText;
    i += o + "\n";
  }
  let r = document.getElementById("event-page-wrapper");
  if (r) {
    let l = r.innerText;
    i += l + "\n";
  }
  let c = !1;
  (i +=
    "\nPlease identify the teams involved and provide analysis for this matchup.") &&
  !c
    ? ((c = !0), a(i))
    : (console.error("Error: No prompt data found."),
      chrome.runtime.sendMessage(
        {
          action: "storeData",
          data: '<div class="error-message">Unable to find betting content on this page.</div>',
        },
        () => {
          chrome.runtime.sendMessage({ action: "updateContent" });
        }
      ));
})();
