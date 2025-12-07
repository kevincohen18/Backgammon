import 'bootstrap/dist/css/bootstrap.min.css';
import $ from 'jquery';
import Cookies from 'js-cookie';
import ClipboardJS from 'clipboard';
import * as bootstrap from 'bootstrap';
import cl from '../../../lib/client.js';
import comm from '../../../lib/comm.js';
import model from '../../../lib/model.js';
import '../../../lib/rules/rule.js';
import '../../../lib/rules/RuleBgCasual.js';
import '../../../lib/rules/RuleBgGulbara.js';
import '../../../lib/rules/RuleBgTapa.js';
import '../style/backgammon.css';
import '../style/ribbons.css';
import '../style/dice.css';
import { ToastNotification } from './notifications.js';

// Make jQuery available globally for Bootstrap compatibility
window.jQuery = window.$ = $;

class App {
  constructor() {
    this._config = {};
    this._isWaiting = false;
    this._isChallenging = false;
    this._currentView = 'index';
  }

  setIsWaiting(value) {
    this._isWaiting = value;
  }

  setIsChallenging(value) {
    this._isChallenging = value;
  }

  setCurrentView(name) {
    this._currentView = name;
  }

  updateView() {
    if (this._isChallenging) {
      $('#waiting-overlay .challenge').show();
    } else {
      $('#waiting-overlay .challenge').hide();
    }

    if (this._isWaiting) {
      $('#waiting-overlay').show();
    } else {
      $('#waiting-overlay').hide();
    }

    $('#game-view').hide();
    $('#index-view').hide();
    $('#github-ribbon').hide();
    if (this._currentView === 'index') {
      $('#index-view').show();
      $('#github-ribbon').show();
    } else if (this._currentView === 'game') {
      $('#game-view').show();
    }
  }

  /**
   * Get name of rule selected by player
   * @returns {string} Name of selected rule
   */
  getSelectedRuleName() {
    const selected = $('#rule-selector input:checked').val();
    return selected || '*';
  }

  /**
   * Load rule module dynamically
   * @param {string} ruleName - Rule's name, equal to rule's class name (eg. RuleBgCasual)
   * @returns {Promise<Rule>} Corresponding rule object
   * @throws {Error} If rule cannot be loaded
   */
  async loadRule(ruleName) {
    try {
      const fileName = model.Utils.sanitizeName(ruleName);
      const ruleModule = await import(`../../../lib/rules/${fileName}.js`);
      const rule = ruleModule.default || ruleModule;
      rule.name = fileName;
      return rule;
    } catch (error) {
      console.error(`Failed to load rule: ${ruleName}`, error);
      throw new Error(`Rule ${ruleName} could not be loaded`);
    }
  }

  /**
   * Initialize selector of game rule
   */
  async initRuleSelector() {
    const selector = $('#rule-selector');
    for (const ruleName of this._config.selectableRules) {
      const rule = await this.loadRule(ruleName);
      const isSelected = false;
      const isActive = isSelected ? 'active' : '';
      const isChecked = isSelected ? 'checked' : '';

      let item = $('#tmpl-rule-selector-item').html();
      item = item.replace(/\{\{name\}\}/g, rule.name);
      item = item.replace(/\{\{title\}\}/g, rule.title);
      item = item.replace(/\{\{active\}\}/g, isActive);
      item = item.replace(/\{\{checked\}\}/g, isChecked);

      selector.append($(item));
    }
  }
  
