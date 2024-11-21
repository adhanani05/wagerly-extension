document.addEventListener("DOMContentLoaded", () => {
  let e = document.getElementById("content"),
    a = [],
    t = document.createElement("div");
  t.className = "chat-container";
  let n = document.createElement("div");
  n.className = "chat-messages";
  let s = document.createElement("div");
  s.className = "input-container";
  let i = document.createElement("input");
  (i.type = "text"),
    (i.className = "chat-input"),
    (i.placeholder = "Ask a question about the analysis...");
  let r = document.createElement("button");
  function l(e, t = !1, s = !1) {
    let i = document.createElement("div");
    (i.className = `message ${
      t ? "user-message" : s ? "analysis-message" : "assistant-message"
    }`),
      s &&
        (e = (e = (e = (e = e.replace(
          /<h2>Public Sentiment:<\/h2>/g,
          '<h2><span class="analysis-header-icon-1"></span>Public Sentiment:</h2>'
        )).replace(
          /<h2>High-Value Bets:<\/h2>/g,
          '<h2><span class="analysis-header-icon-2"></span>High-Value Bets:</h2>'
        )).replace(
          /<h2>Strategic Suggestions:<\/h2>/g,
          '<h2><span class="analysis-header-icon-3"></span>Strategic Suggestions:</h2>'
        )).replace(
          /<h2>Key Insights:<\/h2>/g,
          '<h2><span class="analysis-header-icon-4"></span>Key Insights:</h2>'
        )),
      (i.innerHTML = e),
      n.appendChild(i),
      (n.scrollTop = n.scrollHeight),
      a.push({ role: t ? "user" : "assistant", content: e });
  }
  function c() {
    let e = document.createElement("div");
    e.className = "loading";
    let a = document.createElement("div");
    return (
      (a.className = "loading-spinner"),
      e.appendChild(a),
      n.appendChild(e),
      (n.scrollTop = n.scrollHeight),
      e
    );
  }
  async function o(e) {
    try {
      let t = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization:
              "Bearer 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",
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
              ...a,
              { role: "user", content: e },
            ],
          }),
        }),
        n = await t.json();
      return n.choices[0].message.content;
    } catch (s) {
      return (
        console.error("Error:", s),
        "Sorry, I encountered an error while processing your request. Please try again."
      );
    }
  }
  async function d() {
    let e = i.value.trim();
    if (!e) return;
    l(e, !0), (i.value = "");
    let a = c(),
      t = await o(e);
    a.remove(), l(t);
  }
  (r.className = "send-button"),
    (r.textContent = "Send"),
    s.appendChild(i),
    s.appendChild(r),
    t.appendChild(n),
    t.appendChild(s),
    e.appendChild(t),
    r.addEventListener("click", d),
    i.addEventListener("keypress", (e) => {
      "Enter" === e.key && d();
    }),
    chrome.runtime.sendMessage({ action: "getData" }, (e) => {
      e && e.data && l(e.data, !1, !0);
    }),
    chrome.runtime.onMessage.addListener((e) => {
      "refreshContent" === e.action &&
        chrome.runtime.sendMessage({ action: "getData" }, (e) => {
          e && e.data && ((n.innerHTML = ""), (a = []), l(e.data, !1, !0));
        });
    });
});
