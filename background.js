console.log("Background script loaded");
let storedData = "";
const BETMGM_ORIGIN = "https://sports.nj.betmgm.com",
  DRAFTKINGS_ORIGIN = "https://sportsbook.draftkings.com";
async function getCurrentTab() {
  let [t] = await chrome.tabs.query({ active: !0, currentWindow: !0 });
  return t;
}
function injectContentScript(t) {
  chrome.scripting.executeScript({
    target: { tabId: t },
    files: ["content.js"],
  });
}
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: !0 })
  .catch((t) => console.error(t)),
  chrome.tabs.onUpdated.addListener(async (t, e, n) => {
    if (!n.url) return;
    let a = new URL(n.url);
    "https://sports.nj.betmgm.com" === a.origin ||
    "https://sportsbook.draftkings.com" === a.origin
      ? await chrome.sidePanel.setOptions({
          tabId: t,
          path: "main-sp.html",
          enabled: !0,
        })
      : await chrome.sidePanel.setOptions({
          tabId: t,
          path: "invalid-sp.html",
          enabled: !0,
        });
  }),
  chrome.runtime.onConnect.addListener((t) => {
    t.onMessage.addListener(async (e) => {
      if ("SidePanelPort" === t.name && "init" === e.type) {
        console.log("panel opened"),
          await chrome.storage.local.set({ panelOpen: !0 }),
          t.onDisconnect.addListener(async () => {
            await chrome.storage.local.set({ panelOpen: !1 }),
              console.log("panel closed"),
              console.log("port disconnected: ", t.name);
          });
        let n = await getCurrentTab();
        if (!n?.id) {
          console.error("Couldn't get current tab");
          return;
        }
        injectContentScript(n.id),
          t.postMessage({ type: "handle-init", message: "panel open" });
      }
    });
  }),
  chrome.tabs.onUpdated.addListener(async (t, e, n) => {
    if (!(n.id && "complete" === e.status)) return;
    console.log("tab connected: ", n.url, e);
    let { panelOpen: a } = await chrome.storage.local.get("panelOpen");
    a && (console.log("panel open"), injectContentScript(t));
  }),
  chrome.runtime.onMessage.addListener((t, e, n) => {
    "storeData" === t.action
      ? ((storedData = t.data), n({ status: "success" }))
      : "getData" === t.action
      ? n({ data: storedData })
      : "updateContent" === t.action &&
        chrome.runtime.sendMessage({ action: "refreshContent" });
  });
