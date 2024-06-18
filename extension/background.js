const SYNC_API_URL = 'https://example.com/api';
const AUTHORIZATION_KEY = 'YOUR_API_KEY';

async function fetchFromApi(endpoint, options = {}) {
  const response = await fetch(`${SYNC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${AUTHORIZATION_KEY}`,
      ...(options.headers || {}),
    },
  });
  if (!response.ok) throw new Error('Failed to fetch data from API');
  return response.json();
}

async function synchronizeRemoteDataToLocal() {
  try {
    const remoteData = await fetchFromApi('/sync');
    chrome.storage.local.set({ localSyncedData: remoteData }, () => {
      console.log('Remote data has been successfully synchronized with local storage.');
    });
  } catch (error) {
    console.error('Error during data synchronization:', error.message);
  }
}

function initializeDataSyncTimer() {
  chrome.alarms.create('dataSyncAlarm', { periodInMinutes: 60 });
  chrome.alarms.onAlarm.addListener(alarm => {
    if (alarm.name === 'dataSyncAlarm') synchronizeRemoteDataToLocal();
  });
}

function setUpEventListeners() {
  chrome.runtime.onInstalled.addListener(({reason}) => {
    if (['install', 'update'].includes(reason)) {
      synchronizeRemoteDataToLocal();
      initializeDataSyncTimer();
    }
  });

  chrome.runtime.onMessage.addListener((message, _, sendResponse) => {
    if (message.action === "invokeImmediateSync") {
      synchronizeRemoteDataToLocal().then(() => sendResponse({ status: 'synchronizationCompleted' }));
      return true;
    }
  });
}

setUpEventListeners();