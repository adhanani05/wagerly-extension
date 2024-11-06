const port = chrome.runtime.connect({ name: "SidePanelPort" });
port.postMessage({ type: "init" });

port.onMessage.addListener((msg) => {
  if (msg.type === "handle-init") {
    console.log(msg.message);
  }
});
