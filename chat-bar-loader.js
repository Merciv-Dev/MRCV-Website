/**
 * Chat Bar Loader
 * Single script that loads the chat bar component from GitHub
 * 
 * Usage in Webflow embed:
 * <div id="chat-bar"></div>
 * <script src="https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/chat-bar-loader.js"></script>
 */

(function() {
  'use strict';
  
  const BASE_URL = 'https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main';
  const container = document.getElementById('chat-bar');
  
  if (!container) {
    console.error('Chat Bar: No element with id="chat-bar" found');
    return;
  }

  // 1. Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = BASE_URL + '/chat-bar.css';
  document.head.appendChild(link);

  // 2. Load Google Fonts (DM Sans)
  const fontLink = document.createElement('link');
  fontLink.rel = 'stylesheet';
  fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap';
  document.head.appendChild(fontLink);

    // 3. Load Material Symbols
    const materialSymbols = document.createElement('link');
    materialSymbols.rel = 'stylesheet';
    materialSymbols.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    document.head.appendChild(materialSymbols);

    // 4. Fetch HTML and inject component
  fetch(BASE_URL + '/chat-bar.html')
    .then(function(response) { return response.text(); })
    .then(function(html) {
      // Extract just the .chat-container div from the HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const chatContainer = doc.querySelector('.chat-container');
      
      if (chatContainer) {
        container.innerHTML = chatContainer.outerHTML;
      }
      
        // 5. Load JS after HTML is ready
      const script = document.createElement('script');
      script.src = BASE_URL + '/chat-bar.js';
      document.body.appendChild(script);
    })
    .catch(function(err) {
      console.error('Chat Bar: Failed to load', err);
    });
})();

