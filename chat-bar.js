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
  
  // ============================================
  // Popup Functions
  // ============================================
  
  /**
   * Opens a popup by ID
   * @param {string} popupId - The ID of the popup to open
   */
  function openPopup(popupId) {
    const popup = document.getElementById(popupId);
    if (!popup) return;
    
    // Close any open popups first
    closeAllPopups();
    
    // Open the selected popup
    popup.classList.add('active');
    popup.setAttribute('aria-hidden', 'false');
    overlay.classList.add('active');
    
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
    overlay.classList.remove('active');
  }
  
  // ============================================
  // Event Listeners - Popup Triggers
  // ============================================
  
  // Open popup when trigger is clicked
  popupTriggers.forEach(trigger => {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const popupId = this.getAttribute('data-popup');
      openPopup(popupId);
    });
  });
  
  // Close popup when close button is clicked
  closeButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      e.preventDefault();
      closeAllPopups();
    });
  });
  
  // Close popup when overlay is clicked
  if (overlay) {
    overlay.addEventListener('click', closeAllPopups);
  }
  
  // Close popup on Escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeAllPopups();
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
    inputArea.addEventListener('focus', function() {
      if (this.textContent === '') {
        this.setAttribute('data-empty', 'true');
      }
    });
    
    inputArea.addEventListener('blur', function() {
      if (this.textContent === '') {
        this.removeAttribute('data-empty');
      }
    });
    
    inputArea.addEventListener('input', function() {
      if (this.textContent === '') {
        this.setAttribute('data-empty', 'true');
      } else {
        this.removeAttribute('data-empty');
      }
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
  // Initialize
  // ============================================
  
  console.log('Chat Bar initialized');
  
});

