/**
 * Visualization Card Component
 * Displays animated charts with glass-morphism styling
 * Uses Chart.js for rendering
 */

const VisualizationCard = (function() {
  'use strict';

  let container = null;
  let currentCard = null;
  let chartInstance = null;

  // Sample data generators for demo
  const sampleDatasets = {
    trend: () => ({
      title: 'Market Trend Analysis',
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'This Year',
        data: [65, 72, 78, 85, 82, 90],
        borderColor: '#ED4421',
        backgroundColor: 'rgba(237, 68, 33, 0.1)',
        tension: 0.4,
        fill: true
      }, {
        label: 'Last Year',
        data: [55, 60, 65, 70, 68, 75],
        borderColor: '#29B6F6',
        backgroundColor: 'rgba(41, 182, 246, 0.1)',
        tension: 0.4,
        fill: true
      }]
    }),
    comparison: () => ({
      title: 'Category Performance',
      type: 'bar',
      labels: ['Footwear', 'Apparel', 'Accessories', 'Sports'],
      datasets: [{
        label: 'Revenue ($M)',
        data: [42, 65, 28, 51],
        backgroundColor: [
          'rgba(237, 68, 33, 0.8)',
          'rgba(41, 182, 246, 0.8)',
          'rgba(141, 220, 184, 0.8)',
          'rgba(255, 202, 40, 0.8)'
        ],
        borderRadius: 8
      }]
    }),
    scatter: () => ({
      title: 'Consumer Sentiment Analysis',
      type: 'scatter',
      datasets: [{
        label: 'Positive',
        data: Array.from({ length: 15 }, () => ({
          x: Math.random() * 80 + 10,
          y: Math.random() * 40 + 50
        })),
        backgroundColor: 'rgba(141, 220, 184, 0.8)',
        pointRadius: 8
      }, {
        label: 'Neutral',
        data: Array.from({ length: 10 }, () => ({
          x: Math.random() * 60 + 20,
          y: Math.random() * 30 + 30
        })),
        backgroundColor: 'rgba(255, 202, 40, 0.8)',
        pointRadius: 6
      }, {
        label: 'Negative',
        data: Array.from({ length: 5 }, () => ({
          x: Math.random() * 40 + 5,
          y: Math.random() * 20 + 5
        })),
        backgroundColor: 'rgba(237, 68, 33, 0.8)',
        pointRadius: 5
      }]
    }),
    doughnut: () => ({
      title: 'Market Share Distribution',
      type: 'doughnut',
      labels: ['Brand A', 'Brand B', 'Brand C', 'Others'],
      datasets: [{
        data: [35, 28, 22, 15],
        backgroundColor: [
          'rgba(237, 68, 33, 0.9)',
          'rgba(41, 182, 246, 0.9)',
          'rgba(141, 220, 184, 0.9)',
          'rgba(102, 101, 96, 0.5)'
        ],
        borderWidth: 0,
        spacing: 2
      }]
    })
  };

  /**
   * Initialize container
   */
  function init() {
    if (container) return;

    // Find the chat bar wrapper
    const chatWrapper = document.querySelector('.max-w-\\[520px\\]');
    if (chatWrapper) {
      // Create container for visualization (above chat bar)
      container = document.createElement('div');
      container.id = 'visualization-card-container';
      container.className = 'w-full mb-3 flex flex-col gap-3';
      
      // Insert at the beginning of the wrapper (above chat bar)
      chatWrapper.insertBefore(container, chatWrapper.firstChild);
    }
  }

  /**
   * Get random chart type
   */
  function getRandomChartType() {
    const types = Object.keys(sampleDatasets);
    return types[Math.floor(Math.random() * types.length)];
  }

  /**
   * Create chart card element
   */
  function create(options = {}) {
    const chartType = options.chartType || getRandomChartType();
    const data = options.data || sampleDatasets[chartType]();

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
            <span>Based on ${Math.floor(Math.random() * 500 + 100)} data points</span>
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
          duration: 1500,
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
        scales: data.type === 'doughnut' ? {} : {
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
        }
      }
    };

    chartInstance = new Chart(ctx, config);
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
    container.appendChild(currentCard);

    // Animate in
    requestAnimationFrame(() => {
      currentCard.classList.remove('opacity-0', '-translate-y-4');
      currentCard.classList.add('opacity-100', 'translate-y-0');

      // Render chart after animation starts
      setTimeout(() => {
        renderChart(currentCard);
      }, 200);
    });

    return currentCard;
  }

  /**
   * Hide visualization card
   */
  function hide() {
    if (!currentCard) return;

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
    sampleDatasets
  };
})();

// Expose globally
window.VisualizationCard = VisualizationCard;
console.log('📊 VisualizationCard component loaded');

