'use strict';

const _ = require('lodash');
const meta = require('./.draft.js');
const Controller = require('egg').Controller;
const { CrudController } = require('naf-framework-mongoose/lib/controller');
const { BusinessError, ErrorCode } = require('naf-core').Error;

class DraftController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.docs;
  }

  // 查询当前用户起草的公文
  async query() {
    const { skip = 0, limit = 10 } = this.ctx.query;
    // TODO: 检查用户信息
    const userid = this.ctx.userid;
    if (!_.isString(userid)) throw new BusinessError(ErrorCode.NOT_LOGIN);
    const res = await this.service.queryAndCount({ userid }, { skip, limit, sort: { 'meta.createdAt': -1 } });
    this.ctx.ok(res);
  }
}

module.exports = CrudController(DraftController, meta);
