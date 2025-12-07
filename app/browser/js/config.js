const config = {
  containerID: 'backgammon',
  boardUI: '../app/browser/js/SimpleBoardUI.js',
  defaultRule: 'RuleBgCasual',
  selectableRules: [
    'RuleBgCasual',
    'RuleBgGulbara',
    'RuleBgTapa',
  ],
  serverURL: window.location.host, // Socket.io will use current host, Vite proxy handles /socket.io
};

// Make sure window is available
if (typeof window !== 'undefined') {
  console.log('Config serverURL:', config.serverURL);
}

export default config;