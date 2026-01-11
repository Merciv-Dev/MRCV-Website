/**
 * TextCardOutput Component
 * Animated text output card that simulates AI-generated text
 * Shows sources first, then animates text lines
 */

const TextCardOutput = (function() {
  'use strict';

  let container = null;
  let currentCard = null;

  // Line width variations (percentages)
  const lineWidths = [95, 88, 92, 75, 85, 90, 60, 82, 78, 95, 70, 88];

  /**
   * Get random sources from the library
   * @param {number} count - Number of sources to get
   * @returns {string[]} - Array of source IDs
   */
  function getRandomSources(count = 5) {
    if (!window.SourceLibrary) {
      return ['mintel', 'kantar', 'nielsen', 'snowflake']; // Fallback
    }
    
    const allSources = window.SourceLibrary.getAllSources();
    const shuffled = [...allSources].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, count).map(s => s.id);
  }

  /**
   * Initialize the output container
   */
  function init() {
    if (!container) {
      container = document.createElement('div');
      container.id = 'text-card-output-container';
      container.className = 'w-full mt-3 flex flex-col gap-3';
      
      const wrapper = document.querySelector('body > div') || document.querySelector('.max-w-\\[520px\\]');
      if (wrapper) {
        wrapper.appendChild(container);
      }
    }
    return container;
  }

  /**
   * Create source tags section
   * @param {string[]} sources - Array of source IDs
   * @returns {HTMLElement}
   */
  function createSourcesSection(sources) {
    const section = document.createElement('div');
    section.className = 'sources-section mb-3 opacity-0 transition-all duration-300';
    
    // Label
    const label = document.createElement('div');
    label.className = 'text-xs text-neutral-40 mb-2 flex items-center gap-1';
    label.innerHTML = '<span class="material-symbols-outlined text-[14px]">search</span> Searching sources...';
    section.appendChild(label);
    
    // Sources wrapper
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-wrap gap-2';
    
    sources.forEach((sourceId, index) => {
      if (window.SourceTag) {
        const tag = window.SourceTag.create(sourceId);
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        tag.style.transition = 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)';
        tag.style.transitionDelay = `${index * 100}ms`;
        wrapper.appendChild(tag);
      }
    });
    
    section.appendChild(wrapper);
    return section;
  }

  /**
   * Create animated skeleton lines
   * @param {number} lineCount - Number of lines to create
   * @returns {HTMLElement}
   */
  function createSkeletonLines(lineCount = 8) {
    const wrapper = document.createElement('div');
    wrapper.className = 'skeleton-section flex flex-col gap-2 opacity-0 transition-all duration-300';

    // Label
    const label = document.createElement('div');
    label.className = 'text-xs text-neutral-40 mb-2 flex items-center gap-1';
    label.innerHTML = '<span class="material-symbols-outlined text-[14px]">auto_awesome</span> Generating response...';
    wrapper.appendChild(label);

    // Lines container
    const linesContainer = document.createElement('div');
    linesContainer.className = 'flex flex-col gap-2';

    for (let i = 0; i < lineCount; i++) {
      const line = document.createElement('div');
      const width = lineWidths[i % lineWidths.length];
      
      line.className = 'skeleton-line h-3 bg-neutral-90 rounded-full opacity-0';
      line.style.width = '0%';
      line.style.maxWidth = `${width}%`;
      
      linesContainer.appendChild(line);
    }

    wrapper.appendChild(linesContainer);
    return wrapper;
  }

  /**
   * Create a text card output
   * @param {Object} options
   * @param {string} options.prompt - The original prompt
   * @param {string[]} options.sources - Source IDs to show
   * @param {number} options.lines - Number of skeleton lines
   * @param {number} options.sourceDelay - Delay before showing sources (ms)
   * @param {number} options.textDelay - Delay before showing text (ms after sources)
   * @returns {HTMLElement}
   */
  function create(options = {}) {
    const { 
      prompt = '', 
      sources = getRandomSources(4), // Random 4 sources from library
      lines = 8,
      sourceDelay = 300,
      textDelay = 2000
    } = options;

    const card = document.createElement('div');
    card.className = 'text-card-output bg-neutral-99 border border-neutral-90 rounded-2xl shadow-lg overflow-hidden opacity-0 translate-y-2 transition-all duration-300';
    
    // Build card structure
    const content = document.createElement('div');
    content.className = 'max-h-[300px] overflow-y-auto p-4';
    
    // Prompt section (always visible)
    if (prompt) {
      const promptSection = document.createElement('div');
      promptSection.className = 'text-base text-neutral-10 font-medium mb-4 pb-3 border-b border-neutral-90';
      promptSection.textContent = prompt;
      content.appendChild(promptSection);
    }
    
    // Sources section
    const sourcesSection = createSourcesSection(sources);
    content.appendChild(sourcesSection);
    
    // Skeleton lines section
    const skeletonSection = createSkeletonLines(lines);
    content.appendChild(skeletonSection);
    
    card.appendChild(content);
    
    // Store options for animation
    card._options = { sourceDelay, textDelay };

    return card;
  }

  /**
   * Animate the sources appearing
   * @param {HTMLElement} card
   */
  function animateSources(card) {
    const sourcesSection = card.querySelector('.sources-section');
    if (!sourcesSection) return;

    // Show sources section
    sourcesSection.classList.remove('opacity-0');
    sourcesSection.classList.add('opacity-100');

    // Animate each tag
    const tags = sourcesSection.querySelectorAll('.source-tag');
    tags.forEach(tag => {
      tag.style.opacity = '1';
      tag.style.transform = 'scale(1)';
    });
  }

  /**
   * Animate the skeleton text lines
   * @param {HTMLElement} card
   */
  function animateTextLines(card) {
    const skeletonSection = card.querySelector('.skeleton-section');
    if (!skeletonSection) return;

    // Update sources label
    const sourcesLabel = card.querySelector('.sources-section .text-xs');
    if (sourcesLabel) {
      sourcesLabel.innerHTML = '<span class="material-symbols-outlined text-[14px]">check_circle</span> Sources found';
      sourcesLabel.classList.add('text-green-600');
    }

    // Show skeleton section
    skeletonSection.classList.remove('opacity-0');
    skeletonSection.classList.add('opacity-100');

    // Animate each line
    const lines = skeletonSection.querySelectorAll('.skeleton-line');
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.classList.remove('opacity-0');
        line.classList.add('opacity-100', 'animate-skeleton');
        line.style.width = line.style.maxWidth;
      }, i * 80);
    });
  }

  /**
   * Show the text card with animation sequence
   * @param {Object} options
   * @returns {HTMLElement}
   */
  function show(options = {}) {
    init();

    // Remove any existing card
    if (currentCard) {
      currentCard.remove();
    }

    // Create new card
    currentCard = create(options);
    container.appendChild(currentCard);

    const { sourceDelay = 300, textDelay = 2000 } = options;

    // Animation sequence
    requestAnimationFrame(() => {
      // 1. Show card
      currentCard.classList.remove('opacity-0', 'translate-y-2');
      currentCard.classList.add('opacity-100', 'translate-y-0');
      
      // 2. Show sources after delay
      setTimeout(() => {
        animateSources(currentCard);
        
        // 3. Show text lines after sources
        setTimeout(() => {
          animateTextLines(currentCard);
        }, textDelay);
      }, sourceDelay);
    });

    return currentCard;
  }

  /**
   * Hide and remove the current card
   */
  function hide() {
    if (currentCard) {
      currentCard.classList.add('opacity-0', 'translate-y-2');
      setTimeout(() => {
        if (currentCard) {
          currentCard.remove();
          currentCard = null;
        }
      }, 300);
    }
  }

  /**
   * Clear all output cards
   */
  function clear() {
    if (container) {
      container.innerHTML = '';
      currentCard = null;
    }
  }

  // Inject required styles
  function injectStyles() {
    if (document.getElementById('text-card-output-styles')) return;

    const style = document.createElement('style');
    style.id = 'text-card-output-styles';
    style.textContent = `
      @keyframes skeletonShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }

      .skeleton-line {
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .skeleton-line.animate-skeleton {
        background: linear-gradient(
          90deg,
          #e5e5df 0%,
          #f2f2ed 50%,
          #e5e5df 100%
        );
        background-size: 200% 100%;
        animation: skeletonShimmer 1.5s ease-in-out infinite;
      }

      .text-green-600 {
        color: #16a34a;
      }
    `;
    document.head.appendChild(style);
  }

  // Auto-inject styles
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectStyles);
  } else {
    injectStyles();
  }

  // Public API
  return {
    init,
    create,
    show,
    hide,
    clear,
    // Expose animation functions for manual control
    animateSources,
    animateTextLines
  };

})();

// Expose globally
window.TextCardOutput = TextCardOutput;

console.log('📝 TextCardOutput component loaded');
