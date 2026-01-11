/**
 * Tag Component Factory
 * Creates tag elements using Tailwind classes
 */

const Tag = {
  /**
   * Large tag for popups/menus
   * @param {string} icon - Material icon name
   * @param {string} label - Tag label
   * @returns {HTMLElement}
   */
  large: function(icon, label) {
    const tag = document.createElement('span');
    tag.className = 'tag-lg inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-highlight rounded-lg text-sm font-medium text-[#1a3f2e] cursor-pointer transition-all hover:bg-green-highlight-hover';
    tag.setAttribute('data-tag', label);
    tag.innerHTML = `
      <span class="material-symbols-outlined text-[18px] text-[#1a3f2e]">${icon}</span>
      <span>${label}</span>
    `;
    return tag;
  },

  /**
   * Small inline tag for text areas
   * @param {string} icon - Material icon name  
   * @param {string} label - Tag label
   * @returns {HTMLElement}
   */
  inline: function(icon, label) {
    const tag = document.createElement('span');
    tag.className = 'tag-inline inline-flex items-center gap-1 px-2 py-0.5 bg-green-highlight rounded-md text-[13px] font-medium text-[#1a3f2e] align-middle select-none whitespace-nowrap';
    tag.contentEditable = 'false';
    tag.setAttribute('data-tag', label);
    tag.innerHTML = `
      <span class="material-symbols-outlined text-[14px] text-[#1a3f2e]">${icon}</span>
      <span>${label}</span>
    `;
    return tag;
  },

  /**
   * Create from element with data attributes
   * @param {HTMLElement} el - Element with data-tag-icon and data-tag-label
   * @param {string} type - 'large' or 'inline'
   * @returns {HTMLElement|null}
   */
  from: function(el, type = 'inline') {
    const icon = el.getAttribute('data-tag-icon');
    const label = el.getAttribute('data-tag-label');
    if (!icon || !label) return null;
    return type === 'large' ? this.large(icon, label) : this.inline(icon, label);
  }
};

// Expose globally
window.Tag = Tag;

// Legacy support
window.createSmallTag = function(icon, label) {
  return Tag.inline(icon, label);
};

console.log('🏷️ Tag component loaded');
