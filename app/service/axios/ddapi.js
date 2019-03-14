'use strict';

const _ = require('lodash');
const { AxiosService } = require('naf-framework-mongoose/lib/service');

const meta = {
  message: {
    uri: '/topapi/message/corpconversation/asyncsend_v2',
    method: 'post',
  },
};

class DDAPIService extends AxiosService {
  constructor(ctx) {
    super(ctx, meta, _.get(ctx.app.config, 'axios.ddapi'));
  }
}

module.exports = DDAPIService;
