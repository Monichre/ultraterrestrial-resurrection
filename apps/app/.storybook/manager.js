import { addons } from '@storybook/manager-api';

// Performance optimizations for manager
addons.setConfig({
  // Disable panel animations for faster rendering
  // panelPosition: 'side',
  
  // Reduce UI complexity
  showPanel: false,
  showNav: true,
  isFullscreen: true,

  
  
  // Performance settings
  previewTabs: {
    'storybook/docs/panel': { hidden: true }, // Hide docs tab for speed
  },
});

// Mock globals for Storybook environment (moved from previous implementation)
if (typeof global !== 'undefined') {
  // Ensure global window object exists
  if (typeof global.window === 'undefined') {
    global.window = {};
  }
  
  // Mock location if it doesn't exist
  if (!global.window.location) {
    global.window.location = {
      href: 'http://localhost:6006',
      origin: 'http://localhost:6006',
      protocol: 'http:',
      host: 'localhost:6006',
      hostname: 'localhost',
      port: '6006',
      pathname: '/',
      search: '',
      hash: ''
    };
  }
}