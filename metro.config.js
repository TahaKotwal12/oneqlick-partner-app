const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add resolver for react-dom
config.resolver.alias = {
  ...config.resolver.alias,
  'react-dom': 'react-dom/client',
};

module.exports = config;
