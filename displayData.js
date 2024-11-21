document.addEventListener("DOMContentLoaded", async () => {
  let e = document.getElementById("content"),
    t = [];
  function n() {
    let t = document.createElement("div");
    t.className = "chat-container";
    let n = document.createElement("div");
    (n.className = "chat-messages"), (n.id = "chat-messages");
    let s = document.createElement("div");
    s.className = "input-container";
    let i = document.createElement("input");
    (i.type = "text"),
      (i.className = "chat-input"),
      (i.placeholder = "Ask a question about the analysis...");
    let o = document.createElement("button");
    (o.className = "send-button"), (o.textContent = "Send");
    let r = document.createElement("button");
    (r.className = "settings-button"),
      (r.textContent = "⚙️"),
      (r.title = "Settings"),
      (r.onclick = () => chrome.runtime.openOptionsPage()),
      s.appendChild(i),
      s.appendChild(o),
      s.appendChild(r),
      t.appendChild(n),
      t.appendChild(s),
      e.appendChild(t),
      a(n, i, o),
      l(n);
  }
  async function a(e, n, a) {
    async function l() {
      let a = n.value.trim();
      if (!a) return;
      (n.value = ""), i(e, a, "user");
      let l = await chrome.storage.local.get("openaiApiKey");
      if (!l.openaiApiKey) {
        i(
          e,
          "Please set your OpenAI API key in the extension settings to continue.",
          "assistant"
        );
        return;
      }
      o(e);
      try {
        let c = await s(a);
        r(e), i(e, c, "assistant"), t.push({ role: "assistant", content: c });
      } catch (p) {
        r(e),
          i(e, "Error processing your request. Please try again.", "assistant");
      }
    }
    a.addEventListener("click", l),
      n.addEventListener("keypress", (e) => {
        "Enter" === e.key && l();
      });
  }
  async function s(e) {
    let n = await chrome.storage.local.get("openaiApiKey");
    if (!n.openaiApiKey) throw Error("API key not set");
    try {
      let a = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${n.openaiApiKey}`,
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
            ...t,
            { role: "user", content: e },
          ],
        }),
      });
      if (!a.ok) throw Error(`HTTP error! status: ${a.status}`);
      let s = await a.json();
      return s.choices[0].message.content;
    } catch (i) {
      throw (console.error("Error:", i), i);
    }
  }
  function i(e, n, a) {
    let s = document.createElement("div");
    (s.className = `message ${a}-message`),
      (s.innerHTML = n),
      e.appendChild(s),
      (e.scrollTop = e.scrollHeight),
      "user" === a && t.push({ role: "user", content: n });
  }
  function o(e) {
    let t = document.createElement("div");
    (t.className = "message loading"),
      (t.innerHTML = '<div class="loading-spinner"></div>'),
      (t.id = "loading-message"),
      e.appendChild(t),
      (e.scrollTop = e.scrollHeight);
  }
  function r(e) {
    let t = e.querySelector("#loading-message");
    t && t.remove();
  }
  async function l(e) {
    (e.innerHTML = ""),
      (t = []),
      chrome.runtime.sendMessage({ action: "getData" }, (n) => {
        n &&
          n.data &&
          (t.push({
            role: "system",
            content:
              "You are an advanced sports betting analyst AI assistant. Provide a concise, high-value response. Do not use asteriks or any special characters in your response.",
          }),
          t.push({ role: "assistant", content: n.data }),
          i(e, n.data, "analysis"));
      });
  }
  n(),
    chrome.runtime.onMessage.addListener((e, t, n) => {
      if ("refreshContent" === e.action) {
        let a = document.getElementById("chat-messages");
        a && l(a);
      }
    });
});
