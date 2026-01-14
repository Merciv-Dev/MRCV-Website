/**
 * Chat Bar Auto-Demo Workflows
 * Automated sequences that showcase features when user is idle
 * Now with background image transitions
 */

(function() {
  'use strict';

  // Handle both direct load and dynamic injection (DOMContentLoaded may have already fired)
  function init() {
    console.log('🎬 Workflows initializing...');
    startWorkflowEngine();
  }

  // Start immediately if DOM is ready, otherwise wait
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function startWorkflowEngine() {

  // ============================================
  // Configuration
  // ============================================
  
      const IDLE_TIMEOUT = 2000; // Wait 2 seconds before starting demo
      const TYPING_SPEED = 30; // ms per character (fast typing)
      const PAUSE_BETWEEN_ACTIONS = 400; // ms between workflow steps
      const PAUSE_BETWEEN_WORKFLOWS = 800; // ms between complete workflows

  let idleTimer = null;
  let isRunningWorkflow = false;
  let currentWorkflowIndex = 0;

      // ============================================
      // Background Images for Workflows
      // ============================================

      const backgroundImages = [
          'imgs/Runners.jpg',
          'imgs/ChildCare1.jpg',
          'imgs/Weather2.jpeg'
      ];

  // ============================================
  // Workflow Definitions
      // Each workflow can have an associated background
  // ============================================

  const workflows = [
    {
          name: 'Running Trends',
          category: 'Athletic Footwear Trends',
          background: 'imgs/Runners.jpg',
          steps: [
              { action: 'setBackground' },
              { action: 'setCategory' },
              { action: 'clear' },
              { action: 'setStatus', text: 'Typing...' },
              { action: 'type', text: 'What are the latest trends in ' },
            { action: 'slashSelect', index: 0, icon: 'checkroom', label: 'Running Shoes' },
              { action: 'type', text: ' for Q2 2026?' },
              { action: 'pause', duration: 400 },
              { action: 'setStatus', text: 'Searching...' },
              { action: 'send' },
              { action: 'pause', duration: 1500 },
              { action: 'setStatus', text: 'Analyzing...' },
              { action: 'pause', duration: 1500 },
              { action: 'setStatus', text: 'Generating...' },
              { action: 'pause', duration: 1500 },
              { action: 'setStatus', text: 'Complete' },
              { action: 'pause', duration: 7000 }, // Wait for viz to appear + 5s view time
              { action: 'clearStatus' },
              { action: 'hideOutput' },
              { action: 'clear' }, // Clear input at end of sequence
              { action: 'pause', duration: 300 },
          ]
      },
      {
          name: 'Childcare Analysis',
          category: 'Childcare Product Sales',
          background: 'imgs/ChildCare1.jpg',
      steps: [
          { action: 'setBackground' },
          { action: 'setCategory' },
        { action: 'clear' },
          { action: 'setStatus', text: 'Typing...' },
          { action: 'type', text: 'Analyze consumer sentiment for ' },
        { action: 'slashSelect', index: 2, icon: 'child_care', label: 'Baby Products' },
          { action: 'pause', duration: 300 },
          { action: 'setStatus', text: 'Searching...' },
          { action: 'send' },
          { action: 'pause', duration: 1500 },
          { action: 'setStatus', text: 'Analyzing...' },
          { action: 'pause', duration: 1500 },
          { action: 'setStatus', text: 'Generating...' },
          { action: 'pause', duration: 1500 },
          { action: 'setStatus', text: 'Complete' },
          { action: 'pause', duration: 7000 }, // Wait for viz to appear + 5s view time
          { action: 'clearStatus' },
          { action: 'hideOutput' },
          { action: 'clear' }, // Clear input at end of sequence
          { action: 'pause', duration: 300 },
      ]
    },
    {
        name: 'Weather Impact',
        category: 'Weather & Retail Impact',
        background: 'imgs/Weather2.jpeg',
      steps: [
          { action: 'setBackground' },
          { action: 'setCategory' },
        { action: 'clear' },
          { action: 'setStatus', text: 'Typing...' },
          { action: 'type', text: 'How does weather affect sales of ' },
        { action: 'slashSelect', index: 1, icon: 'checkroom', label: 'Outdoor Apparel' },
          { action: 'type', text: '?' },
          { action: 'pause', duration: 300 },
          { action: 'setStatus', text: 'Searching...' },
          { action: 'send' },
          { action: 'pause', duration: 1500 },
          { action: 'setStatus', text: 'Processing...' },
          { action: 'pause', duration: 1500 },
          { action: 'setStatus', text: 'Generating...' },
          { action: 'pause', duration: 1500 },
          { action: 'setStatus', text: 'Complete' },
          { action: 'pause', duration: 7000 }, // Wait for viz to appear + 5s view time
          { action: 'clearStatus' },
          { action: 'hideOutput' },
          { action: 'clear' }, // Clear input at end of sequence
          { action: 'pause', duration: 300 },
      ]
    }
  ];

  // ============================================
  // Workflow Actions
  // ============================================

  const actions = {
    clear: function() {
      const inputArea = document.querySelector('.chat-input-area');
      if (inputArea) {
          inputArea.innerHTML = '';
          inputArea.setAttribute('data-empty', 'true');
      }
      return Promise.resolve();
    },

    type: function(text) {
      return new Promise((resolve) => {
        const inputArea = document.querySelector('.chat-input-area');
        if (!inputArea) return resolve();

          // Remove empty attribute when typing starts
          inputArea.removeAttribute('data-empty');

        // Create a text node to append characters to (preserves existing elements like tags)
        const textNode = document.createTextNode('');
        inputArea.appendChild(textNode);

        let index = 0;
        const typeChar = () => {
          if (index < text.length && isRunningWorkflow) {
            textNode.textContent += text[index];
            index++;
            setTimeout(typeChar, TYPING_SPEED);
          } else {
            // Trigger input event for slash command detection
            inputArea.dispatchEvent(new Event('input', { bubbles: true }));
            resolve();
          }
        };
        typeChar();
      });
    },

    pause: function(duration) {
      return new Promise((resolve) => {
        setTimeout(resolve, duration);
      });
    },

    openPopup: function(popupId, triggerSelector) {
      return new Promise((resolve) => {
        const trigger = document.querySelector(triggerSelector);
        if (trigger && typeof window.openPopup === 'function') {
          window.openPopup(popupId, trigger);
        }
        setTimeout(resolve, 500);
      });
    },

    closeAllPopups: function() {
      if (typeof window.closeAllPopups === 'function') {
        window.closeAllPopups();
      }
      return Promise.resolve();
      },

      insertTag: function (icon, label) {
          return new Promise((resolve) => {
              const inputArea = document.querySelector('.chat-input-area');
              if (!inputArea || !window.Tag) return resolve();

              // Remove empty attribute
              inputArea.removeAttribute('data-empty');

              const tagElement = window.Tag.inline(icon, label);
              inputArea.appendChild(tagElement);
              resolve();
          });
      },

    // Type "/" to trigger slash popup, show it, then select an item by index
    slashSelect: function (index, icon, label) {
          return new Promise((resolve) => {
              const inputArea = document.querySelector('.chat-input-area');
              if (!inputArea) return resolve();

              // Remove empty attribute
              inputArea.removeAttribute('data-empty');

            // Type "/" character
            const slashNode = document.createTextNode('/');
            inputArea.appendChild(slashNode);

            // Get input area position for popup
            const inputRect = inputArea.getBoundingClientRect();
            const offset = 8;

            // Show the slash popup positioned above the input
            const popup = document.getElementById('slash-command-popup');
            if (popup) {
              // Position popup directly above the input area
              popup.style.position = 'fixed';
              popup.style.left = `${inputRect.left}px`;
              popup.style.bottom = `${window.innerHeight - inputRect.top + offset}px`;
              popup.style.top = 'auto';
              popup.style.transform = 'none';

              // Make popup visible
              popup.classList.remove('opacity-0', 'invisible', 'pointer-events-none', '-translate-y-2');
              popup.classList.add('opacity-100', 'visible', 'pointer-events-auto', 'translate-y-0');
              popup.setAttribute('aria-hidden', 'false');
            }

            // Wait for user to "see" the popup, then select
            setTimeout(() => {
              if (popup) {
                // Get item by index
                const items = popup.querySelectorAll('.popup-item');
                const selectedItem = items[index];

                if (selectedItem) {
                  // Highlight the selected item briefly
                  selectedItem.classList.add('bg-neutral-95');

                  setTimeout(() => {
                    // Remove the "/" from input
                    slashNode.remove();

                    // Insert the tag using existing insertTag action
                          if (window.Tag) {
                              const tagElement = window.Tag.inline(icon, label);
                            inputArea.appendChild(tagElement);
                          }

                    // Close popup
                    if (window.closeAllPopups) {
                      window.closeAllPopups();
                    }

                          resolve();
                  }, 300);
                } else {
                  resolve();
                }
              } else {
                resolve();
              }
            }, 600);
          });
      },

      send: function () {
          return new Promise((resolve) => {
              if (typeof window.sendMessage === 'function') {
                  window.sendMessage();
              }
              resolve();
          });
      },

      showOutput: function (lines) {
          return new Promise((resolve) => {
              if (window.TextCardOutput) {
                  const inputArea = document.querySelector('.chat-input-area');
                  const prompt = inputArea ? inputArea.textContent.trim() : '';
                  window.TextCardOutput.show({ prompt, lines: lines || 8 });
              }
              resolve();
          });
      },

      hideOutput: function () {
          return new Promise((resolve) => {
              if (window.TextCardOutput) {
                  window.TextCardOutput.hide();
              }
              if (window.VisualizationCard) {
                  window.VisualizationCard.hide();
              }
              resolve();
          });
      },

      // Cleanup everything before starting a new workflow
      cleanup: function () {
        return new Promise((resolve) => {
              // Hide text card output
              if (window.TextCardOutput) {
                  window.TextCardOutput.hide();
              }
              // Hide visualization card
              if (window.VisualizationCard) {
                  window.VisualizationCard.hide();
              }
              // Clear status bar
              if (window.StatusBar) {
                  window.StatusBar.clearAction();
              }
              // Wait for animations to complete
              setTimeout(resolve, 500);
          });
      },

      // New action for background changes
      setBackground: function (imageUrl) {
          return new Promise((resolve) => {
              if (window.BackgroundManager) {
                  if (imageUrl) {
                      window.BackgroundManager.setBackground(imageUrl);
                  }
                  // If no URL provided, the workflow's background will be used
              }
              // Small delay to let the transition start
              setTimeout(resolve, 200);
          });
      },

      nextBackground: function () {
          return new Promise((resolve) => {
              if (window.BackgroundManager) {
                  window.BackgroundManager.next();
              }
              setTimeout(resolve, 200);
          });
      },

      // Status bar actions
      setCategory: function (text) {
          return new Promise((resolve) => {
              if (window.StatusBar) {
                  window.StatusBar.setCategory(text);
              }
              setTimeout(resolve, 100);
          });
      },

      setStatus: function (text) {
          return new Promise((resolve) => {
              if (window.StatusBar) {
                  window.StatusBar.setAction(text);
              }
              resolve();
          });
      },

      clearStatus: function () {
          return new Promise((resolve) => {
              if (window.StatusBar) {
                  window.StatusBar.clearAction();
              }
              resolve();
          });
    }
  };

  // ============================================
  // Workflow Engine
  // ============================================

  async function runWorkflow(workflow) {
    console.log(`🎬 Running workflow: ${workflow.name}`);
    
      // Cleanup before starting new workflow
      await actions.cleanup();

      // Half pause after cleanup before starting
      await actions.pause(PAUSE_BETWEEN_WORKFLOWS / 2);

    for (const step of workflow.steps) {
      if (!isRunningWorkflow) break;

      const actionFn = actions[step.action];
      if (actionFn) {
          // Handle different action parameter patterns
          if (step.action === 'insertTag' || step.action === 'typeAsTag') {
              await actionFn(step.icon, step.label);
          } else if (step.action === 'slashSelect') {
            await actionFn(step.index, step.icon, step.label);
          } else if (step.action === 'openPopup') {
              await actionFn(step.popupId, step.triggerSelector);
          } else if (step.action === 'setBackground') {
              // Use workflow's background if step doesn't specify one
              await actionFn(step.imageUrl || workflow.background);
          } else if (step.action === 'setCategory') {
              // Use workflow's category if step doesn't specify one
              await actionFn(step.text || workflow.category);
          } else if (step.action === 'setStatus') {
              await actionFn(step.text);
          } else {
              await actionFn(step.text || step.duration || step.lines);
          }
      }

        // Skip pause for instant actions
        const skipPauseActions = ['pause', 'setBackground', 'setCategory', 'setStatus', 'clearStatus'];
        if (!skipPauseActions.includes(step.action)) {
        await actions.pause(PAUSE_BETWEEN_ACTIONS);
      }
    }
  }

  async function runAllWorkflows() {
    isRunningWorkflow = true;

      // Initialize background manager with our images
      if (window.BackgroundManager) {
          window.BackgroundManager.init({
              images: backgroundImages,
              transitionDuration: 600,
              overlayOpacity: 0.35
          });
      }

      // Initialize status bar
      if (window.StatusBar) {
          window.StatusBar.init();
      }

    while (isRunningWorkflow && currentWorkflowIndex < workflows.length) {
      await runWorkflow(workflows[currentWorkflowIndex]);
      currentWorkflowIndex++;

      if (currentWorkflowIndex < workflows.length && isRunningWorkflow) {
        await actions.pause(PAUSE_BETWEEN_WORKFLOWS);
      }
    }

    // Loop back to start
    if (isRunningWorkflow) {
      currentWorkflowIndex = 0;
      await actions.pause(PAUSE_BETWEEN_WORKFLOWS);
      runAllWorkflows();
    }
  }

  function stopWorkflow() {
    if (isRunningWorkflow) {
      console.log('⏹️  Workflow stopped by user interaction');
      isRunningWorkflow = false;
      currentWorkflowIndex = 0;
      // Don't close popups here - user may be opening one
      // Only hide workflow-generated output
      actions.hideOutput();
    }
  }

  // ============================================
  // Idle Detection
  // ============================================

  function resetIdleTimer() {
    stopWorkflow();
    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!isRunningWorkflow) {
        console.log('💤 User idle, starting workflows...');
        runAllWorkflows();
      }
    }, IDLE_TIMEOUT);
  }

  // ============================================
  // Event Listeners
  // ============================================

  // Detect user interaction to stop workflow
  const userInteractionEvents = ['mousedown', 'keydown', 'touchstart', 'scroll'];
  userInteractionEvents.forEach(eventType => {
    document.addEventListener(eventType, resetIdleTimer, { passive: true });
  });

  // Start idle detection
  resetIdleTimer();

      // Expose functions for external control
      window.Workflows = {
          start: runAllWorkflows,
          stop: stopWorkflow,
          reset: resetIdleTimer,
          setBackground: actions.setBackground,
          nextBackground: actions.nextBackground
      };

      console.log('🎭 Auto-demo workflows initialized with background support');
  } // End of startWorkflowEngine
})();

