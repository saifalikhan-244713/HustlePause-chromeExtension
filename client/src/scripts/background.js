/* global chrome */

function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Listen to messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "START") {
    logWithTimestamp("Starting the extension.");
    const { interval, duration } = message.data;
    startAlarms(interval, duration);
  } else if (message.action === "STOP") {
    logWithTimestamp("Stopping the extension.");
    stopAlarms();
  }
});

// Function to start alarms
function startAlarms(interval, duration) {
  chrome.storage.local.set({ interval, duration, isRunning: true }, () => {
    chrome.alarms.clearAll(() => {
      chrome.alarms.create("pauseCycle", { periodInMinutes: interval });
      logWithTimestamp(`Alarm created with an interval of ${interval} minutes.`);
    });
  });
}

// Function to stop alarms
function stopAlarms() {
  chrome.storage.local.set({ isRunning: false }, () => {
    chrome.alarms.clearAll(() => {
      logWithTimestamp("All alarms cleared.");
    });
  });
}
// Listen to messages from the popup
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "START") {
    logWithTimestamp("Starting the extension.");
    const { interval, duration } = message.data || {}; // Fallback to an empty object
    if (interval && duration) {
      startAlarms(interval, duration);
    } else {
      logWithTimestamp("Invalid data received for START action.");
    }
  } else if (message.action === "STOP") {
    logWithTimestamp("Stopping the extension.");
    stopAlarms();
  }
});

// Handle alarm events
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "pauseCycle") {
    logWithTimestamp("Alarm triggered: pauseCycle");

    chrome.storage.local.get(["isRunning", "duration"], ({ isRunning, duration }) => {
      if (!isRunning) {
        logWithTimestamp("Extension is stopped. Ignoring alarm.");
        return;
      }

      chrome.tabs.query(
        { url: ["*://*.instagram.com/*", "*://*.youtube.com/*"] },
        (tabs) => {
          tabs.forEach((tab) => {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              func: pauseContent,
              args: [duration],
            });
          });
        }
      );
    });
  }
});

// Function to pause content
function pauseContent(duration) {
  const pauseDuration = duration * 60 * 1000; // Convert minutes to milliseconds
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
  overlay.innerText = `Take a break for ${duration} minute(s)!`;
  document.body.appendChild(overlay);

  if (hostname.includes("youtube.com")) {
    const videos = document.querySelectorAll("video");
    videos.forEach((video) => video.pause());
    setTimeout(() => {
      videos.forEach((video) => video.play());
    }, pauseDuration);
  }

  if (hostname.includes("instagram.com")) {
    document.body.style.overflow = "hidden";
    setTimeout(() => {
      document.body.style.overflow = "";
    }, pauseDuration);
  }

  setTimeout(() => {
    const overlay = document.getElementById(overlayId);
    if (overlay) {
      document.body.removeChild(overlay);
    }
  }, pauseDuration);
}
