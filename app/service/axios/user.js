'use strict';

const _ = require('lodash');
const { AxiosService } = require('naf-framework-mongoose/lib/service');

const meta = {
  unitList: {
    uri: '/unit/list',
    method: 'get',
  },
};

class UserService extends AxiosService {
  constructor(ctx) {
    super(ctx, meta, _.get(ctx.app.config, 'axios.user'));
  }
}

module.exports = UserService;
