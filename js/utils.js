const $ = (selector, el = document) => el.querySelector(selector);

/**
 * Format a time in seconds to a string
 * @param {number} time Time in seconds
 * @returns {string} Formatted time in hrs mins secs
 */
function formatTime(time) {
  const hrs = Math.floor(time / 3600);
  const mins = Math.floor((time % 3600) / 60);
  const secs = Math.floor(time % 60);

  return `${hrs}h ${mins}m ${secs}s`;
}