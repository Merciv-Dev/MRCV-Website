/**
 * Chat Bar Loader
 * Single script that loads the chat bar component from GitHub Pages
 * 
 * Usage in Webflow embed:
 * <div id="chat-bar"></div>
 * <script src="https://merciv-dev.github.io/MRCV-Website/chat-bar-loader.js"></script>
 * 
 * For faster loading, add to Webflow Head:
 * <link rel="preconnect" href="https://merciv-dev.github.io">
 * <link rel="preconnect" href="https://fonts.googleapis.com">
 * <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
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

    // Set base URL immediately for background images
    window.BACKGROUND_BASE_URL = BASE_URL;

    // ============================================
    // 1. PRELOAD CRITICAL RESOURCES IMMEDIATELY
    // ============================================

    // Preload first background image (shown on load)
    const preloadImg = document.createElement('link');
    preloadImg.rel = 'preload';
    preloadImg.as = 'image';
    preloadImg.href = BASE_URL + '/imgs/Runners.jpg';
    document.head.appendChild(preloadImg);

    // Preload CSS
    const preloadCSS = document.createElement('link');
    preloadCSS.rel = 'preload';
    preloadCSS.as = 'style';
    preloadCSS.href = BASE_URL + '/chat-bar.css';
    document.head.appendChild(preloadCSS);

    // Prefetch other background images
    const prefetchImages = ['ChildCare1.jpg', 'Weather2.jpeg'];
    prefetchImages.forEach(img => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.as = 'image';
        link.href = BASE_URL + '/imgs/' + img;
        document.head.appendChild(link);
    });

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

    // ============================================
    // 2. LOAD CSS & FONTS (parallel)
    // ============================================

    // Load Custom CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = BASE_URL + '/chat-bar.css';
    document.head.appendChild(link);

    // Load Google Fonts (DM Sans)
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&display=swap';
    document.head.appendChild(fontLink);

    // Load Material Symbols
    const materialSymbols = document.createElement('link');
    materialSymbols.rel = 'stylesheet';
    materialSymbols.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined';
    document.head.appendChild(materialSymbols);

    // ============================================
    // 3. LOAD TAILWIND (if not already present)
    // ============================================

    let tailwindReady = Promise.resolve();

    if (typeof tailwind === 'undefined') {
        tailwindReady = new Promise((resolve) => {
            const tailwindScript = document.createElement('script');
            tailwindScript.src = 'https://cdn.tailwindcss.com';
            tailwindScript.onload = () => {
                // Load Tailwind Config after Tailwind loads
                const tailwindConfig = document.createElement('script');
                tailwindConfig.src = BASE_URL + '/tailwind-config.js';
                tailwindConfig.onload = resolve;
                document.head.appendChild(tailwindConfig);
            };
            document.head.appendChild(tailwindScript);
        });
    } else {
        console.log('Chat Bar: Tailwind already loaded, skipping');
    }

    // ============================================
    // 4. FETCH HTML & LOAD SCRIPTS
    // ============================================

    // Start fetching HTML immediately (parallel with Tailwind)
    const htmlReady = fetch(BASE_URL + '/chat-bar.html')
        .then(response => response.text())
        .then(html => {
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');
            const chatContainer = doc.querySelector('.chat-container');

            if (chatContainer) {
                container.innerHTML = chatContainer.outerHTML;
            }
            return true;
        });

    // Wait for both HTML and Tailwind, then load components
    Promise.all([htmlReady, tailwindReady]).then(() => {
        // Group 1: Independent components (can load in parallel)
        const parallelComponents = [
            '/components/icon-library.js',
            '/components/source-library.js'
        ];

        // Group 2: Depends on icon-library
        const tagComponents = [
            '/components/tag.js',
            '/components/source-tag.js'
        ];

        // Group 3: UI components (can load in parallel after tags)
        const uiComponents = [
            '/components/text-card-output.js',
            '/components/visualization-card.js',
            '/components/background-manager.js',
            '/components/status-bar.js'
        ];

        // Load scripts in parallel within groups
        function loadScriptsParallel(scripts) {
            return Promise.all(scripts.map(src => {
                return new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = BASE_URL + src;
                    script.onload = resolve;
                    script.onerror = resolve; // Don't block on errors
                    document.body.appendChild(script);
                });
            }));
        }

        function loadScriptsSequential(scripts) {
            return scripts.reduce((promise, src) => {
                return promise.then(() => new Promise((resolve) => {
                    const script = document.createElement('script');
                    script.src = BASE_URL + src;
                    script.onload = resolve;
                    script.onerror = resolve;
                    document.body.appendChild(script);
                }));
            }, Promise.resolve());
        }

        // Load in optimized order
        loadScriptsParallel(parallelComponents)
            .then(() => loadScriptsSequential(tagComponents))
            .then(() => loadScriptsParallel(uiComponents))
            .then(() => {
        // Load main JS
                const script = document.createElement('script');
                script.src = BASE_URL + '/chat-bar.js';
                script.onload = () => {
                // Load workflow automation last
                    const workflowScript = document.createElement('script');
                    workflowScript.src = BASE_URL + '/chat-bar-workflows.js';
                    document.body.appendChild(workflowScript);
                };
                document.body.appendChild(script);
            });
    }).catch(err => {
        console.error('Chat Bar: Failed to load', err);
    });
})();

