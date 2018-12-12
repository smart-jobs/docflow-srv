'use strict';

const _ = require('lodash');
const meta = require('./.draft.js');
const Controller = require('egg').Controller;
const { CrudController } = require('naf-framework-mongoose/lib/controller');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { DocStatus } = require('../util/constants');

class DraftController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.docs;
  }

  // 查询当前用户起草的公文
  async query() {
    let { status, skip = 0, limit = 10 } = this.ctx.query;
    if (status !== DocStatus.DRAFT) {
      status = { $ne: DocStatus.DRAFT };
    }
    if (!_.isUndefined(skip) && !_.isNumber(skip)) skip = Number(skip);
    if (!_.isUndefined(limit) && !_.isNumber(limit)) limit = Number(limit);

    // TODO: 检查用户信息
    const userid = this.ctx.userid;
    if (!_.isString(userid)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    const filter = { 'meta.createdBy': userid, status };
    const res = await this.service.queryAndCount(filter, { skip, limit, sort: { 'meta.createdAt': -1 } });
    this.ctx.ok(res);
  }
}

module.exports = CrudController(DraftController, meta);
