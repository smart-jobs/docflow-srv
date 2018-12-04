'use strict';

module.exports = appInfo => {
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1517455121740_7922';

  // add your config here
  // config.middleware = [];

  config.cluster = {
    listen: {
      port: 8301,
    },
  };

  config.errorMongo = {
    details: true,
  };
  config.errorHanler = {
    details: true,
  };

  // mongoose config
  config.mongoose = {
    url: 'mongodb://localhost:27017/oa',
    options: {
      useMongoClient: true,
      user: 'root',
      pass: 'Ziyouyanfa#@!',
      authSource: 'admin',
      useNewUrlParser: true,
      useCreateIndex: true,
    },
  };

  // axios service config
  config.axios = {
    user: { // 用户查询服务
      baseUrl: 'http://localhost:8001/api',
    },
  };

  return config;
};
