/* global chrome */
// Get references to the toggle button
const toggleButton = document.getElementById('toggle-button');

// Initialize button state
chrome.storage.local.get('isRunning', ({ isRunning }) => {
  toggleButton.textContent = isRunning ? 'Stop' : 'Start';
});

// Handle button click
toggleButton.addEventListener('click', () => {
  chrome.storage.local.get('isRunning', ({ isRunning }) => {
    const newState = !isRunning;
    chrome.storage.local.set({ isRunning: newState }, () => {
      toggleButton.textContent = newState ? 'Stop' : 'Start';

      // Notify the background script
      chrome.runtime.sendMessage({ action: newState ? 'START' : 'STOP' });
    });
  });
});
