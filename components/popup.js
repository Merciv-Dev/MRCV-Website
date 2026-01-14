/**
 * Popup Component
 * 
 * A simple, reusable popup menu component.
 * All popups have the same style - a list of items with icon + label.
 * 
 * Usage:
 *   Popup.register('my-popup', {
 *     width: 'w-44',
 *     items: [
 *       { icon: 'edit', label: 'Edit', onClick: () => console.log('edit') },
 *       { icon: 'delete', label: 'Delete', onClick: () => console.log('delete') }
 *     ]
 *   });
 */

const Popup = {
  configs: {},
  
  /**
   * Register a popup configuration
   * @param {string} id - Popup ID (matches data-popup attribute)
   * @param {Object} config - Popup configuration
   */
  register: function(id, config) {
    this.configs[id] = {
      width: config.width || 'w-44',
      maxHeight: config.maxHeight || null,
      scrollable: config.scrollable || false,
      items: config.items || [],
      trackActive: config.trackActive || false,
      activeValue: config.activeValue || null,
      onSelect: config.onSelect || null
    };
  },

  /**
   * Create a popup element from config
   * @param {string} id - Popup ID
   * @returns {HTMLElement}
   */
  create: function(id) {
    const config = this.configs[id];
    if (!config) {
      console.warn(`Popup: No config found for "${id}"`);
      return null;
    }

    // Build class list
    const scrollClasses = config.scrollable ? `${config.maxHeight || 'max-h-64'} overflow-y-auto` : '';
    
    const popup = document.createElement('div');
    popup.id = id;
    popup.className = `popup ${config.width} ${scrollClasses} max-w-[calc(100vw-40px)] fixed z-50 opacity-0 invisible pointer-events-none transition-all duration-200 -translate-y-2 bg-neutral-98 rounded-2xl border border-neutral-10/5 shadow-lg backdrop-blur-md p-2 flex flex-col gap-0.5`;
    popup.setAttribute('aria-hidden', 'true');

    // Create items
    config.items.forEach((item, index) => {
      const isActive = config.trackActive && (item.value === config.activeValue);
      const menuItem = this.createItem(item, isActive, () => {
        // Update active state
        if (config.trackActive) {
          this.setActive(id, item.value || item.label);
        }
        
        // Call item onClick
        if (item.onClick) {
          item.onClick(item, index);
        }
        
        // Call global onSelect
        if (config.onSelect) {
          config.onSelect(item, index);
        }
        
        // Close popup
        if (window.closeAllPopups) {
          window.closeAllPopups();
        }
      });
      
      menuItem.setAttribute('data-value', item.value || item.label);
      popup.appendChild(menuItem);
    });

    return popup;
  },

  /**
   * Create a single menu item
   */
  createItem: function(item, active = false, onClick = null) {
    const icon = this.getIcon(item.icon);
    
    const el = document.createElement('div');
    el.className = `popup-item self-stretch pl-1.5 pr-3 py-1.5 rounded-lg inline-flex justify-start items-center gap-1 cursor-pointer transition-all ${active ? 'bg-neutral-95 shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]' : 'hover:bg-neutral-95/50'}`;
    el.setAttribute('data-active', active ? 'true' : 'false');

    el.innerHTML = `
      <div class="flex justify-start items-center gap-1.5">
        <span class="w-5 h-5 flex items-center justify-center text-neutral-40">
          <span class="material-symbols-outlined text-[18px]">${icon}</span>
        </span>
        <span class="text-neutral-40 text-sm font-normal leading-4">${item.label}</span>
      </div>
    `;

    if (onClick) {
      el.addEventListener('click', (e) => {
        e.stopPropagation();
        onClick();
      });
    }

    return el;
  },

  /**
   * Set active item in a popup
   */
  setActive: function(popupId, value) {
    const config = this.configs[popupId];
    if (!config || !config.trackActive) return;

    config.activeValue = value;

    const popup = document.getElementById(popupId);
    if (!popup) return;

    popup.querySelectorAll('.popup-item').forEach(item => {
      const itemValue = item.getAttribute('data-value');
      const isActive = itemValue === value;
      
      item.setAttribute('data-active', isActive ? 'true' : 'false');
      
      if (isActive) {
        item.classList.remove('hover:bg-neutral-95/50');
        item.classList.add('bg-neutral-95', 'shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]');
      } else {
        item.classList.remove('bg-neutral-95', 'shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]');
        item.classList.add('hover:bg-neutral-95/50');
      }
    });
  },

  /**
   * Get active value
   */
  getActive: function(popupId) {
    const config = this.configs[popupId];
    return config ? config.activeValue : null;
  },

  /**
   * Get icon from IconLibrary or use directly
   */
  getIcon: function(iconKey) {
    if (typeof IconLibrary !== 'undefined') {
      return IconLibrary.get(iconKey);
    }
    return iconKey || 'label';
  },

  /**
   * Initialize all registered popups
   */
  init: function() {
    const container = document.querySelector('.chat-container') || document.getElementById('chat-bar');
    if (!container) {
      console.warn('Popup: No container found');
      return;
    }

    // Create and append all registered popups
    Object.keys(this.configs).forEach(id => {
      // Remove old popup if exists
      const old = document.getElementById(id);
      if (old) old.remove();

      // Create new popup
      const popup = this.create(id);
      if (popup) {
        container.appendChild(popup);
      }
    });

    console.log(`📋 Popup: Initialized ${Object.keys(this.configs).length} popups`);
  }
};

// ============================================
// POPUP CONFIGURATIONS
// Define all popups here with their items
// ============================================