  /**
   * Initialize application. Must be called after DOM is ready.
   * @param {Object} config - Configuration object
   * @param {string} config.containerID - ID of the container element
   * @param {string} config.boardUI - Path to board UI module
   * @param {string} config.defaultRule - Default rule name
   * @param {string[]} config.selectableRules - Array of selectable rule names
   * @param {string} [config.serverURL] - Server URL (optional)
   * @returns {Promise<void>}
   */
  async init(config) {
    console.log('App.init called with config:', config);
    this._config = config;

    try {
      await this.initRuleSelector();
      console.log('Rule selector initialized');
    } catch (error) {
      console.error('Error initializing rule selector:', error);
    }

    // Initialize the overlay showing game results
    $('#game-result-overlay').on('click', () => {
      $('#game-result-overlay').hide();
    });

    // Initialize clipboard
    try {
      new ClipboardJS('.btn-copy', {
        text: (trigger) => {
          const target = document.querySelector(trigger.getAttribute('data-clipboard-target'));
          return target ? target.value : '';
        },
      });
      console.log('Clipboard initialized');
    } catch (error) {
      console.error('Error initializing clipboard:', error);
    }

    // Initialize game client
    console.log('Creating client with config:', this._config);
    let client;
    try {
      client = new cl.Client(this._config);
      console.log('Client created successfully:', client);
    } catch (error) {
      console.error('Error creating client:', error);
      console.error('Client class:', cl);
      ToastNotification.error('Failed to initialize game client. Check console for details.');
      return;
    }

    // Subscribe to events used on landing page
    client.subscribe(comm.Message.EVENT_MATCH_START, (msg, params) => {
      this.setIsWaiting(false);
      this.setCurrentView('game');
      this.updateView();
      client.resizeUI();
    });

    client.subscribe(comm.Message.EVENT_MATCH_OVER, (msg, params) => {
      this.setIsWaiting(false);
      this.setCurrentView('index');
      this.updateView();
    });

    client.subscribe(comm.Message.EVENT_PLAYER_JOINED, (msg, params) => {
      this.setIsWaiting(false);
      this.setCurrentView('game');
      this.updateView();
      client.resizeUI();
    });

    client.subscribe(comm.Message.JOIN_MATCH, (msg, params) => {
      if (!params.result) {
        return;
      }
      this.setIsWaiting(false);
      this.setCurrentView('game');
      this.updateView();
      client.resizeUI();
    });

    client.subscribe(comm.Message.CREATE_GUEST, (msg, params) => {
      if (!params.reconnected) {
        // Get matchID from query string (?join=123456)
        const matchID = parseInt((location.search.split('join=')[1] || '').split('&')[0], 10);

        // Join game
        client.reqJoinMatch(matchID);

        // Remove query string from URL
        if (history.pushState) {
          history.pushState(null, '', '/');
        }
      }
    });

    $('#btn-play-random').on('click', (e) => {
      e.preventDefault();
      console.log('Random player button clicked');
      try {
        this.setIsChallenging(false);
        this.setIsWaiting(true);
        this.updateView();
        const ruleName = this.getSelectedRuleName();
        console.log('Selected rule:', ruleName);
        Cookies.set('selectedRule', ruleName, { expires: 30 });
        if (!client || !client.reqPlayRandom) {
          throw new Error('Client not initialized or reqPlayRandom method missing');
        }
        client.reqPlayRandom(ruleName);
      } catch (error) {
        console.error('Error starting random game:', error);
        console.error('Error stack:', error.stack);
        this.setIsChallenging(false);
        this.setIsWaiting(false);
        this.updateView();
        ToastNotification.error('Failed to start game: ' + error.message);
      }
    });

    $('#btn-challenge-friend').on('click', (e) => {
      e.preventDefault();
      console.log('Challenge friend button clicked');
      try {
        this.setIsChallenging(false);
        this.setIsWaiting(true);
        this.updateView();

        const ruleName = this.getSelectedRuleName();
        console.log('Selected rule:', ruleName);
        Cookies.set('selectedRule', ruleName, { expires: 30 });

        if (!client || !client.reqCreateMatch) {
          throw new Error('Client not initialized or reqCreateMatch method missing');
        }

        client.reqCreateMatch(ruleName, (msg, clientMsgSeq, reply) => {
          if (!reply || !reply.result) {
            this.setIsChallenging(false);
            this.setIsWaiting(false);
            this.updateView();
            ToastNotification.error('Failed to create match. Please try again.');
            return;
          }

          try {
            let serverURL = this._config.serverURL;
            if (!serverURL) {
              serverURL = `${window.location.protocol}//${window.location.host}/`;
            }
            $('#challenge-link').val(`${serverURL}?join=${reply.matchID}`);
            this.setIsChallenging(true);
            this.updateView();
          } catch (error) {
            console.error('Error creating challenge link:', error);
            ToastNotification.error('Match created but failed to generate link.');
          }
        });
      } catch (error) {
        console.error('Error challenging friend:', error);
        this.setIsChallenging(false);
        this.setIsWaiting(false);
        this.updateView();
        ToastNotification.error('Failed to create challenge. Please try again.');
      }
    });

    $(window).on('resize', () => {
      client.resizeUI();
    });
  }
}

const app = new App();

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('ServiceWorker registered:', registration.scope);
      })
      .catch((error) => {
        console.error('ServiceWorker registration failed:', error);
      });
  });
}

// Global error handler
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  ToastNotification.error('An unexpected error occurred. Please refresh the page.');
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  ToastNotification.error('An error occurred. Please try again.');
});

$(document).ready(async () => {
  try {
    console.log('Initializing application...');
    
    // Prepare client config
    const config = (await import('./config.js')).default;
    console.log('Config loaded:', config);

    // Load saved rule preference
    const savedRule = Cookies.get('selectedRule');
    if (savedRule) {
      const ruleInput = $(`#rule-selector input[value="${savedRule}"]`);
      if (ruleInput.length) {
        ruleInput.prop('checked', true);
        ruleInput.parent().addClass('active');
      }
    }

    console.log('Initializing app with config...');
    await app.init(config);
    console.log('Application initialized successfully');
    
    // Verify buttons exist and add click handlers as fallback
    setTimeout(() => {
      if ($('#btn-play-random').length === 0) {
        console.error('btn-play-random button not found!');
      } else {
        console.log('btn-play-random button found');
      }
      if ($('#btn-challenge-friend').length === 0) {
        console.error('btn-challenge-friend button not found!');
      } else {
        console.log('btn-challenge-friend button found');
      }
    }, 1000);
  } catch (error) {
    console.error('Failed to initialize application:', error);
    console.error('Error stack:', error.stack);
    ToastNotification.error('Failed to load application. Please refresh the page.', 10000);
  }
});
