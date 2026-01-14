/**
 * Visualization Card Component
 * Displays animated charts with glass-morphism styling
 * Uses Chart.js for rendering
 * 
 * Requires: visualization-library.js to be loaded first
 */

const VisualizationCard = (function() {
  'use strict';

  let container = null;
  let currentCard = null;
  let chartInstance = null;

  // Track current visualization index per workflow (for cycling)
  let workflowVizIndex = {};

  /**
   * Initialize container
   */
  function init() {
    if (container) return;

    // Find the chat bar wrapper (Webflow or local)
    const chatWrapper = document.getElementById('chat-bar') || document.querySelector('.chat-container');
    if (chatWrapper) {
      // Create container for visualization (above chat bar)
      container = document.createElement('div');
      container.id = 'visualization-card-container';
      container.className = 'w-full mb-3 flex flex-col gap-3';
      
      // Insert at the beginning of the wrapper (above chat bar)
      chatWrapper.insertBefore(container, chatWrapper.firstChild);
    } else {
      console.error('VisualizationCard: Could not find #chat-bar or .chat-container');
    }
  }

  /**
   * Get visualization by key from library
   */
  function getVisualization(key) {
    if (!window.VisualizationLibrary) {
      console.warn('VisualizationLibrary not loaded');
      return null;
    }
    return window.VisualizationLibrary.get(key);
  }

  /**
   * Get next visualization for a workflow (cycles through available ones)
   */
  function getNextWorkflowVisualization(workflowName) {
    if (!window.VisualizationLibrary) {
      console.warn('VisualizationLibrary not loaded');
      return null;
    }

    const vizKeys = window.VisualizationLibrary.forWorkflow(workflowName);

    if (!vizKeys || vizKeys.length === 0) {
      // Fallback to random general visualization
      return window.VisualizationLibrary.random();
    }

    // Initialize index if needed
    if (typeof workflowVizIndex[workflowName] === 'undefined') {
      workflowVizIndex[workflowName] = 0;
    }

    const vizKey = vizKeys[workflowVizIndex[workflowName]];

    // Increment for next time (cycle through)
    workflowVizIndex[workflowName] = (workflowVizIndex[workflowName] + 1) % vizKeys.length;

    return window.VisualizationLibrary.get(vizKey);
  }

  /**
   * Create chart card element
   */
  function create(options = {}) {
    let data;

    if (options.visualizationKey) {
      // Use specific visualization from library
      data = getVisualization(options.visualizationKey);
    } else if (options.workflowName) {
      // Get next visualization for this workflow
      data = getNextWorkflowVisualization(options.workflowName);
    } else if (options.data) {
      // Use provided data directly
      data = options.data;
    } else {
      // Fallback to random
      data = window.VisualizationLibrary ? window.VisualizationLibrary.random() : null;
    }

    if (!data) {
      console.error('VisualizationCard: No visualization data available');
      return null;
    }

    const card = document.createElement('div');
    card.className = 'visualization-card backdrop-blur-[12px] bg-neutral-99/95 border border-neutral-90 rounded-2xl shadow-lg overflow-hidden opacity-0 -translate-y-4 transition-all duration-500';

    card.innerHTML = `
      <div class="p-4">
        <div class="flex items-center justify-between mb-3">
          <h3 class="text-sm font-medium text-neutral-10">${data.title}</h3>
          <div class="flex items-center gap-2">
            <button class="viz-expand p-1 rounded-lg hover:bg-neutral-90/50 transition-colors" title="Expand">
              <span class="material-symbols-outlined text-lg text-neutral-40">open_in_full</span>
            </button>
            <button class="viz-close p-1 rounded-lg hover:bg-neutral-90/50 transition-colors" title="Close">
              <span class="material-symbols-outlined text-lg text-neutral-40">close</span>
            </button>
          </div>
        </div>
        <div class="chart-container relative" style="height: 200px;">
          <canvas class="chart-canvas"></canvas>
        </div>
        <div class="flex items-center justify-between mt-3 pt-3 border-t border-neutral-90">
          <div class="flex items-center gap-2 text-xs text-neutral-40">
            <span class="material-symbols-outlined text-sm">info</span>
            <span>Based on ${data.dataPoints || Math.floor(Math.random() * 500 + 100)} data points</span>
          </div>
          <div class="flex items-center gap-1">
            <button class="p-1.5 rounded-lg hover:bg-neutral-90/50 transition-colors" title="Download">
              <span class="material-symbols-outlined text-sm text-neutral-40">download</span>
            </button>
            <button class="p-1.5 rounded-lg hover:bg-neutral-90/50 transition-colors" title="Share">
              <span class="material-symbols-outlined text-sm text-neutral-40">share</span>
            </button>
          </div>
        </div>
      </div>
    `;

    // Store chart data for later rendering
    card._chartData = data;

    // Add close handler
    card.querySelector('.viz-close').addEventListener('click', () => hide());

    return card;
  }

  /**
   * Render chart using Chart.js
   */
  function renderChart(cardElement) {
    const canvas = cardElement.querySelector('.chart-canvas');
    const data = cardElement._chartData;

    if (!canvas || !data || !window.Chart) {
      console.warn('Chart.js not loaded or missing data');
      return;
    }

    // Destroy existing chart
    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');

    // Chart.js configuration with animations
    const config = {
      type: data.type,
      data: {
        labels: data.labels,
        datasets: data.datasets
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: {
          duration: 500,
          easing: 'easeOutQuart',
          delay: (context) => context.dataIndex * 100
        },
        plugins: {
          legend: {
            display: data.type !== 'doughnut',
            position: 'bottom',
            labels: {
              usePointStyle: true,
              padding: 15,
              font: { family: 'DM Sans', size: 11 },
              color: '#666560'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(250, 249, 245, 0.95)',
            titleColor: '#0D0D0C',
            bodyColor: '#666560',
            borderColor: 'rgba(0, 0, 0, 0.05)',
            borderWidth: 1,
            cornerRadius: 8,
            padding: 12,
            titleFont: { family: 'DM Sans', weight: '500' },
            bodyFont: { family: 'DM Sans' }
          }
        },
        scales: getScalesConfig(data)
      }
    };

    chartInstance = new Chart(ctx, config);
  }

  /**
   * Get scales configuration based on chart type
   */
  function getScalesConfig(data) {
    // No scales for doughnut
    if (data.type === 'doughnut') {
      return {};
    }

    // Special config for scatter charts
    if (data.type === 'scatter') {
      return {
        x: {
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            font: { family: 'DM Sans', size: 11 },
            color: '#666560'
          },
          title: {
            display: true,
            text: 'Score',
            font: { family: 'DM Sans', size: 11 },
            color: '#666560'
          }
        },
        y: {
          grid: { color: 'rgba(0, 0, 0, 0.05)' },
          ticks: {
            font: { family: 'DM Sans', size: 11 },
            color: '#666560'
          },
          title: {
            display: true,
            text: 'Engagement',
            font: { family: 'DM Sans', size: 11 },
            color: '#666560'
          }
        }
      };
    }

    // Standard config for line/bar charts
    const scales = {
      x: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          font: { family: 'DM Sans', size: 11 },
          color: '#666560'
        }
      },
      y: {
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: {
          font: { family: 'DM Sans', size: 11 },
          color: '#666560'
        }
      }
    };

    // Add secondary y-axis if needed (e.g., weather impact chart)
    if (data.datasets.some(d => d.yAxisID === 'y1')) {
      scales.y1 = {
        type: 'linear',
        display: true,
        position: 'right',
        grid: { drawOnChartArea: false },
        ticks: {
          font: { family: 'DM Sans', size: 11 },
          color: '#666560'
        }
      };
    }

    return scales;
  }

  /**
   * Show visualization card
   */
  function show(options = {}) {
    init();

    // Hide current card if exists
    if (currentCard) {
      currentCard.remove();
    }

    currentCard = create(options);
    
    if (!currentCard) return null;

    // Set initial state for smooth height animation
    currentCard.style.maxHeight = '0';
    currentCard.style.overflow = 'hidden';
    
    container.appendChild(currentCard);

    // Animate in with height growth
    requestAnimationFrame(() => {
      currentCard.style.maxHeight = '400px'; // Generous max height
      currentCard.classList.remove('opacity-0', '-translate-y-4');
      currentCard.classList.add('opacity-100', 'translate-y-0');

      // Render chart after animation starts
      setTimeout(() => {
        renderChart(currentCard);
      }, 300);
    });

    return currentCard;
  }

  /**
   * Hide visualization card with smooth height collapse
   */
  function hide() {
    if (!currentCard) return;

    // Animate height collapse for smooth exit
    currentCard.style.maxHeight = '0';
    currentCard.style.marginBottom = '0';
    currentCard.style.padding = '0';
    currentCard.classList.remove('opacity-100', 'translate-y-0');
    currentCard.classList.add('opacity-0', '-translate-y-4');

    setTimeout(() => {
      if (currentCard) {
        currentCard.remove();
        currentCard = null;
      }
      if (chartInstance) {
        chartInstance.destroy();
        chartInstance = null;
      }
    }, 500);
  }

  /**
   * Clear all visualizations
   */
  function clear() {
    if (container) {
      container.innerHTML = '';
    }
    currentCard = null;
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
    }
  }

  /**
   * Reset workflow visualization indices (start from beginning)
   */
  function resetWorkflowIndices() {
    workflowVizIndex = {};
  }

  /**
   * Check if Chart.js is loaded, if not, load it
   */
  function ensureChartJS() {
    return new Promise((resolve) => {
      if (window.Chart) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js';
      script.onload = () => {
        console.log('📊 Chart.js loaded');
        resolve();
      };
      document.head.appendChild(script);
    });
  }

  // Initialize on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ensureChartJS());
  } else {
    ensureChartJS();
  }

  return {
    init,
    create,
    show,
    hide,
    clear,
    ensureChartJS,
    getVisualization,
    getNextWorkflowVisualization,
    resetWorkflowIndices
  };
})();

// Expose globally
window.VisualizationCard = VisualizationCard;
console.log('📊 VisualizationCard component loaded');
