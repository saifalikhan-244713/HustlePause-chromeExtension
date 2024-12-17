/* global chrome */
function logWithTimestamp(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

function pauseYouTube() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => video.pause());
  logWithTimestamp("Paused all YouTube videos.");
}

function resumeYouTube() {
  const videos = document.querySelectorAll("video");
  videos.forEach((video) => video.play());
  logWithTimestamp("Resumed all YouTube videos.");
}

function pauseInstagram() {
  document.body.style.overflow = "hidden";
  logWithTimestamp("Disabled scrolling on Instagram.");
}

function resumeInstagram() {
  document.body.style.overflow = "";
  logWithTimestamp("Re-enabled scrolling on Instagram.");
}

function showOverlay() {
  if (document.getElementById("pause-overlay")) {
    logWithTimestamp("Overlay already exists. Skipping creation.");
    return; // Avoid multiple overlays
  }

  const overlay = document.createElement("div");
  overlay.id = "pause-overlay";
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
  logWithTimestamp("Overlay displayed.");
}

function removeOverlay() {
  const overlay = document.getElementById("pause-overlay");
  if (overlay) {
    document.body.removeChild(overlay);
    logWithTimestamp("Overlay removed.");
  }
}

chrome.runtime.onMessage.addListener((message) => {
  if (message.action === "PAUSE_WEBSITE") {
    const hostname = window.location.hostname;
    logWithTimestamp(`Received PAUSE_WEBSITE message for ${hostname}.`);

    showOverlay();

    if (hostname.includes("youtube.com")) {
      pauseYouTube();
    } else if (hostname.includes("instagram.com")) {
      pauseInstagram();
    }

    setTimeout(() => {
      removeOverlay();
      if (hostname.includes("youtube.com")) {
        resumeYouTube();
      } else if (hostname.includes("instagram.com")) {
        resumeInstagram();
      }
    }, 60000); // 1 minute
  }
});
