/* global chrome */
function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Listen to toggle messages from popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'START') {
    logWithTimestamp('Starting the extension.');
    startAlarms();
  } else if (message.action === 'STOP') {
    logWithTimestamp('Stopping the extension.');
    stopAlarms();
  }
});

// Function to start alarms
function startAlarms() {
  chrome.alarms.clearAll(() => {
    chrome.alarms.create('pauseCycle', { periodInMinutes: 1 });
    logWithTimestamp('Alarm created.');
  });
}

// Function to stop alarms
function stopAlarms() {
  chrome.alarms.clearAll(() => {
    logWithTimestamp('All alarms cleared.');
  });
}

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'pauseCycle') {
    logWithTimestamp('Alarm triggered: pauseCycle');

    chrome.storage.local.get('isRunning', ({ isRunning }) => {
      if (!isRunning) {
        logWithTimestamp('Extension is stopped. Ignoring alarm.');
        return;
      }

      chrome.tabs.query(
        { url: ['*://*.instagram.com/*', '*://*.youtube.com/*'] },
        (tabs) => {
          tabs.forEach((tab) => {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: pauseContent,
            });
          });
        }
      );
    });
  }
});



function pauseContent() {
  const pauseDuration = 60000; // 1 minute
  const overlayId = "pause-overlay";
  const hostname = window.location.hostname;

  console.log(`[${new Date().toISOString()}] Starting pauseContent on ${hostname}.`);

  if (document.getElementById(overlayId)) {
    console.log(`[${new Date().toISOString()}] Overlay already exists, skipping.`);
    return;
  }

  const overlay = document.createElement("div");
  overlay.id = overlayId;
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
  overlay.style.color = "white";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "9999";
  overlay.innerText = "Take a break for 1 minute!";
  document.body.appendChild(overlay);

  console.log(`[${new Date().toISOString()}] Overlay displayed.`);

  if (hostname.includes("youtube.com")) {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => video.pause());
    console.log(`[${new Date().toISOString()}] Paused all videos on YouTube.`);
    setTimeout(() => {
      videos.forEach((video) => video.play());
      console.log(`[${new Date().toISOString()}] Resumed all videos on YouTube.`);
    }, pauseDuration);
  }

  if (hostname.includes("instagram.com")) {
    document.body.style.overflow = "hidden";
    console.log(`[${new Date().toISOString()}] Disabled scrolling on Instagram.`);
    setTimeout(() => {
      document.body.style.overflow = "";
      console.log(`[${new Date().toISOString()}] Re-enabled scrolling on Instagram.`);
    }, pauseDuration);
  }

  setTimeout(() => {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      document.body.removeChild(overlay);
      console.log(`[${new Date().toISOString()}] Overlay removed.`);
    }
  }, pauseDuration);
}
