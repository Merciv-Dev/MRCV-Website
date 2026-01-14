/**
 * Status Bar Component
 * Bottom bar showing workflow category and current action status
 * 
 * Features:
 * - Left: Category ticker with breathing/pulsing dot
 * - Right: Action status text (Analyzing, Thinking, Searching, etc.)
 * - Smooth text transitions between workflows
 */

const StatusBar = (function() {
  'use strict';

  let container = null;
  let categoryElement = null;
  let dotElement = null;
  let actionElement = null;
  let isInitialized = false;

  // ============================================
  // Initialization
  // ============================================

  function init() {
    if (isInitialized) return;

    // Find the hero-anim container or create at body level
    // Priority: #hero-anim (GitHub Pages) > .hero-anim (Webflow class) > body fallback
    const heroAnim = document.getElementById('hero-anim') || 
                     document.querySelector('.hero-anim') ||
                     document.getElementById('chat-bar')?.closest('.hero-anim') ||
                     document.body;
    

    // Create status bar container
    container = document.createElement('div');
    container.id = 'status-bar';
      container.className = 'absolute bottom-0 left-0 right-0 z-20 px-8 py-6 flex justify-between items-center pointer-events-none';
    
    container.innerHTML = `
      <!-- Left: Category Ticker with Navigation -->
      <div class="status-left inline-flex justify-start items-center gap-3">

        <!-- Category -->
        <div class="status-category inline-flex justify-start items-center gap-2.5 opacity-0 translate-y-4 transition-all duration-500">
          <div class="status-dot w-3 h-3 bg-orange-50 rounded-full"></div>
          <div class="status-category-text text-white text-base font-normal uppercase leading-5 tracking-wide" style="font-family: 'GT Pressura Mono', 'SF Mono', 'Roboto Mono', monospace;">
            <!-- Category text here -->
          </div>
        </div>
      </div>
      
      <!-- Right: Action Status -->
      <div class="status-action inline-flex justify-end items-center opacity-0 transition-all duration-300">
        <div class="status-action-text text-white/70 text-base font-normal uppercase tracking-wide" style="font-family: 'GT Pressura Mono', 'SF Mono', 'Roboto Mono', monospace;">
          <!-- Action text here -->
        </div>
      </div>
    `;

    heroAnim.appendChild(container);

    // Get references
    categoryElement = container.querySelector('.status-category');
    dotElement = container.querySelector('.status-dot');
    actionElement = container.querySelector('.status-action');

    // Setup navigation
    const prevBtn = container.querySelector('.nav-prev');
    const nextBtn = container.querySelector('.nav-next');

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigatePrev();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        navigateNext();
      });
    }

    // Inject CSS for animations
    injectStyles();

    isInitialized = true;
  }

  // ============================================
  // Navigation Functions
  // ============================================

  function navigateNext() {
    // Stop current workflow and go to next
    if (window.Workflows) {
      window.Workflows.stop();
      window.Workflows.next();
    }
  }

  function navigatePrev() {
    // Stop current workflow and go to previous
    if (window.Workflows) {
      window.Workflows.stop();
      window.Workflows.prev();
    }
  }

  function injectStyles() {
    if (document.getElementById('status-bar-styles')) return;

    const style = document.createElement('style');
    style.id = 'status-bar-styles';
    style.textContent = `
      /* Breathing/pulsing dot animation */
      @keyframes breathe {
        0%, 100% { 
          opacity: 1; 
          transform: scale(1);
        }
        50% { 
          opacity: 0.4; 
          transform: scale(0.8);
        }
      }
      
      .status-dot {
        animation: breathe 1.5s ease-in-out infinite;
      }
      
      /* Category text slide animation */
      @keyframes slideInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      
      @keyframes slideOutUp {
        from {
          opacity: 1;
          transform: translateY(0);
        }
        to {
          opacity: 0;
          transform: translateY(-20px);
        }
      }
      
      .status-category.visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .status-category.slide-out {
        animation: slideOutUp 0.3s ease-out forwards;
      }
      
      .status-category.slide-in {
        animation: slideInUp 0.4s ease-out forwards;
      }
      
      /* Action text fade */
      .status-action.visible {
        opacity: 1;
      }
      
      .status-action-text {
        transition: opacity 0.2s ease-out;
      }
      
      /* Faster breathing when active */
      .status-dot.active {
        animation: breathe 0.8s ease-in-out infinite;
      }
    `;
    document.head.appendChild(style);
  }

  // ============================================
  // Public API
  // ============================================

  /**
   * Set the category text (left side)
   * @param {string} text - Category name
   * @param {boolean} animate - Whether to animate the transition
   */
  function setCategory(text, animate = true) {
    if (!isInitialized) init();
    if (!categoryElement) return;

    const textElement = categoryElement.querySelector('.status-category-text');
    
    if (animate && categoryElement.classList.contains('visible')) {
      // Slide out current, then slide in new
      categoryElement.classList.add('slide-out');
      categoryElement.classList.remove('slide-in');
      
      setTimeout(() => {
        textElement.textContent = text;
        categoryElement.classList.remove('slide-out');
        categoryElement.classList.add('slide-in', 'visible');
      }, 300);
    } else {
      // First show or no animation
      textElement.textContent = text;
      categoryElement.classList.add('visible', 'slide-in');
    }
  }

  /**
   * Set the action status (right side)
   * @param {string} text - Action text (e.g., "Analyzing...", "Thinking...")
   */
  function setAction(text) {
    if (!isInitialized) init();
    if (!actionElement) return;

    const textElement = actionElement.querySelector('.status-action-text');
    
    if (text) {
      // Fade out, change text, fade in
      textElement.style.opacity = '0';
      
      setTimeout(() => {
        textElement.textContent = text;
        textElement.style.opacity = '1';
        actionElement.classList.add('visible');
      }, 150);
      
      // Speed up dot animation when action is active
      if (dotElement) dotElement.classList.add('active');
    } else {
      textElement.style.opacity = '0';
      actionElement.classList.remove('visible');
      if (dotElement) dotElement.classList.remove('active');
    }
  }

  /**
   * Clear action status
   */
  function clearAction() {
    setAction('');
  }

  /**
   * Hide the entire status bar
   */
  function hide() {
    if (!categoryElement || !actionElement) return;
    
    categoryElement.classList.remove('visible', 'slide-in');
    categoryElement.classList.add('slide-out');
    actionElement.classList.remove('visible');
    
    if (dotElement) dotElement.classList.remove('active');
  }

  /**
   * Show the status bar
   */
  function show() {
    if (!categoryElement) return;
    categoryElement.classList.add('visible');
  }

  // ============================================
  // Expose API
  // ============================================

  return {
    init,
    setCategory,
    setAction,
    clearAction,
    hide,
    show
  };

})();

// Expose globally
window.StatusBar = StatusBar;


