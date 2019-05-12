'use strict';

module.exports = () => {
  const config = (exports = {});

  // mongoose config
  config.mongoose = {
    url: 'mongodb://localhost:27018/oa'
  };

  // mq config
  config.amqp = {
    client: {
      hostname: '192.168.1.190'
    }
  };

  config.logger = {
    // level: 'DEBUG',
    // consoleLevel: 'DEBUG',
  };

  return config;
};