// Mode Popup (ASK/WORK/RESEARCH)
Popup.register('mode-popup', {
  width: 'w-[140px]',
  trackActive: true,
  activeValue: 'work',
  items: [
    { icon: 'bolt', label: 'Ask', value: 'ask' },
    { icon: 'psychology', label: 'Work', value: 'work' },
    { icon: 'science', label: 'Research', value: 'research' }
  ],
  onSelect: (item) => {
    // Update the mode button
    const btn = document.getElementById('mode-button');
    if (btn) {
      const iconEl = btn.querySelector('.mode-icon');
      const labelEl = btn.querySelector('.mode-label');
      if (iconEl) {
        iconEl.textContent = Popup.getIcon(item.icon);
        iconEl.style.color = '#089DBA';
      }
      if (labelEl) {
        labelEl.textContent = item.label;
        labelEl.style.color = '#089DBA';
      }
      // Add active background styling
      btn.style.backgroundColor = 'rgba(8, 157, 186, 0.1)';
      btn.style.borderColor = 'rgba(8, 157, 186, 0.3)';
    }
  }
});

// Slash Command Popup
Popup.register('slash-command-popup', {
  width: 'w-56',
    maxHeight: 'max-h-48',
  scrollable: true,
  items: [
      // Index 0 - Used by Running Trends workflow
    { 
      icon: 'checkroom', 
      label: 'Running Shoes',
      onClick: () => insertTag('checkroom', 'Running Shoes')
    },
      // Index 1 - Used by Weather Impact workflow
    { 
      icon: 'checkroom', 
      label: 'Outdoor Apparel',
      onClick: () => insertTag('checkroom', 'Outdoor Apparel')
    },
      // Index 2 - Used by Childcare Analysis workflow
    { 
      icon: 'child_care', 
      label: 'Baby Products',
      onClick: () => insertTag('child_care', 'Baby Products')
    },
      // Index 3 - Used by Snacking Behaviors workflow
      {
          icon: 'cookie',
          label: 'Snacking',
          onClick: () => insertTag('cookie', 'Snacking')
      },
      // Index 4 - Used by Beverage Hydration workflow
      {
          icon: 'local_cafe',
          label: 'Beverage',
          onClick: () => insertTag('local_cafe', 'Beverage')
      },
      // Additional items
    { 
      icon: 'fitness_center', 
      label: 'Fitness Equipment',
      onClick: () => insertTag('fitness_center', 'Fitness Equipment')
    },
    { 
      icon: 'weekend', 
      label: 'Home Furniture',
      onClick: () => insertTag('weekend', 'Home Furniture')
    },
    // Reports
    { 
      icon: 'analytics', 
      label: 'Q1 Sales Report',
      onClick: () => insertTag('analytics', 'Q1 Sales Report')
    },
    { 
      icon: 'analytics', 
      label: 'Q2 Forecast',
      onClick: () => insertTag('analytics', 'Q2 Forecast')
    },
    { 
      icon: 'insights', 
      label: 'Market Analysis',
      onClick: () => insertTag('insights', 'Market Analysis')
    },
    { 
      icon: 'trending_up', 
      label: 'Growth Metrics',
      onClick: () => insertTag('trending_up', 'Growth Metrics')
    },
    { 
      icon: 'bar_chart', 
      label: 'Consumer Trends',
      onClick: () => insertTag('bar_chart', 'Consumer Trends')
    }
  ]
});

// Add Menu Popup (+)
Popup.register('add-menu', {
  width: 'w-44',
  items: [
    { 
      icon: 'folder', 
      label: 'Project',
      onClick: () => console.log('Project')
    },
    { 
      icon: 'description', 
      label: 'Report',
      onClick: () => console.log('Report')
    },
    { 
      icon: 'chat', 
      label: 'Chat',
      onClick: () => console.log('Chat')
    },
    { 
      icon: 'dashboard', 
      label: 'Dashboard',
      onClick: () => console.log('Dashboard')
    }
  ]
});

// Context Popup
Popup.register('context-popup', {
  width: 'w-48',
  items: [
    { 
      icon: 'bar_chart', 
      label: 'Market data',
      onClick: () => console.log('Market data')
    },
    { 
      icon: 'description', 
      label: 'Brand guidelines',
      onClick: () => console.log('Brand guidelines')
    },
    { 
      icon: 'group', 
      label: 'Audience insights',
      onClick: () => console.log('Audience insights')
    },
    { 
      icon: 'flag', 
      label: 'Campaign goals',
      onClick: () => console.log('Campaign goals')
    },
    { 
      icon: 'add', 
      label: 'Add new',
      onClick: () => console.log('Add new context')
    }
  ]
});

// Attach Popup
Popup.register('attach-popup', {
  width: 'w-48',
  items: [
    { 
      icon: 'upload_file', 
      label: 'Upload file',
      onClick: () => console.log('Upload file')
    },
    { 
      icon: 'link', 
      label: 'Add link',
      onClick: () => console.log('Add link')
    },
    { 
      icon: 'image', 
      label: 'Add image',
      onClick: () => console.log('Add image')
    }
  ]
});

// Helper function to insert tag into input
function insertTag(icon, label) {
  const inputArea = document.querySelector('.chat-input-area');
  if (!inputArea || !window.Tag) return;
  
  // Remove trailing slash
  const text = inputArea.textContent || '';
  if (text.endsWith('/')) {
    inputArea.textContent = text.slice(0, -1);
  }
  
  // Insert tag
  const tag = window.Tag.inline(icon, label);
  inputArea.appendChild(tag);
  inputArea.removeAttribute('data-empty');
  
  // Move cursor after tag
  const range = document.createRange();
  const sel = window.getSelection();
  range.selectNodeContents(inputArea);
  range.collapse(false);
  sel.removeAllRanges();
  sel.addRange(range);
  
  inputArea.focus();
}

// Expose globally
window.Popup = Popup;

console.log('📋 Popup component loaded');
