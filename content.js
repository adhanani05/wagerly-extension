(() => {
  function e() {
    let e = window.location.hostname;
    return ["betmgm.com", "draftkings.com"].some((n) => e.includes(n));
  }
  async function n() {
    try {
      let e = await fetch(chrome.runtime.getURL("invalid-sp.html")),
        n = await e.text();
      chrome.runtime.sendMessage({ action: "storeData", data: n }, () => {
        chrome.runtime.sendMessage({ action: "updateContent" });
      });
    } catch (t) {
      console.error("Error loading invalid site page:", t);
    }
  }
  if (!e()) {
    n();
    return;
  }
  chrome.runtime.sendMessage(
    {
      action: "storeData",
      data: '<div class="cool-loading">Analyzing page content...</div>',
    },
    () => {
      chrome.runtime.sendMessage({ action: "updateContent" });
    }
  );
  let t = "",
    i = !1,
    s = document.getElementById("main-view");
  s && (t += s.innerText + "\n");
  let a = document.getElementById("event-page-wrapper");
  a && (t += a.innerText + "\n"),
    t &&
      !i &&
      (((i = !0), t)
        ? fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Bearer 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",
            },
            body: JSON.stringify({
              model: "gpt-4o-mini",
              max_completion_tokens: 600,
              messages: [
                {
                  role: "system",
                  content:
                    "You are an advanced sports betting analyst AI assistant. Please provide a highly detailed analysis with concise, high-value insights. Structure the response with the following sections: \n- Public Sentiment: \n<h2><img src='icons/speaking_head_in_silhouette.png' class='analysis-header-icon'> Public Sentiment</h2>\n<ul>\n<li>Analyze underlying biases in public opinion toward star players</li>\n<li>Game momentum or standout plays that may influence betting trends</li></ul>\n- High-Value Bets: \n<h2><img src='icons/fire.png' class='analysis-header-icon'> High-Value Bets</h2>\n<ul>\n<li>Highlight specific betting opportunities with odds</li>\n<li>Include rationale for lesser-known players where value exists</li></ul>\n- Strategic Suggestions: \n<h2><img src='icons/chart_with_upwards_trend.png' class='analysis-header-icon'> Strategic Suggestions</h2>\n<ul>\n<li>Suggest strategies for experienced bettors</li>\n<li>Consider public biases and player prop inefficiencies</li></ul>\n- Key Insights: \n<h2><img src='icons/eyes.png' class='analysis-header-icon'> Key Insights</h2>\n<ul>\n<li>Offer high-level takeaways that capture game dynamics</li>\n<li>Emphasize actionable insights for future bets</li></ul>\nBegin each response with: <h2 style='font-size: 20px; margin-bottom: 1rem;'>Event: [Team1 vs Team2]</h2> \nNever use asteriks (*) or other special characters in your responses.",
                },
                { role: "user", content: t },
              ],
            }),
          })
            .then((e) => e.json())
            .then((e) => {
              let n = e.choices[0].message.content;
              console.log(n),
                chrome.runtime.sendMessage(
                  { action: "storeData", data: n },
                  () => {
                    chrome.runtime.sendMessage({ action: "updateContent" });
                  }
                );
            })
            .catch((e) => console.error("Error:", e))
        : console.error("Error: No prompt data found."));
})();
