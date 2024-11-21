// script.js
const port = chrome.runtime.connect({ name: "SidePanelPort" });
port.postMessage({ type: "init" }),
  port.onMessage.addListener((e) => {
    "handle-init" === e.type && console.log(e.message);
  });
