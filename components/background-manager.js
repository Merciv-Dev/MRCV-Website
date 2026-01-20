/**
 * Background Manager
 * Handles background image transitions tied to workflows
 * 
 * Features:
 * - Smooth crossfade transitions between images
 * - Preloading for seamless transitions
 * - Integration with workflow system
 */

const BackgroundManager = (function() {
  'use strict';

  let container = null;
  let currentLayer = null;
  let nextLayer = null;
  let currentIndex = 0;
  let isInitialized = false;
  let isTransitioning = false;

  // Default images from S3/CDN - can be overridden via window.WORKFLOW_IMAGES or init()
  const defaultImages = window.WORKFLOW_IMAGES ? Object.values(window.WORKFLOW_IMAGES) : [
    'https://dev-eva-public.mercivcdn.com/MRCV-Website/running.webp',
    'https://dev-eva-public.mercivcdn.com/MRCV-Website/baby.webp',
    'https://dev-eva-public.mercivcdn.com/MRCV-Website/snacking.webp',
    'https://dev-eva-public.mercivcdn.com/MRCV-Website/water.webp',
    'https://dev-eva-public.mercivcdn.com/MRCV-Website/weather.webp'
  ];

  let images = [...defaultImages];

  // ============================================
  // Configuration
  // ============================================

  const config = {
    transitionDuration: 1000, // ms for crossfade
    overlayOpacity: 0.4,      // Darkening overlay
    blur: 0,                   // Optional blur (0 = none)
  };

  // ============================================
  // Initialization
  // ============================================

  function init(options = {}) {
    if (isInitialized) return;

    // Merge options
    if (options.images) images = options.images;
    if (options.transitionDuration) config.transitionDuration = options.transitionDuration;
    if (options.overlayOpacity !== undefined) config.overlayOpacity = options.overlayOpacity;

    // Find or create the background container
    // Priority: #hero-anim (GitHub Pages) > .hero-anim (Webflow class) > #chat-bar fallback
    container = document.getElementById('hero-anim') || 
                document.querySelector('.hero-anim') ||
                document.getElementById('chat-bar')?.closest('.hero-anim') ||
                document.getElementById('chat-bar') || 
                document.querySelector('.chat-container')?.parentElement;
    

    if (!container) {
      console.warn('BackgroundManager: No container found');
      return;
    }

    // Make container a positioning context
    container.style.position = 'relative';
    container.style.overflow = 'hidden';

    // Create background layers
    createBackgroundLayers();

    // Preload all images
    preloadImages();

    // Mark as initialized BEFORE setting initial background to avoid recursion
    isInitialized = true;
    
    // Set initial background - OPTIMIZED: Set immediately, don't wait for load
    // The image is already preloaded in head code, so it should be in cache
    const firstImageUrl = getFullUrl(images[0]);
    
    // Set background image immediately (browser will use cached/preloaded image)
    currentLayer.style.backgroundImage = `url('${firstImageUrl}')`;
    
    // Show immediately if image was pre-decoded, otherwise wait briefly
    if (window.FIRST_IMAGE_DECODED) {
      // Image is already decoded - show immediately, no delay
      currentLayer.style.opacity = '1';   
    } else if (window.FIRST_IMAGE_READY) {
      // Wait for pre-decode promise (should be very fast since it's already loading)
      window.FIRST_IMAGE_READY.then(() => {
        currentLayer.style.opacity = '1';
      }).catch(() => {
        // If promise fails, show anyway (image might still be in cache)
        currentLayer.style.opacity = '1';
      });
    } else {
      // No pre-decode, but image is preloaded - show immediately
      // The browser will use the cached image from preload
      currentLayer.style.opacity = '1';
    }
    
    // No timeout fallback needed - image is preloaded, so it should show immediately

  }

  function createBackgroundLayers() {
    // Create two layers for crossfade effect
    currentLayer = createLayer('bg-layer-current');
    nextLayer = createLayer('bg-layer-next');

    // Start both layers hidden - first image will fade in
    currentLayer.style.opacity = '0';
    nextLayer.style.opacity = '0';

    // Create gradient overlay (darker at bottom for status bar)
    const overlay = document.createElement('div');
    overlay.id = 'bg-overlay';
    overlay.style.cssText = `
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.2) 60%, rgba(0, 0, 0, 1) 100%);
      pointer-events: none;
      z-index: 1;
    `;

    // Insert layers at the beginning of container
    container.insertBefore(overlay, container.firstChild);
    container.insertBefore(nextLayer, container.firstChild);
    container.insertBefore(currentLayer, container.firstChild);
  }

  function createLayer(id) {
    const layer = document.createElement('div');
    layer.id = id;
    layer.style.cssText = `
      position: absolute;
      inset: 0;
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      transition: opacity ${config.transitionDuration}ms ease-in-out;
      z-index: 0;
    `;
    if (config.blur > 0) {
      layer.style.filter = `blur(${config.blur}px)`;
    }
    return layer;
  }

  function preloadImages() {
    // Only preload images that weren't already preloaded by the loader
    // The loader preloads the first image and prefetches others
    images.forEach((src, index) => {
      const fullUrl = getFullUrl(src);
      // Check if already preloaded via <link rel="preload"> or <link rel="prefetch">
      const alreadyPreloaded = document.querySelector(`link[href="${fullUrl}"]`);
      // Also check if it's the first image (which is definitely preloaded)
      const isFirstImage = index === 0;
      if (!alreadyPreloaded && !isFirstImage) {
        // Only preload if not already preloaded and not the first image
        const img = new Image();
        img.src = fullUrl;
      }
    });
  }

  function getFullUrl(src) {
    // Handle relative vs absolute URLs
    if (src.startsWith('http') || src.startsWith('//')) {
      return src;
    }
    // For local development or GitHub Pages
    const base = window.BACKGROUND_BASE_URL || '';
    return base ? `${base}/${src}` : src;
  }

  // ============================================
  // Public API
  // ============================================

  /**
   * Set background to specific image
   * @param {number|string} indexOrUrl - Index in images array or direct URL
   * @param {boolean} animate - Whether to animate the transition
   */
  function setBackground(indexOrUrl, animate = true) {
    if (!isInitialized) init();
    if (!container) return;
    if (isTransitioning) return; // Prevent overlapping transitions

    let imageUrl;
    
    if (typeof indexOrUrl === 'number') {
      currentIndex = indexOrUrl % images.length;
      imageUrl = getFullUrl(images[currentIndex]);
    } else {
      imageUrl = getFullUrl(indexOrUrl);
    }

    if (animate) {
      isTransitioning = true;

      // Preload image first to prevent flicker
      const img = new Image();
      img.onload = () => {
        // Set image on next layer (hidden)
        nextLayer.style.backgroundImage = `url('${imageUrl}')`;

        // Force a reflow to ensure image is ready
        nextLayer.offsetHeight;

        // Now crossfade: fade in next, fade out current
        nextLayer.style.opacity = '1';
        currentLayer.style.opacity = '0';

        // After transition completes, swap layer references (no visual change)
        setTimeout(() => {
          // Swap the layer references
          const temp = currentLayer;
          currentLayer = nextLayer;
          nextLayer = temp;

          // Reset the now-hidden layer's opacity instantly (no transition)
          nextLayer.style.transition = 'none';
          nextLayer.style.opacity = '0';

          // Restore transition for next use
          requestAnimationFrame(() => {
            nextLayer.style.transition = `opacity ${config.transitionDuration}ms ease-in-out`;
            isTransitioning = false;
          });
        }, config.transitionDuration + 50);
      };

      img.onerror = () => {
        isTransitioning = false;
      };

      img.src = imageUrl;
    } else {
      // Instant set
      currentLayer.style.backgroundImage = `url('${imageUrl}')`;
      currentLayer.style.opacity = '1';
    }
  }

  /**
   * Go to next background image
   */
  function next() {
    setBackground((currentIndex + 1) % images.length);
  }

  /**
   * Go to previous background image
   */
  function prev() {
    setBackground((currentIndex - 1 + images.length) % images.length);
  }

  /**
   * Get current image index
   */
  function getCurrentIndex() {
    return currentIndex;
  }

  /**
   * Set images array
   * @param {string[]} newImages - Array of image URLs
   */
  function setImages(newImages) {
    images = newImages;
    preloadImages();
  }

  /**
   * Add an image to the rotation
   * @param {string} imageUrl - Image URL to add
   */
  function addImage(imageUrl) {
    images.push(imageUrl);
    const img = new Image();
    img.src = getFullUrl(imageUrl);
  }

  /**
   * Update configuration
   * @param {Object} newConfig - Configuration options
   */
  function configure(newConfig) {
    Object.assign(config, newConfig);
    
    if (currentLayer && newConfig.transitionDuration) {
      currentLayer.style.transition = `opacity ${config.transitionDuration}ms ease-in-out`;
      nextLayer.style.transition = `opacity ${config.transitionDuration}ms ease-in-out`;
    }
    
    const overlay = document.getElementById('bg-overlay');
    if (overlay && newConfig.overlayOpacity !== undefined) {
      overlay.style.background = `rgba(0, 0, 0, ${config.overlayOpacity})`;
    }
  }

  // ============================================
  // Expose API
  // ============================================

  return {
    init,
    setBackground,
    next,
    prev,
    getCurrentIndex,
    setImages,
    addImage,
    configure,
    get images() { return [...images]; },
    get currentIndex() { return currentIndex; },
    get isInitialized() { return isInitialized; }
  };

})();

// Expose globally
window.BackgroundManager = BackgroundManager;

// Auto-initialize immediately if container is ready
// This ensures background shows as soon as possible, not waiting for workflows
// The background manager will be initialized twice (here and in workflows), but init() checks for that
(function autoInit() {
  function tryInit() {
    if (!BackgroundManager.isInitialized) {
      const container = document.getElementById('hero-anim') || 
                        document.querySelector('.hero-anim') ||
                        document.getElementById('chat-bar')?.closest('.hero-anim');
      if (container) {
        BackgroundManager.init();
      }
    }
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', tryInit);
  } else {
    // DOM already ready - try immediately
    tryInit();
  }
})();


