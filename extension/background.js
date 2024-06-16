const SYNC_API_URL = 'https://example.com/api';
const AUTHORIZATION_KEY = 'YOUR_API_KEY';

async function synchronizeRemoteDataToLocal() {
  try {
    const apiResponse = await fetch(`${SYNC_API_URL}/sync`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AUTHORIZATION_KEY}`
      }
    });
    if (!apiResponse.ok) throw new Error('Failed to fetch data from API');
    const remoteData = await apiResponse.json();
    chrome.storage.local.set({ localSyncedData: remoteData }, () => {
      console.log('Remote data has been successfully synchronized with local storage.');
    });
  } catch (error) {
    console.error('Error during data synchronization:', error.message);
  }
}

function initializeDataSyncTimer() {
  chrome.alarms.create('dataSyncAlarm', { periodInMinutes: 60 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'dataSyncAlarm') synchronizeRemoteDataToLocal();
  });
}

chrome.runtime.onInstalled.addListener((installationDetails) => {
  if (installationDetails.reason.search(/install|update/) !== -1) {
    synchronizeRemoteDataToLocal();
    initializeDataSyncTimer();
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "invokeImmediateSync") {
    synchronizeRemoteDataToLocal().then(() => sendResponse({ status: 'synchronizationCompleted' }));
    return true; // Indicates async response will be sent
  }
});