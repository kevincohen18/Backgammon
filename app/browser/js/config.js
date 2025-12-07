import * as comm from '../../../lib/comm.js';

const defaultServerURL = import.meta.env.VITE_SERVER_URL || '';
const fallbackServerURL = (typeof window !== 'undefined')
  ? `${window.location.protocol}//${window.location.hostname}:${comm.Protocol.Port}`
  : '';

const config = {
  containerID: 'backgammon',
  boardUI: '../app/browser/js/SimpleBoardUI.js',
  defaultRule: 'RuleBgCasual',
  selectableRules: [
    'RuleBgCasual',
    'RuleBgGulbara',
    'RuleBgTapa',
  ],
  serverURL: defaultServerURL || fallbackServerURL,
};

// Make sure window is available
if (typeof window !== 'undefined') {
  console.log('Config serverURL:', config.serverURL);
}

export default config;
