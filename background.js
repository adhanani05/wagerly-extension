console.log("Background script loaded"); // New logging line
let storedData = "";

const BETMGM_ORIGIN = "https://sports.nj.betmgm.com";
const DRAFTKINGS_ORIGIN = "https://sportsbook.draftkings.com";

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  if (!tab.url) return;
  const url = new URL(tab.url);
  // Enables the side panel on betmgm.com
  if (url.origin === BETMGM_ORIGIN || url.origin === DRAFTKINGS_ORIGIN) {
    await chrome.sidePanel.setOptions({
      tabId,
      path: "main-sp.html",
      enabled: true,
    });
  } else {
    // Disables the side panel on all other sites
    await chrome.sidePanel.setOptions({
      tabId,
      path: "invalid-sp.html",
      enabled: true,
    });
  }
});

chrome.runtime.onConnect.addListener((port) => {
  port.onMessage.addListener(async (msg) => {
    if (port.name === "SidePanelPort") {
      if (msg.type === "init") {
        console.log("panel opened");

        await chrome.storage.local.set({ panelOpen: true });

        port.onDisconnect.addListener(async () => {
          await chrome.storage.local.set({ panelOpen: false });
          console.log("panel closed");
          console.log("port disconnected: ", port.name);
        });

        const tab = await getCurrentTab();

        if (!tab?.id) {
          console.error("Couldn't get current tab");
          return;
        }

        injectContentScript(tab.id);

        port.postMessage({
          type: "handle-init",
          message: "panel open",
        });
      }
    }
  });
});

chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
  if (!(tab.id && changeInfo.status === "complete")) return;

  console.log("tab connected: ", tab.url, changeInfo);

  const { panelOpen } = await chrome.storage.local.get("panelOpen");
  if (panelOpen) {
    console.log("panel open");
    injectContentScript(tabId);
  }
});

async function getCurrentTab() {
  const queryOptions = { active: true, currentWindow: true };
  const [tab] = await chrome.tabs.query(queryOptions);
  return tab;
}

function injectContentScript(tabId) {
  chrome.scripting.executeScript({
    target: { tabId: tabId },
    files: ["content.js"],
  });
}
