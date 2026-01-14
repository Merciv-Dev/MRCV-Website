/**
 * Visualization Library
 * A collection of pre-configured chart data for different workflows
 * 
 * Each visualization includes:
 * - title: Display title for the chart
 * - type: Chart.js chart type (line, bar, doughnut, scatter)
 * - labels: X-axis labels (for line/bar charts)
 * - datasets: Chart.js dataset configuration
 * - dataPoints: Number of data points (for display)
 */

const VisualizationLibrary = (function() {
  'use strict';

  // ============================================
  // Color Palette
  // ============================================
  
  const colors = {
    orange: { solid: '#ED4421', fill: 'rgba(237, 68, 33, 0.1)', bar: 'rgba(237, 68, 33, 0.8)', pie: 'rgba(237, 68, 33, 0.9)' },
    blue: { solid: '#29B6F6', fill: 'rgba(41, 182, 246, 0.1)', bar: 'rgba(41, 182, 246, 0.8)', pie: 'rgba(41, 182, 246, 0.9)' },
    green: { solid: '#8DDCB8', fill: 'rgba(141, 220, 184, 0.1)', bar: 'rgba(141, 220, 184, 0.8)', pie: 'rgba(141, 220, 184, 0.9)' },
    yellow: { solid: '#FFCA28', fill: 'rgba(255, 202, 40, 0.1)', bar: 'rgba(255, 202, 40, 0.8)', pie: 'rgba(255, 202, 40, 0.9)' },
    purple: { solid: '#BA68C8', fill: 'rgba(186, 104, 200, 0.1)', bar: 'rgba(186, 104, 200, 0.8)', pie: 'rgba(186, 104, 200, 0.9)' },
    gray: { solid: '#666560', fill: 'rgba(102, 101, 96, 0.1)', bar: 'rgba(102, 101, 96, 0.6)', pie: 'rgba(102, 101, 96, 0.5)' }
  };

  // ============================================
  // Visualization Definitions
  // ============================================

  const library = {

    // ----------------------------------------
    // RUNNING SHOES / ATHLETIC FOOTWEAR
    // ----------------------------------------

    runningTrends: {
      title: 'Running Shoe Trends Q2 2026',
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'Trail Running',
        data: [42, 48, 55, 62, 68, 75],
        borderColor: colors.orange.solid,
        backgroundColor: colors.orange.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Road Running',
        data: [65, 68, 72, 70, 74, 78],
        borderColor: colors.blue.solid,
        backgroundColor: colors.blue.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Minimalist',
        data: [25, 28, 32, 38, 45, 52],
        borderColor: colors.green.solid,
        backgroundColor: colors.green.fill,
        tension: 0.4,
        fill: true
      }],
      dataPoints: 1247
    },

    runningBrandShare: {
      title: 'Athletic Footwear Market Share',
      type: 'doughnut',
      labels: ['Nike', 'Adidas', 'New Balance', 'ASICS', 'Brooks', 'Others'],
      datasets: [{
        data: [28, 22, 15, 12, 10, 13],
        backgroundColor: [
          colors.orange.pie,
          colors.blue.pie,
          colors.green.pie,
          colors.yellow.pie,
          colors.purple.pie,
          colors.gray.pie
        ],
        borderWidth: 0,
        spacing: 2
      }],
      dataPoints: 892
    },

    runningPerformance: {
      title: 'Running Shoe Category Performance',
      type: 'bar',
      labels: ['Trail', 'Road', 'Track', 'Cross-Training', 'Walking'],
      datasets: [{
        label: 'Revenue Growth %',
        data: [24, 18, 12, 15, 8],
        backgroundColor: [
          colors.orange.bar,
          colors.blue.bar,
          colors.green.bar,
          colors.yellow.bar,
          colors.purple.bar
        ],
        borderRadius: 8
      }],
      dataPoints: 634
    },

    // ----------------------------------------
    // BABY PRODUCTS / CHILDCARE
    // ----------------------------------------

    // Connected Nursery Tech - Smart devices and premium adoption
    connectedNurseryAdoption: {
      title: 'Connected Nursery Tech Adoption Rate',
      type: 'line',
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
      datasets: [{
        label: 'Smart Monitors',
        data: [18, 24, 32, 45, 58, 72],
        borderColor: colors.orange.solid,
        backgroundColor: colors.orange.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Connected Feeding',
        data: [8, 12, 18, 26, 35, 47],
        borderColor: colors.blue.solid,
        backgroundColor: colors.blue.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Smart Sleep Aids',
        data: [12, 16, 22, 31, 42, 55],
        borderColor: colors.green.solid,
        backgroundColor: colors.green.fill,
        tension: 0.4,
        fill: true
      }],
      dataPoints: 4892,
      xAxisLabel: 'Quarter',
      yAxisLabel: 'Adoption %'
    },

    premiumAttributes: {
      title: 'Premium Adoption Drivers',
      type: 'bar',
      labels: ['App Connectivity', 'AI Features', 'Video Quality', 'Battery Life', 'Safety Sensors', 'Design'],
      datasets: [{
        label: 'Purchase Influence Score',
        data: [92, 87, 84, 78, 95, 62],
        backgroundColor: [
          colors.orange.bar,
          colors.blue.bar,
          colors.purple.bar,
          colors.green.bar,
          colors.yellow.bar,
          colors.gray.bar
        ],
        borderRadius: 8
      }],
      dataPoints: 2847,
      xAxisLabel: 'Product Attribute',
      yAxisLabel: 'Influence Score'
    },

    smartNurserySpend: {
      title: 'Connected Nursery Spend by Income Segment',
      type: 'scatter',
      datasets: [{
        label: 'High Income ($150K+)',
        data: [
          { x: 85, y: 420 }, { x: 90, y: 480 }, { x: 88, y: 450 },
          { x: 92, y: 510 }, { x: 87, y: 440 }, { x: 91, y: 490 },
          { x: 86, y: 430 }, { x: 89, y: 470 }
        ],
        backgroundColor: colors.green.bar,
        pointRadius: 8
      }, {
        label: 'Mid-High ($100-150K)',
        data: [
          { x: 72, y: 280 }, { x: 68, y: 250 }, { x: 75, y: 310 },
          { x: 70, y: 265 }, { x: 74, y: 295 }, { x: 69, y: 255 }
        ],
        backgroundColor: colors.blue.bar,
        pointRadius: 7
      }, {
        label: 'Middle ($60-100K)',
        data: [
          { x: 45, y: 140 }, { x: 52, y: 175 }, { x: 48, y: 155 },
          { x: 55, y: 190 }, { x: 50, y: 165 }
        ],
        backgroundColor: colors.yellow.bar,
        pointRadius: 6
      }, {
        label: 'Budget (<$60K)',
        data: [
          { x: 22, y: 65 }, { x: 28, y: 85 }, { x: 25, y: 75 }
        ],
        backgroundColor: colors.gray.bar,
        pointRadius: 5
      }],
      dataPoints: 3156,
      xAxisLabel: 'Tech Adoption Index',
      yAxisLabel: 'Avg Spend ($)'
    },

    // ----------------------------------------
    // WEATHER / OUTDOOR APPAREL
    // ----------------------------------------

    weatherImpact: {
      title: 'Weather Impact on Outdoor Apparel Sales',
      type: 'line',
      labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
      datasets: [{
        label: 'Rain Gear Sales',
        data: [32, 78, 85, 42, 95, 68],
        borderColor: colors.blue.solid,
        backgroundColor: colors.blue.fill,
        tension: 0.3,
        fill: true
      }, {
        label: 'Precipitation (mm)',
        data: [10, 45, 52, 15, 62, 38],
        borderColor: colors.gray.solid,
        backgroundColor: 'transparent',
        tension: 0.3,
        borderDash: [5, 5],
        yAxisID: 'y1'
      }],
      dataPoints: 724
    },

    seasonalApparel: {
      title: 'Seasonal Apparel Performance',
      type: 'bar',
      labels: ['Spring', 'Summer', 'Fall', 'Winter'],
      datasets: [{
        label: 'Jackets',
        data: [45, 22, 68, 95],
        backgroundColor: colors.orange.bar,
        borderRadius: 4
      }, {
        label: 'Layering',
        data: [52, 28, 74, 88],
        backgroundColor: colors.blue.bar,
        borderRadius: 4
      }, {
        label: 'Base Layers',
        data: [38, 15, 55, 82],
        backgroundColor: colors.green.bar,
        borderRadius: 4
      }],
      dataPoints: 1456
    },

    outdoorBrandMix: {
      title: 'Outdoor Apparel Brand Distribution',
      type: 'doughnut',
      labels: ['Patagonia', 'North Face', 'Columbia', 'Arc\'teryx', 'REI', 'Others'],
      datasets: [{
        data: [24, 21, 18, 14, 11, 12],
        backgroundColor: [
          colors.orange.pie,
          colors.blue.pie,
          colors.green.pie,
          colors.yellow.pie,
          colors.purple.pie,
          colors.gray.pie
        ],
        borderWidth: 0,
        spacing: 2
      }],
      dataPoints: 567
    },

    temperatureCorrelation: {
      title: 'Temperature vs. Jacket Sales Correlation',
      type: 'scatter',
      datasets: [{
        label: 'Heavy Jackets',
        data: [
          { x: -5, y: 95 }, { x: 0, y: 88 }, { x: 5, y: 75 },
          { x: 10, y: 58 }, { x: 15, y: 42 }, { x: 20, y: 25 },
          { x: 25, y: 12 }, { x: 30, y: 5 }, { x: -10, y: 98 },
          { x: 2, y: 82 }, { x: 8, y: 65 }, { x: 18, y: 32 }
        ],
        backgroundColor: colors.blue.bar,
        pointRadius: 8
      }, {
        label: 'Light Jackets',
        data: [
          { x: 5, y: 35 }, { x: 10, y: 65 }, { x: 15, y: 82 },
          { x: 20, y: 75 }, { x: 25, y: 48 }, { x: 12, y: 72 },
          { x: 18, y: 78 }, { x: 22, y: 62 }, { x: 8, y: 55 }
        ],
        backgroundColor: colors.green.bar,
        pointRadius: 7
      }],
      dataPoints: 892
    },

    // ----------------------------------------
    // SNACKING / AT-HOME CONSUMPTION
    // ----------------------------------------

    snackingBehaviors: {
      title: 'At-Home Snacking Behavior Shifts',
      type: 'bar',
      labels: ['Morning', 'Mid-Morning', 'Afternoon', 'Evening', 'Late Night'],
      datasets: [{
        label: '2024',
        data: [18, 24, 42, 55, 28],
        backgroundColor: colors.blue.bar,
        borderRadius: 4
      }, {
        label: '2025',
        data: [22, 32, 48, 62, 38],
        backgroundColor: colors.orange.bar,
        borderRadius: 4
      }],
      dataPoints: 4521
    },

    snackingCategories: {
      title: 'Snack Category Growth',
      type: 'line',
      labels: ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'],
      datasets: [{
        label: 'Better-For-You',
        data: [45, 52, 58, 65, 74, 85],
        borderColor: colors.green.solid,
        backgroundColor: colors.green.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Indulgent',
        data: [78, 80, 82, 79, 81, 83],
        borderColor: colors.purple.solid,
        backgroundColor: colors.purple.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Functional',
        data: [32, 38, 45, 52, 62, 72],
        borderColor: colors.orange.solid,
        backgroundColor: colors.orange.fill,
        tension: 0.4,
        fill: true
      }],
      dataPoints: 2847
    },

    snackingOccasions: {
      title: 'Snacking Occasion Mix',
      type: 'doughnut',
      labels: ['Entertainment', 'Work-from-Home', 'Stress Relief', 'Energy Boost', 'Social', 'Other'],
      datasets: [{
        data: [28, 24, 18, 14, 10, 6],
        backgroundColor: [
          colors.orange.pie,
          colors.blue.pie,
          colors.purple.pie,
          colors.green.pie,
          colors.yellow.pie,
          colors.gray.pie
        ],
        borderWidth: 0,
        spacing: 2
      }],
      dataPoints: 1892
    },

    snackingInnovation: {
      title: 'Product Innovation Drivers',
      type: 'bar',
      labels: ['Protein Content', 'Low Sugar', 'Plant-Based', 'Portion Control', 'Exotic Flavors', 'Clean Label'],
      datasets: [{
        label: 'Consumer Interest Score',
        data: [82, 78, 65, 58, 52, 71],
        backgroundColor: [
          colors.orange.bar,
          colors.green.bar,
          colors.green.bar,
          colors.blue.bar,
          colors.purple.bar,
          colors.yellow.bar
        ],
        borderRadius: 8
      }],
      dataPoints: 3156
    },

    // ----------------------------------------
    // BEVERAGE / HYDRATION
    // ----------------------------------------

    beverageHydration: {
      title: 'Daily Hydration Patterns',
      type: 'line',
      labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
      datasets: [{
        label: 'Water',
        data: [35, 65, 78, 82, 68, 45],
        borderColor: colors.blue.solid,
        backgroundColor: colors.blue.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Functional Beverages',
        data: [12, 42, 38, 55, 32, 18],
        borderColor: colors.green.solid,
        backgroundColor: colors.green.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Traditional Soft Drinks',
        data: [8, 22, 45, 52, 48, 28],
        borderColor: colors.orange.solid,
        backgroundColor: colors.orange.fill,
        tension: 0.4,
        fill: true
      }],
      dataPoints: 5234
    },

    beverageAttributes: {
      title: 'Product Attributes Driving Consumption',
      type: 'bar',
      labels: ['Low/No Sugar', 'Electrolytes', 'Natural Ingredients', 'Caffeine', 'Vitamins', 'Flavor Variety'],
      datasets: [{
        label: 'Purchase Driver Score',
        data: [88, 72, 68, 62, 55, 48],
        backgroundColor: [
          colors.green.bar,
          colors.blue.bar,
          colors.green.bar,
          colors.orange.bar,
          colors.yellow.bar,
          colors.purple.bar
        ],
        borderRadius: 8
      }],
      dataPoints: 2891
    },

    beverageCategories: {
      title: 'Beverage Category Performance',
      type: 'doughnut',
      labels: ['Enhanced Water', 'Energy Drinks', 'RTD Coffee/Tea', 'Sparkling Water', 'Sports Drinks', 'Juice'],
      datasets: [{
        data: [24, 22, 18, 16, 12, 8],
        backgroundColor: [
          colors.blue.pie,
          colors.orange.pie,
          colors.yellow.pie,
          colors.green.pie,
          colors.purple.pie,
          colors.gray.pie
        ],
        borderWidth: 0,
        spacing: 2
      }],
      dataPoints: 1567
    },

    beverageHabits: {
      title: 'Habitual Consumption Trends',
      type: 'scatter',
      datasets: [{
        label: 'Daily Users',
        data: [
          { x: 85, y: 92 }, { x: 78, y: 88 }, { x: 82, y: 95 },
          { x: 90, y: 87 }, { x: 76, y: 91 }, { x: 88, y: 89 },
          { x: 84, y: 94 }, { x: 79, y: 86 }, { x: 87, y: 93 }
        ],
        backgroundColor: colors.green.bar,
        pointRadius: 8
      }, {
        label: 'Weekly Users',
        data: [
          { x: 55, y: 62 }, { x: 62, y: 58 }, { x: 48, y: 65 },
          { x: 58, y: 55 }, { x: 52, y: 68 }, { x: 65, y: 52 }
        ],
        backgroundColor: colors.blue.bar,
        pointRadius: 7
      }, {
        label: 'Occasional Users',
        data: [
          { x: 28, y: 35 }, { x: 35, y: 28 }, { x: 32, y: 42 },
          { x: 38, y: 32 }, { x: 25, y: 38 }
        ],
        backgroundColor: colors.yellow.bar,
        pointRadius: 6
      }],
      dataPoints: 3421
    },

    // ----------------------------------------
    // GENERAL / FALLBACK VISUALIZATIONS
    // ----------------------------------------

    marketTrend: {
      title: 'Market Trend Analysis',
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [{
        label: 'This Year',
        data: [65, 72, 78, 85, 82, 90],
        borderColor: colors.orange.solid,
        backgroundColor: colors.orange.fill,
        tension: 0.4,
        fill: true
      }, {
        label: 'Last Year',
        data: [55, 60, 65, 70, 68, 75],
        borderColor: colors.blue.solid,
        backgroundColor: colors.blue.fill,
        tension: 0.4,
        fill: true
      }],
      dataPoints: 458
    },

    categoryPerformance: {
      title: 'Category Performance',
      type: 'bar',
      labels: ['Footwear', 'Apparel', 'Accessories', 'Sports'],
      datasets: [{
        label: 'Revenue ($M)',
        data: [42, 65, 28, 51],
        backgroundColor: [
          colors.orange.bar,
          colors.blue.bar,
          colors.green.bar,
          colors.yellow.bar
        ],
        borderRadius: 8
      }],
      dataPoints: 312
    },

    consumerSentiment: {
      title: 'Consumer Sentiment Analysis',
      type: 'scatter',
      datasets: [{
        label: 'Positive',
        data: [
          { x: 75, y: 85 }, { x: 82, y: 78 }, { x: 68, y: 92 },
          { x: 88, y: 72 }, { x: 71, y: 88 }, { x: 85, y: 80 },
          { x: 79, y: 86 }, { x: 90, y: 75 }, { x: 65, y: 82 },
          { x: 77, y: 90 }, { x: 84, y: 77 }, { x: 72, y: 83 },
          { x: 80, y: 89 }, { x: 87, y: 74 }, { x: 69, y: 87 }
        ],
        backgroundColor: colors.green.bar,
        pointRadius: 8
      }, {
        label: 'Neutral',
        data: [
          { x: 45, y: 52 }, { x: 55, y: 48 }, { x: 38, y: 58 },
          { x: 62, y: 42 }, { x: 50, y: 55 }, { x: 48, y: 50 },
          { x: 58, y: 45 }, { x: 42, y: 60 }, { x: 52, y: 47 },
          { x: 46, y: 53 }
        ],
        backgroundColor: colors.yellow.bar,
        pointRadius: 6
      }, {
        label: 'Negative',
        data: [
          { x: 15, y: 22 }, { x: 25, y: 18 }, { x: 12, y: 28 },
          { x: 30, y: 15 }, { x: 20, y: 24 }
        ],
        backgroundColor: colors.orange.bar,
        pointRadius: 5
      }],
      dataPoints: 245
    },

    marketShare: {
      title: 'Market Share Distribution',
      type: 'doughnut',
      labels: ['Brand A', 'Brand B', 'Brand C', 'Others'],
      datasets: [{
        data: [35, 28, 22, 15],
        backgroundColor: [
          colors.orange.pie,
          colors.blue.pie,
          colors.green.pie,
          colors.gray.pie
        ],
        borderWidth: 0,
        spacing: 2
      }],
      dataPoints: 189
    }
  };

  // ============================================
  // Workflow to Visualization Mapping
  // ============================================

  const workflowMappings = {
    'Running Trends': ['runningTrends', 'runningBrandShare', 'runningPerformance'],
    'Childcare Analysis': ['connectedNurseryAdoption', 'premiumAttributes', 'smartNurserySpend'],
    'Weather Impact': ['weatherImpact', 'seasonalApparel', 'temperatureCorrelation', 'outdoorBrandMix'],
    'Snacking Behaviors': ['snackingBehaviors', 'snackingCategories', 'snackingOccasions', 'snackingInnovation'],
    'Beverage Hydration': ['beverageHydration', 'beverageAttributes', 'beverageCategories', 'beverageHabits']
  };

  // General fallback keys
  const generalKeys = ['marketTrend', 'categoryPerformance', 'consumerSentiment', 'marketShare'];

  // ============================================
  // Public API
  // ============================================

  return {
    // Get a specific visualization by key
    get: function(key) {
      return library[key] || null;
    },

    // Get all available visualization keys
    keys: function() {
      return Object.keys(library);
    },

    // Get visualizations mapped to a workflow
    forWorkflow: function(workflowName) {
      return workflowMappings[workflowName] || [];
    },

    // Get a random general visualization
    random: function() {
      const key = generalKeys[Math.floor(Math.random() * generalKeys.length)];
      return library[key];
    },

    // Get the color palette
    colors: colors,

    // Check if a visualization exists
    has: function(key) {
      return key in library;
    },

    // Get workflow mappings
    workflowMappings: workflowMappings,

    // Expose the full library (read-only access)
    all: library
  };
})();

// Expose globally
window.VisualizationLibrary = VisualizationLibrary;
