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
  const slashCommandPopup = document.getElementById('slash-command-popup');
  const slashCommandItems = document.querySelectorAll('.slash-command-item');
  
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
    // If button is in the left half of the screen, align left
    // If button is in the right half, align right
    const windowWidth = window.innerWidth;
    const isLeftSide = buttonRect.left < windowWidth / 2;

    // Remove any existing alignment classes
    popup.classList.remove('align-left', 'align-right');

    if (isLeftSide) {
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
   * Closes all open popups
   */
  function closeAllPopups() {
    popups.forEach(popup => {
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
  // Mode Options (ASK/WORK/RESEARCH)
  // ============================================
  
  const modeButton = document.getElementById('mode-button');
  const modeOptions = document.querySelectorAll('.mode-option');
  let currentMode = 'work'; // Default mode

  // Mode configuration
  const modeConfig = {
    ask: { icon: 'chat', label: 'Ask' },
    work: { icon: 'build', label: 'Work' },
    research: { icon: 'science', label: 'Research' }
  };

  /**
   * Update the mode button to show selected mode
   * @param {string} mode - The mode to set ('ask', 'work', 'research')
   */
  function setMode(mode) {
    if (!modeConfig[mode]) return;

    currentMode = mode;
    const config = modeConfig[mode];

    if (modeButton) {
      // Update button icon and label
      const iconEl = modeButton.querySelector('.mode-icon');
      const labelEl = modeButton.querySelector('.mode-label');

      if (iconEl) iconEl.textContent = config.icon;
      if (labelEl) labelEl.textContent = config.label;

      // Add selected class for blue highlight
      modeButton.classList.add('selected');
    }

    // Update active state in popup
    modeOptions.forEach(opt => {
      if (opt.dataset.mode === mode) {
        opt.classList.add('active');
      } else {
        opt.classList.remove('active');
      }
    });
  }

  // Handle mode option clicks
  modeOptions.forEach(option => {
    option.addEventListener('click', function () {
      const mode = this.dataset.mode;
      setMode(mode);
      closeAllPopups();
    });
  });
  
  // Initialize with default mode (work is active by default)
  // Don't call setMode here to avoid blue highlight initially

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
  function sendMessage() {
    const message = inputArea ? inputArea.textContent.trim() : '';

    if (message) {
      console.log('Sending message:', message);

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
          lines: 8
        });

        // After text animation completes, slide under and show visualization
        // Sources: 300ms + 5 tags * 100ms = ~800ms
        // Text lines: 2000ms delay + 8 lines * 80ms = ~2640ms
        // Wait for full animation then transition
        setTimeout(() => {
          window.TextCardOutput.slideUnderAndShowViz({
            // Random chart type will be selected
          });
        }, 5000); // 5 seconds to watch the text animation
      }

      // Clear input
      if (inputArea) {
        inputArea.innerHTML = '';
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
    if (!inputArea || !slashCommandPopup) return;

    // Close other popups
    closeAllPopups();

    // Get input area position
    const inputRect = inputArea.getBoundingClientRect();
    const offset = 8;

    // Position popup above the input area
    const top = inputRect.top - slashCommandPopup.offsetHeight - offset;
    const left = inputRect.left;

    slashCommandPopup.style.top = `${top}px`;
    slashCommandPopup.style.left = `${left}px`;

    // Show popup - toggle Tailwind classes too
    slashCommandPopup.classList.add('active');
    slashCommandPopup.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
    slashCommandPopup.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    slashCommandPopup.setAttribute('aria-hidden', 'false');
    slashCommandActive = true;
    selectedCommandIndex = 0;

    // Highlight first item
    updateSlashCommandSelection();
  }

  /**
   * Hides the slash command popup
   */
  function hideSlashCommandPopup() {
    if (!slashCommandPopup) return;

    slashCommandPopup.classList.remove('active');
    // Restore Tailwind hidden classes
    slashCommandPopup.classList.remove('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
    slashCommandPopup.classList.add('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
    slashCommandPopup.setAttribute('aria-hidden', 'true');
    slashCommandActive = false;
  }

  /**
   * Updates the highlighted item in slash command popup
   */
  function updateSlashCommandSelection() {
    slashCommandItems.forEach((item, index) => {
      if (index === selectedCommandIndex) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  /**
   * Selects a slash command
   */
  function selectSlashCommand() {
    const selectedItem = slashCommandItems[selectedCommandIndex];
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

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex + 1) % slashCommandItems.length;
        updateSlashCommandSelection();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        selectedCommandIndex = (selectedCommandIndex - 1 + slashCommandItems.length) % slashCommandItems.length;
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

  // Click on slash command item
  slashCommandItems.forEach((item, index) => {
    item.addEventListener('click', function () {
      selectedCommandIndex = index;
      selectSlashCommand();
    });
  });

  // ============================================
  // Initialize
  // ============================================
  
  console.log('Chat Bar initialized');
  
  // ============================================
  // Expose Functions for Workflow Automation
  // ============================================

  // Make these functions available globally for the workflows script
  window.openPopup = openPopup;
  window.closeAllPopups = closeAllPopups;

  console.log('🔌 Chat Bar initialized');
}

