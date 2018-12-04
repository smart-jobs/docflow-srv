'use strict';

const _ = require('lodash');
const meta = require('./.inbox.js');
const Controller = require('egg').Controller;
const { CrudController } = require('naf-framework-mongoose/lib/controller');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { PostStatus } = require('../util/constants');

class InboxController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.post;
  }

  // 查询当前用户所在单位的收文信息
  async query() {
    let { status, skip = 0, limit = 10 } = this.ctx.query;

    if (status === PostStatus.DONE) {
      status = { $eq: PostStatus.DONE };
    } else if (status === PostStatus.NEW) {
      status = { $ne: PostStatus.DONE };
    }

    // TODO: 检查用户信息
    const unit = this.ctx.tenant;
    if (!_.isString(unit)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    const res = await this.service.queryAndCount({ unit, status }, { skip, limit, sort: { 'meta.createdAt': -1 } });
    this.ctx.ok(res);
  }
}

module.exports = CrudController(InboxController, meta);
