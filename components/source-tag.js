/**
 * SourceTag Component
 * Displays a data source as a branded tag with icon/image
 * 
 * Usage:
 *   SourceTag.create('pdf')           // From library
 *   SourceTag.inline('snowflake')     // Inline version for text
 *   SourceTag.createCustom({ ... })   // Custom source
 */

const SourceTag = (function() {
  'use strict';

  /**
   * Create a source tag (large version for lists/popups)
   * @param {string} sourceId - ID from SourceLibrary
   * @param {Object} options - Additional options
   * @returns {HTMLElement}
   */
  function create(sourceId, options = {}) {
    const source = window.SourceLibrary?.get(sourceId);
    if (!source) {
      console.warn(`SourceTag: Unknown source "${sourceId}"`);
      return createCustom({ label: sourceId, icon: 'help', color: '#666560' }, options);
    }
    return createCustom(source, options);
  }

  /**
   * Create inline source tag (for text areas)
   * @param {string} sourceId - ID from SourceLibrary
   * @param {Object} options - Additional options
   * @returns {HTMLElement}
   */
  function inline(sourceId, options = {}) {
    return create(sourceId, { ...options, size: 'inline' });
  }

  /**
   * Create a custom source tag
   * @param {Object} source - Source configuration
   * @param {string} source.label - Display name
   * @param {string} source.icon - Material Symbol icon (optional)
   * @param {string} source.image - Image URL (optional, overrides icon)
   * @param {string} source.color - Brand color
   * @param {Object} options - Additional options
   * @param {string} options.size - 'default' or 'inline'
   * @returns {HTMLElement}
   */
  function createCustom(source, options = {}) {
    const { label, icon, image, color = '#666560' } = source;
    const { size = 'default' } = options;
    const isInline = size === 'inline';

    const tag = document.createElement('span');
    
    // Base classes
    const baseClasses = isInline
      ? 'source-tag-inline inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[13px] font-medium align-middle select-none whitespace-nowrap'
      : 'source-tag inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium cursor-pointer transition-all hover:opacity-80';
    
    tag.className = baseClasses;
    tag.setAttribute('data-source', source.id || label);
    
    // Apply brand color as background tint
    const bgOpacity = isInline ? '0.15' : '0.12';
    tag.style.backgroundColor = hexToRgba(color, bgOpacity);
    tag.style.color = color;

    // Non-editable for inline in contenteditable
    if (isInline) {
      tag.contentEditable = 'false';
    }

    // Build inner HTML
    let iconHtml = '';
    if (image) {
      const imgSize = isInline ? '14' : '18';
      iconHtml = `<img src="${image}" alt="${label}" class="w-[${imgSize}px] h-[${imgSize}px] object-contain rounded-sm" />`;
    } else if (icon) {
      const iconSize = isInline ? '14px' : '18px';
      iconHtml = `<span class="material-symbols-outlined" style="font-size: ${iconSize}; color: ${color};">${icon}</span>`;
    }

    tag.innerHTML = `${iconHtml}<span>${label}</span>`;

    return tag;
  }

  /**
   * Create multiple source tags
   * @param {string[]} sourceIds - Array of source IDs
   * @param {Object} options - Options for all tags
   * @returns {HTMLElement[]}
   */
  function createMultiple(sourceIds, options = {}) {
    return sourceIds.map(id => create(id, options));
  }

  /**
   * Create a source tag group (wrapped in a flex container)
   * @param {string[]} sourceIds - Array of source IDs
   * @param {Object} options - Options
   * @returns {HTMLElement}
   */
  function createGroup(sourceIds, options = {}) {
    const wrapper = document.createElement('div');
    wrapper.className = 'flex flex-wrap gap-2';
    
    sourceIds.forEach(id => {
      wrapper.appendChild(create(id, options));
    });

    return wrapper;
  }

  /**
   * Convert hex color to rgba
   * @param {string} hex - Hex color
   * @param {string} alpha - Alpha value
   * @returns {string}
   */
  function hexToRgba(hex, alpha) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  // Public API
  return {
    create,
    inline,
    createCustom,
    createMultiple,
    createGroup,

    // Convenience methods for common sources
    pdf: (opts) => create('pdf', opts),
    excel: (opts) => create('excel', opts),
    pptx: (opts) => create('pptx', opts),
    snowflake: (opts) => create('snowflake', opts),
    mintel: (opts) => create('mintel', opts),
    kantar: (opts) => create('kantar', opts),
  };

})();

// Expose globally
window.SourceTag = SourceTag;


