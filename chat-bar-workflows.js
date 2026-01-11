/**
 * Chat Bar Auto-Demo Workflows
 * Automated sequences that showcase features when user is idle
 */

document.addEventListener('DOMContentLoaded', function() {
  'use strict';

  // ============================================
  // Configuration
  // ============================================
  
  const IDLE_TIMEOUT = 3000; // Wait 3 seconds before starting demo
  const TYPING_SPEED = 80; // ms per character
  const PAUSE_BETWEEN_ACTIONS = 1500; // ms between workflow steps
  const PAUSE_BETWEEN_WORKFLOWS = 2000; // ms between complete workflows

  let idleTimer = null;
  let isRunningWorkflow = false;
  let currentWorkflowIndex = 0;

  // ============================================
  // Workflow Definitions
  // ============================================

  const workflows = [
    {
          name: 'Tag Demo',
          steps: [
              { action: 'clear' },
              { action: 'type', text: 'Help me understand the trends for ' },
              { action: 'insertTag', icon: 'steps', label: 'Summer Footwear' },
              { action: 'type', text: ' this season' },
              { action: 'pause', duration: 3000 },
              { action: 'clear' },
          ]
      },
      {
      name: 'Feature Tour',
      steps: [
        { action: 'clear' },
          { action: 'type', text: 'Create a campaign for ' },
          { action: 'insertTag', icon: 'folder', label: "Spring/Summer '26" },
          { action: 'pause', duration: 1500 },
        { action: 'openPopup', popupId: 'thinking-popup', triggerSelector: '[data-popup="thinking-popup"]' },
        { action: 'pause', duration: 2000 },
        { action: 'closeAllPopups' },
        { action: 'pause', duration: 500 },
        { action: 'openPopup', popupId: 'context-popup', triggerSelector: '[data-popup="context-popup"]' },
        { action: 'pause', duration: 2000 },
        { action: 'closeAllPopups' },
      ]
    },
    {
      name: 'Slash Command Demo',
      steps: [
        { action: 'clear' },
        { action: 'type', text: 'Show me the latest trends for /' },
        { action: 'pause', duration: 2000 },
        { action: 'clear' },
      ]
    },
    {
      name: 'Quick Actions',
      steps: [
        { action: 'clear' },
        { action: 'openPopup', popupId: 'add-menu', triggerSelector: '[data-popup="add-menu"]' },
        { action: 'pause', duration: 2000 },
        { action: 'closeAllPopups' },
        { action: 'pause', duration: 500 },
        { action: 'type', text: 'Write compelling product copy' },
        { action: 'pause', duration: 1500 },
        { action: 'clear' },
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
          inputArea.innerHTML = ''; // Use innerHTML to fully clear
      }
      return Promise.resolve();
    },

    type: function(text) {
      return new Promise((resolve) => {
        const inputArea = document.querySelector('.chat-input-area');
        if (!inputArea) return resolve();

        let index = 0;
        const typeChar = () => {
          if (index < text.length && isRunningWorkflow) {
            inputArea.textContent += text[index];
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

              const tagElement = window.Tag.inline(icon, label);
              inputArea.appendChild(tagElement);
              resolve();
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
              resolve();
          });
    }
  };

  // ============================================
  // Workflow Engine
  // ============================================

  async function runWorkflow(workflow) {
    console.log(`🎬 Running workflow: ${workflow.name}`);
    
    for (const step of workflow.steps) {
      if (!isRunningWorkflow) break;

      const actionFn = actions[step.action];
      if (actionFn) {
          // Handle different action parameter patterns
          if (step.action === 'insertTag') {
              await actionFn(step.icon, step.label);
          } else if (step.action === 'openPopup') {
              await actionFn(step.popupId, step.triggerSelector);
          } else {
              await actionFn(step.text || step.duration);
          }
      }

      if (step.action !== 'pause') {
        await actions.pause(PAUSE_BETWEEN_ACTIONS);
      }
    }
  }

  async function runAllWorkflows() {
    isRunningWorkflow = true;

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
      actions.closeAllPopups();
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

  console.log('🎭 Auto-demo workflows initialized');
});

