/**
 * Tag Component Factory
 * Creates styled tag elements with Material Symbols icons
 * Uses IconLibrary for icon resolution
 * 
 * Styling: Glass-morphism with inset shadow and backdrop blur
 */

const Tag = {
  /**
   * Get icon name from IconLibrary or use directly
   * @param {string} iconKey - Key from IconLibrary or direct Material Symbol name
   * @returns {string} - Material Symbol name
   */
    getIcon: function (iconKey) {
        // Use IconLibrary if available, otherwise fallback
        if (typeof IconLibrary !== 'undefined') {
            return IconLibrary.get(iconKey);
        }
        return iconKey || 'label';
    },

  /**
   * Menu item tag for slash command popup and dropdowns
   * Has active/inactive states with proper hover
   * @param {string} icon - Material icon name or IconLibrary key
   * @param {string} label - Tag label
   * @param {Object} options - Optional settings
   * @returns {HTMLElement}
   */
    menuItem: function (icon, label, options = {}) {
        const { active = false, onClick = null } = options;
        const resolvedIcon = this.getIcon(icon);

        const item = document.createElement('div');

        // Base classes for menu item
        let classes = 'slash-command-item self-stretch pl-1.5 pr-3 py-1.5 rounded-lg inline-flex justify-start items-center gap-1 cursor-pointer transition-all';

        // Active state has background, inactive is transparent with hover
        if (active) {
            classes += ' bg-neutral-95 shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]';
        } else {
            classes += ' hover:bg-neutral-95/50';
        }

        item.className = classes;
        item.setAttribute('data-tag', label);
        item.setAttribute('data-icon', resolvedIcon);

        item.innerHTML = `
      <div class="flex justify-start items-center gap-1.5">
        <span class="w-5 h-5 flex items-center justify-center text-neutral-40">
          <span class="material-symbols-outlined text-[18px]">${resolvedIcon}</span>
        </span>
        <span class="text-neutral-40 text-sm font-normal leading-4">${label}</span>
      </div>
    `;

        if (onClick) {
            item.addEventListener('click', onClick);
        }

        return item;
    },

    /**
     * Create menu container with items
     * @param {Array} items - Array of {icon, label, command} objects
     * @param {Object} options - Container options
     * @returns {HTMLElement}
     */
    menu: function (items, options = {}) {
        const { activeIndex = 0, onSelect = null } = options;

        const container = document.createElement('div');
        container.className = 'w-44 p-2 bg-neutral-98 rounded-2xl shadow-lg border border-neutral-10/5 backdrop-blur-md flex flex-col gap-0.5';

        items.forEach((item, index) => {
            const menuItem = this.menuItem(item.icon, item.label, {
                active: index === activeIndex,
                onClick: () => {
                    if (onSelect) onSelect(item, index);
                }
            });
            menuItem.setAttribute('data-command', item.command || item.label.toLowerCase().replace(/\s+/g, '-'));
            menuItem.setAttribute('data-tag-icon', item.icon);
            menuItem.setAttribute('data-tag-label', item.label);
            container.appendChild(menuItem);
        });

        return container;
    },

    /**
     * Large tag for popups/menus (glass-morphism style)
     * @param {string} icon - Material icon name or IconLibrary key
     * @param {string} label - Tag label
     * @param {Object} options - Optional settings
     * @returns {HTMLElement}
     */
    large: function (icon, label, options = {}) {
        const { variant = 'green', clickable = true } = options;
        const resolvedIcon = this.getIcon(icon);

    const tag = document.createElement('span');

        // Base classes with glass-morphism
        let classes = 'tag-lg inline-flex items-center gap-1.5 pl-1.5 pr-3 py-1.5 rounded-lg backdrop-blur-[20px] transition-all';

        // Variant-specific colors
        if (variant === 'green') {
            classes += ' bg-green-highlight text-[#1a3f2e] shadow-[inset_0_0_3px_0_rgba(141,220,184,0.3)]';
            if (clickable) classes += ' hover:bg-green-highlight-hover cursor-pointer';
        } else if (variant === 'neutral') {
            classes += ' bg-neutral-95 text-neutral-40 shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]';
            if (clickable) classes += ' hover:bg-neutral-90 cursor-pointer';
        }

        tag.className = classes;
    tag.setAttribute('data-tag', label);
        tag.setAttribute('data-icon', resolvedIcon);

    tag.innerHTML = `
      <span class="w-5 h-5 flex items-center justify-center">
        <span class="material-symbols-outlined text-[18px]">${resolvedIcon}</span>
      </span>
      <span class="text-sm font-normal leading-4">${label}</span>
    `;

    return tag;
  },

  /**
   * Small inline tag for text areas (glass-morphism style)
   * @param {string} icon - Material icon name or IconLibrary key
   * @param {string} label - Tag label
   * @param {Object} options - Optional settings
   * @returns {HTMLElement}
   */
    inline: function (icon, label, options = {}) {
        const { variant = 'green' } = options;
        const resolvedIcon = this.getIcon(icon);

    const tag = document.createElement('span');

        // Base classes with glass-morphism
        let classes = 'tag-inline inline-flex items-center gap-1 pl-1 pr-2 py-0.5 rounded-md backdrop-blur-[12px] align-middle select-none whitespace-nowrap';

        // Variant-specific colors
        if (variant === 'green') {
            classes += ' bg-green-highlight text-[#1a3f2e] shadow-[inset_0_0_2px_0_rgba(141,220,184,0.3)]';
        } else if (variant === 'neutral') {
            classes += ' bg-neutral-95 text-neutral-40 shadow-[inset_0_0_2px_0_rgba(242,242,237,0.25)]';
        }

        tag.className = classes;
    tag.contentEditable = 'false';
    tag.setAttribute('data-tag', label);
        tag.setAttribute('data-icon', resolvedIcon);

        tag.innerHTML = `
      <span class="w-4 h-4 flex items-center justify-center">
        <span class="material-symbols-outlined text-[14px]">${resolvedIcon}</span>
      </span>
      <span class="text-[13px] font-normal leading-4">${label}</span>
    `;

        return tag;
    },

    /**
     * Create pill-style tag (more compact)
     * @param {string} icon - Material icon name or IconLibrary key
     * @param {string} label - Tag label
     * @param {Object} options - Optional settings
     * @returns {HTMLElement}
     */
    pill: function (icon, label, options = {}) {
        const { variant = 'green', size = 'md' } = options;
        const resolvedIcon = this.getIcon(icon);

        const tag = document.createElement('span');

        // Size classes
        const sizeClasses = size === 'sm'
            ? 'gap-0.5 px-1.5 py-0.5 text-xs'
            : 'gap-1 px-2 py-1 text-sm';

        // Base classes
        let classes = `tag-pill inline-flex items-center ${sizeClasses} rounded-full backdrop-blur-[12px] transition-all`;

        // Variant-specific colors
        if (variant === 'green') {
            classes += ' bg-green-highlight text-[#1a3f2e]';
        } else if (variant === 'neutral') {
            classes += ' bg-neutral-95 text-neutral-40';
        } else if (variant === 'orange') {
            classes += ' bg-orange-50/20 text-orange-50';
        }

        tag.className = classes;
        tag.setAttribute('data-tag', label);

        const iconSize = size === 'sm' ? '12px' : '14px';
    tag.innerHTML = `
      <span class="material-symbols-outlined" style="font-size: ${iconSize}">${resolvedIcon}</span>
      <span>${label}</span>
    `;

    return tag;
  },

  /**
   * Create from element with data attributes
   * @param {HTMLElement} el - Element with data-tag-icon and data-tag-label
   * @param {string} type - 'large', 'inline', 'pill', or 'menuItem'
   * @returns {HTMLElement|null}
   */
  from: function(el, type = 'inline') {
    const icon = el.getAttribute('data-tag-icon');
    const label = el.getAttribute('data-tag-label');
      const variant = el.getAttribute('data-tag-variant') || 'green';

    if (!icon || !label) return null;

        const options = { variant };

        switch (type) {
            case 'large': return this.large(icon, label, options);
            case 'pill': return this.pill(icon, label, options);
            case 'menuItem': return this.menuItem(icon, label, options);
            default: return this.inline(icon, label, options);
        }
    },

    /**
     * Create a group of tags
     * @param {Array} tags - Array of {icon, label} objects
     * @param {string} type - 'large', 'inline', or 'pill'
     * @param {Object} options - Shared options for all tags
     * @returns {HTMLElement} - Container with all tags
     */
    group: function (tags, type = 'inline', options = {}) {
        const container = document.createElement('div');
        container.className = 'tag-group flex flex-wrap gap-2';

        tags.forEach(({ icon, label }) => {
            let tag;
            switch (type) {
                case 'large': tag = this.large(icon, label, options); break;
                case 'pill': tag = this.pill(icon, label, options); break;
                default: tag = this.inline(icon, label, options);
            }
            container.appendChild(tag);
        });

        return container;
  }
};

// Expose globally
window.Tag = Tag;

// Legacy support
window.createSmallTag = function(icon, label) {
  return Tag.inline(icon, label);
};

console.log('🏷️ Tag component loaded');
