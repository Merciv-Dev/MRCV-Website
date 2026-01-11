/**
 * Chat Bar Loader
 * Single script that loads the chat bar component from GitHub Pages
 * 
 * Usage in Webflow embed:
 * <div id="chat-bar"></div>
 * <script src="https://merciv-dev.github.io/MRCV-Website/chat-bar-loader.js"></script>
 */

(function () {
    'use strict';

    // Auto-detect base URL from the loader script location
    const scripts = document.getElementsByTagName('script');
    const loaderScript = Array.from(scripts).find(s => s.src.includes('chat-bar-loader.js'));

    // Default to GitHub Pages URL
    let BASE_URL = 'https://merciv-dev.github.io/MRCV-Website';

    if (loaderScript) {
        // Extract base URL by removing the filename
        const scriptUrl = loaderScript.src;
        BASE_URL = scriptUrl.substring(0, scriptUrl.lastIndexOf('/'));
        console.log('Chat Bar: Loading from:', BASE_URL);
    }

    const container = document.getElementById('chat-bar');

    if (!container) {
        console.error('Chat Bar: No element with id="chat-bar" found');
        return;
    }

    // Check for hero-anim wrapper (Webflow uses class, GitHub Pages uses id)
    const heroAnim = document.getElementById('hero-anim') || 
                     document.querySelector('.hero-anim') ||
                     container.closest('.hero-anim');
    if (heroAnim) {
        // Only add positioning for background layers - don't override Webflow's layout
        heroAnim.style.position = 'relative';
        heroAnim.style.overflow = 'hidden';
        console.log('Chat Bar: Found hero-anim wrapper:', heroAnim.id || heroAnim.className);
    }

    // Ensure chat-bar container has proper z-index to sit above backgrounds
    container.style.position = 'relative';
    container.style.zIndex = '10';

    // 1. Load Tailwind CSS (skip if already loaded in Webflow head)
    if (typeof tailwind === 'undefined') {
        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwindScript);

        // 2. Load Tailwind Config after Tailwind loads
        const tailwindConfig = document.createElement('script');
        tailwindConfig.src = BASE_URL + '/tailwind-config.js';
        document.head.appendChild(tailwindConfig);
    } else {
        console.log('Chat Bar: Tailwind already loaded, skipping');
    }

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

            // Set base URL for background images
            window.BACKGROUND_BASE_URL = BASE_URL;

            // 7. Load components in sequence
            const components = [
                '/components/icon-library.js',
                '/components/tag.js',
                '/components/source-library.js',
                '/components/source-tag.js',
                '/components/text-card-output.js',
                '/components/visualization-card.js',
                '/components/background-manager.js',
                '/components/status-bar.js'
            ];

            function loadScripts(scripts, callback) {
                if (scripts.length === 0) return callback();
                const script = document.createElement('script');
                script.src = BASE_URL + scripts[0];
                script.onload = function () {
                    loadScripts(scripts.slice(1), callback);
                };
                document.body.appendChild(script);
            }

            loadScripts(components, function () {
            // 8. Load main JS after components are ready
                const script = document.createElement('script');
                script.src = BASE_URL + '/chat-bar.js';
                script.onload = function () {
                    // 9. Load workflow automation after main JS is loaded
                    const workflowScript = document.createElement('script');
                    workflowScript.src = BASE_URL + '/chat-bar-workflows.js';
                    document.body.appendChild(workflowScript);
                };
                document.body.appendChild(script);
            });
        })
        .catch(function (err) {
            console.error('Chat Bar: Failed to load', err);
        });
})();

