/**
 * Chat Bar Component - JavaScript
 * Handles popup interactions for the fake chat UI
 */

document.addEventListener('DOMContentLoaded', function() {
  
  // ============================================
  // DOM Elements
  // ============================================
  
  const overlay = document.getElementById('popup-overlay');
  const popups = document.querySelectorAll('.popup');
  const popupTriggers = document.querySelectorAll('[data-popup]');
  const closeButtons = document.querySelectorAll('.popup-close');
  const toggleOptions = document.querySelectorAll('.toggle-option');
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

    // Open the selected popup
    popup.classList.add('active');
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
  // Toggle Options (Thinking Popup)
  // ============================================
  
  toggleOptions.forEach(option => {
    option.addEventListener('click', function() {
      // Remove active class from all options in the same group
      const parent = this.closest('.toggle-options');
      parent.querySelectorAll('.toggle-option').forEach(opt => {
        opt.classList.remove('active');
      });
      
      // Add active class to clicked option
      this.classList.add('active');
    });
  });
  
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
  
  if (sendButton) {
    sendButton.addEventListener('click', function() {
      const message = inputArea ? inputArea.textContent.trim() : '';
      
      if (message) {
        // Simulate sending - you can customize this behavior
        console.log('Sending message:', message);
        
        // Visual feedback
        this.style.transform = 'scale(0.9)';
        setTimeout(() => {
          this.style.transform = '';
        }, 150);
        
        // Clear input (optional - comment out if you want to keep the text)
        // inputArea.textContent = '';
        
        // Show a brief "sent" state
        this.innerHTML = `
          <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 14.5L4.5 10.5L5.9 9.1L8.5 11.7L15.1 5.1L16.5 6.5L8.5 14.5Z" fill="white"/>
          </svg>
        `;
        
        setTimeout(() => {
          this.innerHTML = `
            <svg width="21" height="21" viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.66504 17.355V7.25508L5.60254 11.3176L4.41504 10.105L10.5 4.02002L16.585 10.105L15.3975 11.3176L11.335 7.25508V17.355H9.66504Z" fill="white"/>
            </svg>
          `;
        }, 1500);
      }
    });
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

    // Show popup
    slashCommandPopup.classList.add('active');
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

});

