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
    }

    // Set base URL immediately for background images
    window.BACKGROUND_BASE_URL = BASE_URL;

    // ============================================
    // 1. PRELOAD CRITICAL RESOURCES IMMEDIATELY
    // ============================================

    // Preload CSS
    const preloadCSS = document.createElement('link');
    preloadCSS.rel = 'preload';
    preloadCSS.as = 'style';
    preloadCSS.href = BASE_URL + '/chat-bar.css';
    document.head.appendChild(preloadCSS);

    // Preload Chart.js (needed for visualizations)
    const preloadChart = document.createElement('link');
    preloadChart.rel = 'preload';
    preloadChart.as = 'script';
    preloadChart.href = 'https://cdn.jsdelivr.net/npm/chart.js';
    document.head.appendChild(preloadChart);

    // Preload background images from local imgs folder
    // Images are bundled with the package for faster loading
    const backgroundImages = [
        'imgs/running.webp',
        'imgs/baby.webp',
        'imgs/snacking.webp',
        'imgs/water.webp',
        'imgs/weather.webp'
    ];

    // Use high-priority preload for first image, prefetch for others
    backgroundImages.forEach((imgUrl, index) => {
        const link = document.createElement('link');
        link.rel = index === 0 ? 'preload' : 'prefetch';
        link.as = 'image';
        link.href = imgUrl;
        if (index === 0) link.fetchPriority = 'high';
        document.head.appendChild(link);
    });

    // Also start loading images via Image() for faster decode
    backgroundImages.forEach(imgUrl => {
        const preImg = new Image();
        preImg.src = imgUrl;
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
        // OPTIMIZED: Load all independent scripts in parallel for faster startup
        // Only tag.js truly depends on icon-library, others are independent
        
        // Load scripts in parallel
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

        // Stage 1: Load icon-library first (required by tag.js)
        // Also load background-manager early for faster image display
        const stage1 = [
            '/components/icon-library.js',
            '/components/background-manager.js'
        ];
        
        // Stage 2: Everything else in parallel (most are independent)
        const stage2 = [
            '/components/source-library.js',
            '/components/visualization-library.js',
            '/components/tag.js',
            '/components/source-tag.js',
            '/components/popup.js',
            '/components/text-card-output.js',
            '/components/visualization-card.js',
            '/components/status-bar.js',
            '/components/alert.js'
        ];

        // Load stage 1, then stage 2, then main scripts
        loadScriptsParallel(stage1)
            .then(() => loadScriptsParallel(stage2))
            .then(() => {
                // Load main JS and workflow in parallel (workflow depends on main but can start loading)
                const mainScript = document.createElement('script');
                mainScript.src = BASE_URL + '/chat-bar.js';
                mainScript.onload = () => {
                    // Load workflow automation after main JS is ready
                    const workflowScript = document.createElement('script');
                    workflowScript.src = BASE_URL + '/chat-bar-workflows.js';
                    document.body.appendChild(workflowScript);
                };
                document.body.appendChild(mainScript);
            });
    }).catch(err => {
        console.error('Chat Bar: Failed to load', err);
    });
})();

