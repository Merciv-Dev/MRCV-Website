/**
 * Chat Bar Component - JavaScript
 * Handles popup interactions for the fake chat UI
 */

(function initChatBar() {
  // Handle dynamic loading - if DOMContentLoaded already fired, run immediately
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initChatBarCore);
    return;
  }
  initChatBarCore();
})();

function initChatBarCore() {
  
  // ============================================
  // DOM Elements
  // ============================================
  
  const overlay = document.getElementById('popup-overlay');
  const popups = document.querySelectorAll('.popup');
  const popupTriggers = document.querySelectorAll('[data-popup]');
  const closeButtons = document.querySelectorAll('.popup-close');
  const sendButton = document.querySelector('[data-action="send"]');
  const inputArea = document.querySelector('.chat-input-area');
  const dropZone = document.querySelector('.drop-zone');

  // Dynamic getters for popup elements (created by Popup component)
  const getSlashCommandPopup = () => document.getElementById('slash-command-popup');
  const getSlashCommandItems = () => document.querySelectorAll('#slash-command-popup .popup-item');
  
  // ============================================
  // Popup Functions
  // ============================================

  /**
   * Opens a popup by ID and positions it relative to the trigger button
   * @param {string} popupId - The ID of the popup to open
   * @param {HTMLElement} triggerButton - The button that triggered the popup
   */
  function openPopup(popupId, triggerButton) {
    const popup = document.getElementById(popupId);
    if (!popup) return;
    
    // Close any open popups first
    closeAllPopups();
    
    // Calculate position
    const buttonRect = triggerButton.getBoundingClientRect();
    const offset = 8; // Gap between button and popup

    // Position popup below the button
    const top = buttonRect.bottom + offset;

    // Determine alignment based on button position
    // Popups for right-side buttons should always be right-aligned
    const windowWidth = window.innerWidth;
    const buttonCenter = buttonRect.left + buttonRect.width / 2;
    const isLeftSide = buttonCenter < windowWidth / 2;
    
    // Force right alignment for specific popups (mode, context, attach)
    const forceRightAlign = ['mode-popup', 'context-popup', 'attach-popup'].includes(popupId);

    // Remove any existing alignment classes
    popup.classList.remove('align-left', 'align-right');

    if (isLeftSide && !forceRightAlign) {
      // Align popup to the left edge of button
      popup.classList.add('align-left');
      popup.style.setProperty('--popup-left', `${buttonRect.left}px`);
      popup.style.setProperty('--popup-top', `${top}px`);
    } else {
      // Align popup to the right edge of button
      popup.classList.add('align-right');
      const right = windowWidth - buttonRect.right;
      popup.style.setProperty('--popup-right', `${right}px`);
      popup.style.setProperty('--popup-top', `${top}px`);
    }

    // Open the selected popup - toggle both active class AND Tailwind classes
    popup.classList.add('active');
    popup.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
    popup.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    popup.setAttribute('aria-hidden', 'false');
    
    // Focus the close button for accessibility
    const closeBtn = popup.querySelector('.popup-close');
    if (closeBtn) {
      setTimeout(() => closeBtn.focus(), 100);
    }
  }
  
  /**
   * Closes all open popups (re-queries DOM to include dynamically created popups)
   */
  function closeAllPopups() {
    // Re-query to include dynamically created popups
    const allPopups = document.querySelectorAll('.popup');
    allPopups.forEach(popup => {
      popup.classList.remove('active');
      // Restore Tailwind hidden classes
      popup.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
      popup.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
      popup.setAttribute('aria-hidden', 'true');
    });
  }
  
  // ============================================
  // Event Listeners - Popup Triggers
  // ============================================
  
  // Open popup when trigger is clicked
  popupTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent document click from closing popup
      const popupId = this.getAttribute('data-popup');
      openPopup(popupId, this);
    });
  });
  
  // Close popup when close button is clicked
  closeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      closeAllPopups();
    });
  });
  
  // Overlay is hidden for popover style, no need for click handler
  
  // Close popup on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
    }
  });
  
  // Close popups on window resize
  window.addEventListener('resize', function () {
    closeAllPopups();
  });

  // Close popup when clicking outside
  document.addEventListener('click', function (e) {
    const isPopupClick = e.target.closest('.popup');
    const isTriggerClick = e.target.closest('[data-popup]');
    const isSlashCommandClick = e.target.closest('.slash-command-popup');
    const isInputClick = e.target.closest('.chat-input-area');

    if (!isPopupClick && !isTriggerClick) {
      closeAllPopups();
    }

    if (!isSlashCommandClick && !isInputClick && slashCommandActive) {
      hideSlashCommandPopup();
    }
  });

  // ============================================
  // Mode Handling (uses Popup component)
  // ============================================

  let currentMode = 'work'; // Default mode

  // Mode configuration for reference
  const modeConfig = {
    ask: { icon: 'chat', label: 'Ask' },
    work: { icon: 'build', label: 'Work' },
    research: { icon: 'science', label: 'Research' }
  };

  /**
   * Update the mode (delegates to Popup component)
   * @param {string} mode - The mode to set ('ask', 'work', 'research')
   */
  function setMode(mode) {
    if (!modeConfig[mode]) return;
    currentMode = mode;

    // Update via Popup component if available
    if (window.Popup) {
      window.Popup.setActive('mode-popup', mode);
    }

    // Update the mode button
    const modeButton = document.getElementById('mode-button');
    if (modeButton && modeConfig[mode]) {
      const iconEl = modeButton.querySelector('.mode-icon');
      const labelEl = modeButton.querySelector('.mode-label');
      if (iconEl) iconEl.textContent = modeConfig[mode].icon;
      if (labelEl) labelEl.textContent = modeConfig[mode].label;
      modeButton.classList.add('selected');
    }
  }

  // Expose setMode globally for workflows
  window.setMode = setMode;
  window.getCurrentMode = () => currentMode;

  // ============================================
  // Context Tags
  // ============================================
  
  const contextTags = document.querySelectorAll('.context-tag');
  contextTags.forEach(tag => {
    tag.addEventListener('click', function() {
      // Toggle selected state
      this.classList.toggle('selected');
      
      // Visual feedback
      if (this.classList.contains('selected')) {
        this.style.borderColor = 'var(--orange-50)';
        this.style.background = 'rgba(237, 68, 33, 0.1)';
      } else {
        this.style.borderColor = 'transparent';
        this.style.background = 'var(--bg-level-0)';
      }
    });
  });
  
  // ============================================
  // Popup Actions (Add Menu)
  // ============================================
  
  const popupActions = document.querySelectorAll('.popup-action');
  popupActions.forEach(action => {
    action.addEventListener('click', function() {
      const actionText = this.querySelector('span').textContent;
      
      // Insert action text into input area as a prompt
      if (inputArea) {
        inputArea.textContent = actionText + '...';
        inputArea.focus();
        
        // Place cursor at end
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(inputArea);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
      }
      
      closeAllPopups();
    });
  });
  
  // ============================================
  // Send Button
  // ============================================
  
  // Send message function (exposed globally for workflows)
  function sendMessage(options = {}) {
    const message = inputArea ? inputArea.textContent.trim() : '';
    const messageHTML = inputArea ? inputArea.innerHTML : '';
    const workflowName = options.workflowName || null;

    if (message) {
      console.log('Sending message:', message, workflowName ? `(Workflow: ${workflowName})` : '');

      // Visual feedback on button
      if (sendButton) {
        sendButton.style.transform = 'scale(0.9)';
        setTimeout(() => {
          sendButton.style.transform = '';
        }, 150);
        
        // Show checkmark briefly
        sendButton.innerHTML = '<span class="material-symbols-outlined text-[21px] text-white">check</span>';
        setTimeout(() => {
          sendButton.innerHTML = '<span class="material-symbols-outlined text-[21px] text-white">arrow_upward</span>';
        }, 1500);
      }

      // Show the text card output with skeleton animation
      if (window.TextCardOutput) {
        window.TextCardOutput.show({
          prompt: message,
          promptHTML: messageHTML, // Pass HTML to preserve tag styling
          lines: 8
        });

        // Clear input when sources card appears
        if (inputArea) {
          inputArea.innerHTML = '';
        }

        // After text animation completes, slide under and show visualization
        // Sources: 300ms + 5 tags * 100ms = ~800ms
        // Text lines: 2000ms delay + 8 lines * 80ms = ~2640ms
        // Wait for full animation then transition
        setTimeout(() => {
          window.TextCardOutput.slideUnderAndShowViz({
            workflowName: workflowName
          });
        }, 5000); // 5 seconds to watch the text animation
      }
    }
  }

  // Expose globally for workflows
  window.sendMessage = sendMessage;

  if (sendButton) {
    sendButton.addEventListener('click', sendMessage);
  }
  
  // ============================================
  // Drop Zone (Attach Popup)
  // ============================================
  
  if (dropZone) {
    // Drag events
    dropZone.addEventListener('dragover', function(e) {
      e.preventDefault();
      this.classList.add('dragover');
    });
    
    dropZone.addEventListener('dragleave', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
    });
    
    dropZone.addEventListener('drop', function(e) {
      e.preventDefault();
      this.classList.remove('dragover');
      
      const files = e.dataTransfer.files;
      if (files.length > 0) {
        console.log('Files dropped:', Array.from(files).map(f => f.name));
        // Handle file upload logic here
        handleFiles(files);
      }
    });
    
    // Click to browse
    const browseBtn = dropZone.querySelector('.btn-browse');
    if (browseBtn) {
      browseBtn.addEventListener('click', function() {
        // Create a hidden file input
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.multiple = true;
        fileInput.style.display = 'none';
        
        fileInput.addEventListener('change', function() {
          if (this.files.length > 0) {
            handleFiles(this.files);
          }
        });
        
        document.body.appendChild(fileInput);
        fileInput.click();
        document.body.removeChild(fileInput);
      });
    }
  }
  
  /**
   * Handle uploaded files
   * @param {FileList} files - The files to handle
   */
  function handleFiles(files) {
    const fileNames = Array.from(files).map(f => f.name).join(', ');
    console.log('Files selected:', fileNames);
    
    // Update drop zone to show selected files
    if (dropZone) {
      const dropZoneP = dropZone.querySelector('p');
      if (dropZoneP) {
        dropZoneP.textContent = `${files.length} file(s) selected`;
      }
    }
    
    // Close popup after a brief delay
    setTimeout(closeAllPopups, 800);
  }
  
  // ============================================
  // Input Area Placeholder
  // ============================================
  
  if (inputArea) {
    // Handle placeholder visibility
    // Check if input is truly empty (no text, just whitespace or empty tags)
    function isInputEmpty(el) {
      const text = el.textContent.trim();
      // Also check for tags - if only tags exist, not empty
      const hasTags = el.querySelector('.tag-inline, .tag-lg');
      return text === '' && !hasTags;
    }

    // Clean up empty nodes and ensure placeholder shows
    function handleEmptyState() {
      if (isInputEmpty(inputArea)) {
        // Clear any leftover empty nodes (br, empty spans, etc.)
        inputArea.innerHTML = '';
      }
    }

    inputArea.addEventListener('focus', function() {
      handleEmptyState();
    });
    
    inputArea.addEventListener('blur', function() {
      handleEmptyState();
    });
    
    inputArea.addEventListener('input', function() {
      // Small delay to let the DOM settle
      setTimeout(handleEmptyState, 0);
    });
    
    // Prevent Enter from creating new lines (optional)
    inputArea.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        // Trigger send
        if (sendButton) {
          sendButton.click();
        }
      }
    });
  }
  
  // ============================================
  // Slash Command Popup
  // ============================================

  let slashCommandActive = false;
  let selectedCommandIndex = 0;

  /**
   * Shows the slash command popup
   */
  function showSlashCommandPopup() {
    const popup = getSlashCommandPopup();
    if (!inputArea || !popup) return;

    // Close other popups
    closeAllPopups();

    // Try to get cursor position near the "/" character
    const selection = window.getSelection();
    let cursorRect = null;

    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      cursorRect = range.getBoundingClientRect();
    }

    // Fallback to input area if cursor rect isn't useful
    const inputRect = inputArea.getBoundingClientRect();
    const offset = 8;

    // Use cursor position if available, otherwise use input left edge
    const left = (cursorRect && cursorRect.left > 0) ? cursorRect.left : inputRect.left;

    // Position popup above the cursor/input
    const baseTop = (cursorRect && cursorRect.top > 0) ? cursorRect.top : inputRect.top;

    // Make popup visible first to measure its height
    popup.style.visibility = 'hidden';
    popup.classList.remove('opacity-0', 'invisible', 'pointer-events-none');
    const popupHeight = popup.offsetHeight;
    popup.style.visibility = '';

    const top = baseTop - popupHeight - offset;

    popup.style.position = 'fixed';
    popup.style.top = `${top}px`;
    popup.style.left = `${left}px`;
    popup.style.transform = 'none';

    // Show popup - toggle Tailwind classes too
    popup.classList.add('active');
    popup.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
    popup.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    popup.setAttribute('aria-hidden', 'false');
    slashCommandActive = true;
    selectedCommandIndex = 0;

    // Highlight first item
    updateSlashCommandSelection();
  }

  /**
   * Hides the slash command popup
   */
  function hideSlashCommandPopup() {
    const popup = getSlashCommandPopup();
    if (!popup) return;

    popup.classList.remove('active');
    // Restore Tailwind hidden classes
    popup.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    popup.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
    popup.setAttribute('aria-hidden', 'true');
    slashCommandActive = false;
  }

  /**
   * Updates the highlighted item in slash command popup
   */
  function updateSlashCommandSelection() {
    const items = getSlashCommandItems();
    items.forEach((item, index) => {
      if (index === selectedCommandIndex) {
        item.classList.add('bg-neutral-95', 'shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]');
        item.classList.remove('hover:bg-neutral-95/50');
      } else {
        item.classList.remove('bg-neutral-95', 'shadow-[inset_0_0_3px_0_rgba(242,242,237,0.25)]');
        item.classList.add('hover:bg-neutral-95/50');
      }
    });
  }

  /**
   * Selects a slash command
   */
  function selectSlashCommand() {
    const items = getSlashCommandItems();
    const selectedItem = items[selectedCommandIndex];
    if (!selectedItem || !inputArea) return;

    // Get tag data from attributes
    const icon = selectedItem.getAttribute('data-tag-icon') || 'label';
    const label = selectedItem.getAttribute('data-tag-label') || selectedItem.textContent.trim();

    // Get current text and find the "/" position
    const currentText = inputArea.textContent;
    const slashIndex = currentText.lastIndexOf('/');

    // Text before the slash
    const textBefore = currentText.substring(0, slashIndex);

    // Clear the input and rebuild with tag
    inputArea.textContent = '';

    // Add text before slash
    if (textBefore) {
      inputArea.appendChild(document.createTextNode(textBefore));
    }

    // Add the inline tag using Tag component
    const tagElement = window.Tag ? window.Tag.inline(icon, label) : null;
    if (tagElement) {
      inputArea.appendChild(tagElement);
    }

    // Add a space after the tag
    inputArea.appendChild(document.createTextNode(' '));

    // Move cursor to end
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(inputArea);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);

    // Hide popup
    hideSlashCommandPopup();

    // Focus the input
    inputArea.focus();
  }

  // Listen for input in chat area
  if (inputArea) {
    inputArea.addEventListener('input', function () {
      const text = this.textContent;

      // Check if user typed "/"
      if (text === '/' || text.endsWith(' /')) {
        showSlashCommandPopup();
      } else if (slashCommandActive && !text.includes('/')) {
        hideSlashCommandPopup();
      }
    });

    // Handle keyboard navigation in slash command popup
    inputArea.addEventListener('keydown', function (e) {
      if (!slashCommandActive) return;

      const items = getSlashCommandItems();
      const itemCount = items.length || 1;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex + 1) % itemCount;
        updateSlashCommandSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex - 1 + itemCount) % itemCount;
        updateSlashCommandSelection();
      } else if (e.key === 'Enter' && slashCommandActive) {
        e.preventDefault();
        selectSlashCommand();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        hideSlashCommandPopup();
      }
    });
  }

  // Note: Click handlers for slash command items are set up by Popup.init()

  // ============================================
  // Initialize Popup Component
  // ============================================
  
  if (window.Popup) {
    window.Popup.init();
  }
  
  // ============================================
  // Expose Functions for Workflow Automation
  // ============================================

  // Make these functions available globally for the workflows script
  window.openPopup = openPopup;
  window.closeAllPopups = closeAllPopups;

  console.log('🔌 Chat Bar initialized');
}

