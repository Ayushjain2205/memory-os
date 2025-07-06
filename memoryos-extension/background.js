chrome.action.onClicked.addListener(() => {
  if (chrome.sidePanel) {
    chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
  }
});
