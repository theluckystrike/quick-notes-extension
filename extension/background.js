// Quick Notes - Background Service Worker
// Handles install events, context menu, and Zovo integration

const EXTENSION_SLUG = 'quick-notes';
const ZOVO_URL = 'https://zovo.one';

// Create context menu on install
chrome.runtime.onInstalled.addListener((details) => {
  // Create context menu for feature requests
  chrome.contextMenus.create({
    id: 'zovo-feedback',
    title: '💡 Request a feature (Zovo)',
    contexts: ['action']
  });

  // Handle first install
  if (details.reason === 'install') {
    chrome.storage.local.set({
      isFirstInstall: true,
      installDate: Date.now()
    });

    chrome.action.setBadgeText({ text: 'NEW' });
    chrome.action.setBadgeBackgroundColor({ color: '#7C3AED' });
  }

  // Handle updates
  if (details.reason === 'update') {
    chrome.action.setBadgeText({ text: '✓' });
    chrome.action.setBadgeBackgroundColor({ color: '#667eea' });

    chrome.storage.local.set({
      lastUpdate: Date.now(),
      previousVersion: details.previousVersion,
      currentVersion: chrome.runtime.getManifest().version
    });

    setTimeout(() => {
      chrome.action.setBadgeText({ text: '' });
    }, 24 * 60 * 60 * 1000);
  }
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'zovo-feedback') {
    chrome.tabs.create({
      url: `${ZOVO_URL}/features?ref=${EXTENSION_SLUG}&utm_source=extension&utm_medium=contextmenu`
    });
  }
});

// Listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'clearBadge') {
    chrome.action.setBadgeText({ text: '' });
    sendResponse({ success: true });
  }

  if (message.action === 'openZovo') {
    const medium = message.medium || 'popup';
    chrome.tabs.create({
      url: `${ZOVO_URL}?ref=${EXTENSION_SLUG}&utm_source=extension&utm_medium=${medium}`
    });
    sendResponse({ success: true });
  }

  return true;
});
