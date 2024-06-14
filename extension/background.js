const API_URL = 'https://example.com/api';
const API_KEY = 'YOUR_API_KEY';

async function syncData() {
  try {
    const response = await fetch(`${API_URL}/sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    chrome.storage.local.set({ syncedData: data }, () => {
      console.log('Data synced with local storage.');
    });
  } catch (error) {
    console.error('Error syncing data:', error.message);
  }
}

function setupSyncAlarm() {
  chrome.alarms.create('syncData', { periodInMinutes: 60 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'syncData') syncData();
  });
}

chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason.search(/install|update/) !== -1) {
    syncData();
    setupSyncAlarm();
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "syncNow") {
    syncData().then(() => sendResponse({ status: 'completed' }));
    return true;
  }
});