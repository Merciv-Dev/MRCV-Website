/**
 * Icon Library
 * Centralized Material Symbols icon mapping for the entire application
 * 
 * Usage:
 *   IconLibrary.get('folder')       // Returns 'folder'
 *   IconLibrary.get('project')      // Returns 'folder_special'
 *   IconLibrary.getAll('documents') // Returns all document icons
 */

const IconLibrary = {
  // ============================================
  // Projects & Organization
  // ============================================
  folder: 'folder',
  folderOpen: 'folder_open',
  project: 'folder_special',
  archive: 'archive',
  inbox: 'inbox',
  workspace: 'workspaces',
  dashboard: 'dashboard',
  home: 'home',
  
  // ============================================
  // Documents & Files
  // ============================================
  document: 'description',
  file: 'draft',
  pdf: 'picture_as_pdf',
  spreadsheet: 'table_chart',
  presentation: 'slideshow',
  article: 'article',
  note: 'sticky_note_2',
  text: 'text_snippet',
  
  // ============================================
  // Data & Analytics
  // ============================================
  chart: 'bar_chart',
  barChart: 'bar_chart',
  lineChart: 'show_chart',
  pieChart: 'pie_chart',
  areaChart: 'area_chart',
  analytics: 'analytics',
  insights: 'insights',
  trending: 'trending_up',
  trendingDown: 'trending_down',
  monitoring: 'monitoring',
  leaderboard: 'leaderboard',
  dataUsage: 'data_usage',
  
  // ============================================
  // Categories & Labels
  // ============================================
  category: 'category',
  label: 'label',
  tag: 'sell',
  bookmark: 'bookmark',
  star: 'star',
  starOutline: 'star_outline',
  favorite: 'favorite',
  flag: 'flag',
  
  // ============================================
  // People & Teams
  // ============================================
  person: 'person',
  personOutline: 'person_outline',
  group: 'group',
  team: 'groups',
  audience: 'diversity_3',
  community: 'communities',
  supervisor: 'supervisor_account',
  
  // ============================================
  // Products & Commerce
  // ============================================
  product: 'inventory_2',
  shopping: 'shopping_bag',
  cart: 'shopping_cart',
  store: 'storefront',
  brand: 'loyalty',
  package: 'package_2',
  box: 'deployed_code',
  
  // ============================================
  // Time & Scheduling
  // ============================================
  calendar: 'calendar_month',
  schedule: 'schedule',
  event: 'event',
  today: 'today',
  history: 'history',
  update: 'update',
  timer: 'timer',
  
  // ============================================
  // Seasons & Weather
  // ============================================
  spring: 'local_florist',
  summer: 'wb_sunny',
  autumn: 'eco',
  winter: 'ac_unit',
  sunny: 'wb_sunny',
  cloud: 'cloud',
  
  // ============================================
  // Campaigns & Marketing
  // ============================================
  campaign: 'campaign',
  megaphone: 'campaign',
  announcement: 'announcement',
  broadcast: 'cell_tower',
  target: 'gps_fixed',
  bullseye: 'adjust',
  
  // ============================================
  // Locations & Geography
  // ============================================
  location: 'location_on',
  globe: 'public',
  region: 'map',
  travel: 'travel_explore',
  language: 'language',
  
  // ============================================
  // Status & Feedback
  // ============================================
  check: 'check_circle',
  checkOutline: 'check_circle_outline',
  pending: 'pending',
  warning: 'warning',
  error: 'error',
  info: 'info',
  help: 'help',
  verified: 'verified',
  
  // ============================================
  // Research & Intelligence
  // ============================================
  search: 'search',
  research: 'science',
  study: 'biotech',
  brain: 'psychology',
  lightbulb: 'lightbulb',
  idea: 'emoji_objects',
  explore: 'explore',
  discover: 'travel_explore',
  
  // ============================================
  // Actions & UI
  // ============================================
  add: 'add',
  addCircle: 'add_circle',
  remove: 'remove',
  close: 'close',
  menu: 'menu',
  more: 'more_horiz',
  moreVert: 'more_vert',
  settings: 'settings',
  edit: 'edit',
  delete: 'delete',
  copy: 'content_copy',
  paste: 'content_paste',
  share: 'share',
  download: 'download',
  upload: 'upload',
  refresh: 'refresh',
  sync: 'sync',
  expand: 'expand_more',
  collapse: 'expand_less',
  fullscreen: 'fullscreen',
  
  // ============================================
  // Navigation & Arrows
  // ============================================
  arrowUp: 'arrow_upward',
  arrowDown: 'arrow_downward',
  arrowLeft: 'arrow_back',
  arrowRight: 'arrow_forward',
  chevronUp: 'expand_less',
  chevronDown: 'expand_more',
  chevronLeft: 'chevron_left',
  chevronRight: 'chevron_right',
  
  // ============================================
  // Media & Content
  // ============================================
  image: 'image',
  photo: 'photo',
  video: 'videocam',
  audio: 'headphones',
  music: 'music_note',
  link: 'link',
  attachment: 'attach_file',
  
  // ============================================
  // Communication
  // ============================================
  email: 'email',
  chat: 'chat',
  message: 'message',
  comment: 'comment',
  send: 'send',
  notification: 'notifications',
  
  // ============================================
  // AI & Automation
  // ============================================
  ai: 'auto_awesome',
  magic: 'auto_fix_high',
  smart: 'psychology_alt',
  automation: 'precision_manufacturing',
  robot: 'smart_toy',
  
  // ============================================
  // Industry Specific - Retail/CPG
  // ============================================
  footwear: 'steps',
  shoes: 'steps',
  apparel: 'checkroom',
  clothing: 'dry_cleaning',
  beauty: 'spa',
  skincare: 'face_retouching_natural',
  food: 'restaurant',
  beverage: 'local_cafe',
  snacks: 'cookie',
  health: 'health_and_safety',
  wellness: 'self_improvement',
  
  // ============================================
  // Default
  // ============================================
  default: 'label',

  // ============================================
  // Helper Methods
  // ============================================
  
  /**
   * Get icon name, with fallback
   * @param {string} key - Icon key or direct Material Symbol name
   * @returns {string} - Material Symbol name
   */
  get: function(key) {
    if (!key) return this.default;
    // First check if it's a key in our library
    if (this[key] && typeof this[key] === 'string') {
      return this[key];
    }
    // Otherwise return as-is (assume it's a direct Material Symbol name)
    return key;
  },

  /**
   * Get all icon names (excluding methods)
   * @returns {string[]} - Array of icon keys
   */
  getAllKeys: function() {
    return Object.keys(this).filter(key => 
      typeof this[key] === 'string' && key !== 'default'
    );
  },

  /**
   * Get icons by category prefix
   * @param {string} prefix - Category prefix to filter by
   * @returns {Object} - Filtered icon map
   */
  getByPrefix: function(prefix) {
    const result = {};
    const lowerPrefix = prefix.toLowerCase();
    
    Object.keys(this).forEach(key => {
      if (typeof this[key] === 'string' && key.toLowerCase().startsWith(lowerPrefix)) {
        result[key] = this[key];
      }
    });
    
    return result;
  },

  /**
   * Check if icon exists
   * @param {string} key - Icon key
   * @returns {boolean}
   */
  has: function(key) {
    return typeof this[key] === 'string';
  },

  /**
   * Create HTML span element for icon
   * @param {string} key - Icon key or Material Symbol name
   * @param {Object} options - Optional styling
   * @returns {HTMLElement}
   */
  createElement: function(key, options = {}) {
    const { size = 20, className = '' } = options;
    const iconName = this.get(key);
    
    const span = document.createElement('span');
    span.className = `material-symbols-outlined ${className}`.trim();
    span.style.fontSize = typeof size === 'number' ? `${size}px` : size;
    span.textContent = iconName;
    
    return span;
  }
};

// Expose globally
window.IconLibrary = IconLibrary;

// Shorthand alias
window.Icons = IconLibrary;


