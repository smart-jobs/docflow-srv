'use strict';

module.exports = () => {
  const config = exports = {};

  // mongoose config
  config.mongoose = {
    // url: 'mongodb://192.168.18.100:27018/oa',
    url: 'mongodb://192.168.1.170:27018/oa',
  };

  config.logger = {
    level: 'DEBUG',
    consoleLevel: 'DEBUG',
  };

  return config;
};
