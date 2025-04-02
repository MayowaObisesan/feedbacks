// public/embed.js
(function() {
  // Check if already loaded
  if (window.FeedbacksEmbed) return;

  // Load custom element definition
  const script = document.createElement('script');
  script.src = 'http://localhost:3001/FeedbacksEmbed.js';
  document.head.appendChild(script);

  // Define global object
  window.FeedbacksEmbed = true;
})();
