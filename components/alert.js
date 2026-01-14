/**
 * Alert Component
 * Displays notification-style alerts with priority levels
 * 
 * Features:
 * - Type tags (Update, Warning, Alert, etc.)
 * - Priority levels (High, Medium, Low) with color coding
 * - Timestamp display
 * - Title and description
 * - Animated entrance/exit
 */

const Alert = (function() {
  'use strict';

  // Containers for different positions
  let containers = {};
  let activeAlerts = [];

  // ============================================
  // Configuration
  // ============================================

  const config = {
    maxAlerts: 3,          // Maximum visible alerts at once per position
    autoHideDuration: 4000, // Auto-hide after 4 seconds (0 = no auto-hide)
    animationDuration: 300
  };

  // Position configurations
  const positions = {
    'under-chat': {
      // Under the chat bar, like text-card-output
      classes: 'w-full flex flex-col gap-3',
      style: '',
      animateIn: '-translate-y-2',
      animateOut: '-translate-y-2',
      usesChatContainer: true  // Special flag to use chat container
    },
    'top-right': {
      classes: 'absolute z-50 flex flex-col gap-3',
      style: 'top: calc(50% - 120px); right: 24px;',
      animateIn: 'translate-x-4',
      animateOut: 'translate-x-4'
    },
    'top-left': {
      classes: 'absolute z-50 flex flex-col gap-3',
      style: 'top: calc(50% - 120px); left: 24px;',
      animateIn: '-translate-x-4',
      animateOut: '-translate-x-4'
    },
    'bottom-right': {
      classes: 'absolute z-50 flex flex-col gap-3',
      style: 'top: calc(50% + 40px); right: 24px;',
      animateIn: 'translate-x-4',
      animateOut: 'translate-x-4'
    },
    'bottom-left': {
      classes: 'absolute z-50 flex flex-col gap-3',
      style: 'top: calc(50% + 40px); left: 24px;',
      animateIn: '-translate-x-4',
      animateOut: '-translate-x-4'
    }
  };

  // Priority level styling
  const priorityStyles = {
    high: {
      bg: 'bg-red-200/25',
      text: 'text-red-900',
      icon: 'priority_high',
      iconColor: 'text-red-900'
    },
    medium: {
      bg: 'bg-amber-200/25',
      text: 'text-amber-900',
      icon: 'warning',
      iconColor: 'text-amber-700'
    },
    low: {
      bg: 'bg-blue-200/25',
      text: 'text-blue-900',
      icon: 'info',
      iconColor: 'text-blue-700'
    },
    success: {
      bg: 'bg-green-200/25',
      text: 'text-green-900',
      icon: 'check_circle',
      iconColor: 'text-green-700'
    }
  };

  // Type tags
  const typeStyles = {
    update: { label: 'Update', icon: 'sync' },
    alert: { label: 'Alert', icon: 'notifications' },
    warning: { label: 'Warning', icon: 'warning' },
    insight: { label: 'Insight', icon: 'lightbulb' },
    trend: { label: 'Trend', icon: 'trending_up' },
    report: { label: 'Report', icon: 'assessment' }
  };

  // ============================================
  // Initialize Container for a position
  // ============================================

  function initContainer(position = 'under-chat') {
    if (containers[position]) return containers[position];

    const posConfig = positions[position] || positions['under-chat'];
    
    const container = document.createElement('div');
    container.id = `alert-container-${position}`;
    
    // For under-chat position, insert above the chat container (like text-card-output)
    if (posConfig.usesChatContainer) {
      const chatBar = document.getElementById('chat-bar') || document.querySelector('.chat-container');
      if (chatBar) {
        const chatContainer = chatBar.querySelector('.chat-container') || chatBar;
        container.className = `${posConfig.classes} pointer-events-none mb-3`;
        container.style.cssText = 'max-height: 0; overflow: hidden; transition: max-height 0.4s ease-in-out;';
        // Insert before the input area (chat-container)
        chatContainer.parentNode.insertBefore(container, chatContainer);
      } else {
        // Fallback to body
        container.className = `${posConfig.classes} pointer-events-none`;
        document.body.appendChild(container);
      }
    } else {
      // Other positions: append to hero-anim or body
      const wrapper = document.getElementById('hero-anim') || 
                     document.querySelector('.hero-anim') || 
                     document.body;
      container.className = `${posConfig.classes} pointer-events-none`;
      container.style.cssText = `max-width: 384px; ${posConfig.style || ''}`;
      wrapper.appendChild(container);
    }
    
    containers[position] = container;
    return container;
  }

  // Initialize default container
  function init() {
    return initContainer('under-chat');
  }

  // ============================================
  // Create Alert Element
  // ============================================

  function create(options = {}) {
    const {
      type = 'update',
      priority = 'medium',
      title = 'Alert Title',
      description = 'Alert description goes here.',
      timestamp = 'Just now',
      autoHide = config.autoHideDuration,
      onClose = null,
      onClick = null,
      position = 'under-chat'
    } = options;

    const typeConfig = typeStyles[type] || typeStyles.update;
    const priorityConfig = priorityStyles[priority] || priorityStyles.medium;
    const posConfig = positions[position] || positions['top-right'];

    const alert = document.createElement('div');
    alert.className = `
      alert-card
      w-full p-1.5 
      bg-neutral-98 
      rounded-3xl 
      shadow-lg
      border border-black/5
      flex flex-col gap-1.5
      opacity-0 ${posConfig.animateIn}
      transition-all duration-300 ease-out
      pointer-events-auto
      cursor-pointer
      hover:shadow-xl hover:scale-[1.02]
    `.replace(/\s+/g, ' ').trim();
    
    // Store position for hide animation
    alert._position = position;

    alert.innerHTML = `
      <!-- Header -->
      <div class="w-full pr-3 flex justify-between items-center">
        <!-- Left: Type & Priority Tags -->
        <div class="flex items-center gap-1">
          <!-- Type Tag -->
          <div class="h-7 px-2 py-1 bg-neutral-95 rounded-xl flex items-center gap-1">
            <span class="material-symbols-outlined text-sm text-neutral-40">${typeConfig.icon}</span>
            <span class="text-neutral-40 text-xs leading-3">${typeConfig.label}</span>
          </div>
          <!-- Priority Tag -->
          <div class="pl-2 pr-2 py-1 ${priorityConfig.bg} rounded-2xl flex items-center gap-1">
            <span class="material-symbols-outlined text-sm ${priorityConfig.iconColor}">${priorityConfig.icon}</span>
            <span class="${priorityConfig.text} text-xs leading-3 capitalize">${priority}</span>
          </div>
        </div>
        <!-- Right: Timestamp & Close -->
        <div class="flex items-center gap-2">
          <span class="text-neutral-40 text-xs leading-3">${timestamp}</span>
          <button class="alert-close p-1 rounded-full hover:bg-neutral-90/50 transition-colors" title="Dismiss">
            <span class="material-symbols-outlined text-sm text-neutral-40">close</span>
          </button>
        </div>
      </div>

      <!-- Content -->
      <div class="w-full px-3.5 pt-2.5 pb-3.5 rounded-xl flex flex-col gap-1.5">
        <h4 class="text-neutral-05 text-base font-medium leading-5">${escapeHtml(title)}</h4>
        <p class="text-neutral-40 text-sm leading-5 line-clamp-3">${escapeHtml(description)}</p>
      </div>
    `;

    // Store reference and options
    alert._alertOptions = options;
    alert._autoHideTimer = null;

    // Add event listeners
    const closeBtn = alert.querySelector('.alert-close');
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      hide(alert);
      if (onClose) onClose();
    });

    if (onClick) {
      alert.addEventListener('click', (e) => {
        if (!e.target.closest('.alert-close')) {
          onClick(options);
        }
      });
    }

    // Auto-hide setup
    if (autoHide > 0) {
      alert._autoHideTimer = setTimeout(() => {
        hide(alert);
      }, autoHide);

      // Pause auto-hide on hover
      alert.addEventListener('mouseenter', () => {
        if (alert._autoHideTimer) {
          clearTimeout(alert._autoHideTimer);
          alert._autoHideTimer = null;
        }
      });

      alert.addEventListener('mouseleave', () => {
        if (!alert._autoHideTimer && autoHide > 0) {
          alert._autoHideTimer = setTimeout(() => {
            hide(alert);
          }, autoHide / 2); // Shorter time after hover
        }
      });
    }

    return alert;
  }

  // ============================================
  // Show Alert
  // ============================================

  function show(options = {}) {
    const position = options.position || 'under-chat';
    const container = initContainer(position);
    const posConfig = positions[position] || positions['under-chat'];

    const alert = create(options);
    
    // Limit number of visible alerts per position
    const positionAlerts = activeAlerts.filter(a => a._position === position);
    while (positionAlerts.length >= config.maxAlerts) {
      const oldest = positionAlerts.shift();
      hide(oldest, true); // Force immediate hide
    }

    // Add to container
    container.appendChild(alert);
    activeAlerts.push(alert);

    // Animate in
    requestAnimationFrame(() => {
      // For under-chat, expand the container's max-height
      if (posConfig.usesChatContainer) {
        container.style.maxHeight = container.scrollHeight + 'px';
        alert.classList.remove('opacity-0', posConfig.animateIn);
        alert.classList.add('opacity-100', 'translate-y-0');
      } else {
        alert.classList.remove('opacity-0', posConfig.animateIn);
        alert.classList.add('opacity-100', 'translate-x-0');
      }
    });

    return alert;
  }

  // ============================================
  // Hide Alert
  // ============================================

  function hide(alert, immediate = false) {
    if (!alert || !alert.parentNode) return;

    const position = alert._position || 'under-chat';
    const posConfig = positions[position] || positions['under-chat'];
    const container = alert.parentNode;

    // Clear auto-hide timer
    if (alert._autoHideTimer) {
      clearTimeout(alert._autoHideTimer);
      alert._autoHideTimer = null;
    }

    // Remove from active list
    const index = activeAlerts.indexOf(alert);
    if (index > -1) {
      activeAlerts.splice(index, 1);
    }

    if (immediate) {
      alert.remove();
      // Collapse container if empty and using under-chat
      if (posConfig.usesChatContainer && container && container.children.length === 0) {
        container.style.maxHeight = '0';
      }
      return;
    }

    // Animate out with correct direction
    if (posConfig.usesChatContainer) {
      alert.classList.remove('opacity-100', 'translate-y-0');
      alert.classList.add('opacity-0', posConfig.animateOut);
      
      // Animate the container height down
      setTimeout(() => {
        if (container) {
          container.style.maxHeight = '0';
        }
      }, config.animationDuration / 2);
    } else {
      alert.classList.remove('opacity-100', 'translate-x-0');
      alert.classList.add('opacity-0', posConfig.animateOut);
    }

    setTimeout(() => {
      if (alert.parentNode) {
        alert.remove();
      }
    }, config.animationDuration);
  }

  // ============================================
  // Hide All Alerts
  // ============================================

  function hideAll(immediate = false) {
    [...activeAlerts].forEach(alert => hide(alert, immediate));
  }

  // ============================================
  // Convenience Methods
  // ============================================

  function update(options) {
    return show({ type: 'update', ...options });
  }

  function warning(options) {
    return show({ type: 'warning', priority: 'medium', ...options });
  }

  function error(options) {
    return show({ type: 'alert', priority: 'high', ...options });
  }

  function success(options) {
    return show({ type: 'update', priority: 'success', ...options });
  }

  function insight(options) {
    return show({ type: 'insight', priority: 'low', ...options });
  }

  function trend(options) {
    return show({ type: 'trend', priority: 'medium', ...options });
  }

  // ============================================
  // Utility Functions
  // ============================================

  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatTimeAgo(date) {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  }

  // ============================================
  // Public API
  // ============================================

  return {
    init,
    create,
    show,
    hide,
    hideAll,
    
    // Convenience methods
    update,
    warning,
    error,
    success,
    insight,
    trend,

    // Utilities
    formatTimeAgo,

    // Configuration
    config,
    priorityStyles,
    typeStyles
  };
})();

// Expose globally
window.Alert = Alert;

