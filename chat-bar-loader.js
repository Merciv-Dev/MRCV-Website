/**
 * Chat Bar Loader
 * Single script that loads the chat bar component from GitHub
 * 
 * Usage in Webflow embed:
 * <div id="chat-bar"></div>
 * <script src="https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main/chat-bar-loader.js"></script>
 */

(function () {
    'use strict';

    const BASE_URL = 'https://cdn.jsdelivr.net/gh/Merciv-Dev/MRCV-Website@main';
    const container = document.getElementById('chat-bar');

    if (!container) {
        console.error('Chat Bar: No element with id="chat-bar" found');
        return;
    }

    // 1. Load Tailwind CSS
    const tailwindScript = document.createElement('script');
    tailwindScript.src = 'https://cdn.tailwindcss.com';
    document.head.appendChild(tailwindScript);

    // 2. Load Tailwind Config
    const tailwindConfig = document.createElement('script');
    tailwindConfig.src = BASE_URL + '/tailwind-config.js';
    document.head.appendChild(tailwindConfig);

    // 3. Load Custom CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BASE_URL + '/chat-bar.css';
    document.head.appendChild(link);

    // 4. Load Google Fonts (DM Sans)
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap';
    document.head.appendChild(fontLink);

    // 5. Load Material Symbols
    const materialSymbols = document.createElement('link');
    materialSymbols.rel = 'stylesheet';
    materialSymbols.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    document.head.appendChild(materialSymbols);

    // 6. Fetch HTML and inject component
    fetch(BASE_URL + '/chat-bar.html')
        .then(function (response) { return response.text(); })
        .then(function (html) {
            // Extract just the .chat-container div from the HTML
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const chatContainer = doc.querySelector('.chat-container');

            if (chatContainer) {
                container.innerHTML = chatContainer.outerHTML;
            }

            // 7. Load Tag component first
            const tagScript = document.createElement('script');
            tagScript.src = BASE_URL + '/components/tag.js';
            tagScript.onload = function () {
                // 8. Load main JS after component is ready
                const script = document.createElement('script');
                script.src = BASE_URL + '/chat-bar.js';
                script.onload = function () {
                    // 9. Load workflow automation after main JS is loaded
                    const workflowScript = document.createElement('script');
                    workflowScript.src = BASE_URL + '/chat-bar-workflows.js';
                    document.body.appendChild(workflowScript);
                };
                document.body.appendChild(script);
            };
            document.body.appendChild(tagScript);
        })
        .catch(function (err) {
            console.error('Chat Bar: Failed to load', err);
        });
})();

