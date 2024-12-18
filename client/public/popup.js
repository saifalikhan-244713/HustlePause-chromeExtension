/* global chrome */

const toggleButton = document.getElementById('toggle-button');
const intervalInput = document.getElementById('interval');
const durationInput = document.getElementById('duration');

// Initialize button state
chrome.storage.local.get(['isRunning', 'interval', 'duration'], ({ isRunning, interval, duration }) => {
  toggleButton.textContent = isRunning ? 'Stop' : 'Start';
  if (interval) intervalInput.value = interval;
  if (duration) durationInput.value = duration;
});

// Handle button click
toggleButton.addEventListener('click', () => {
  const interval = parseInt(intervalInput.value, 10);
  const duration = parseInt(durationInput.value, 10);

  if (isNaN(interval) || isNaN(duration) || interval <= 0 || duration <= 0) {
    alert('Please enter valid numbers for interval and duration.');
    return;
  }

  chrome.storage.local.get('isRunning', ({ isRunning }) => {
    const newState = !isRunning;
    chrome.storage.local.set({ isRunning: newState, interval, duration }, () => {
      toggleButton.textContent = newState ? 'Stop' : 'Start';

      // Notify the background script
      chrome.runtime.sendMessage({
        action: newState ? 'START' : 'STOP',
        data: { interval, duration }, // Correctly structure the data object
      });
    });
  });
});
