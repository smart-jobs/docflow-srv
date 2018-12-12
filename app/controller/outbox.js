'use strict';

const _ = require('lodash');
const meta = require('./.outbox.js');
const Controller = require('egg').Controller;
const { CrudController } = require('naf-framework-mongoose/lib/controller');
const { DocStatus } = require('../util/constants');

class DraftController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.docs;
  }

  // 查询当前系统的公文
  async query() {
    let { status = DocStatus.POST, skip = 0, limit = 10 } = this.ctx.query;
    if (!_.isUndefined(skip) && !_.isNumber(skip)) skip = Number(skip);
    if (!_.isUndefined(limit) && !_.isNumber(limit)) limit = Number(limit);
    const res = await this.service.queryAndCount({ status }, { skip, limit, sort: { 'meta.createdAt': -1 } });
    this.ctx.ok(res);
  }
}

module.exports = CrudController(DraftController, meta);
