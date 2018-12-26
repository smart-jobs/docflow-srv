'use strict';

const _ = require('lodash');
const fs = require('fs');
const path = require('path');

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
    let filter = { status };
    if (status === 'feedback') {
      filter = { status: DocStatus.POST, 'feedback.required': true };
    }
    const res = await this.service.queryAndCount(filter, { skip, limit, sort: { 'meta.createdAt': -1 } });
    this.ctx.ok(res);
  }

  // 查询公文回执信息
  async feedback() {
    const { docid } = this.ctx.query;

    const service = this.ctx.service.post;
    // const filter = { receiver: { $elemMatch: { $in: [ 'all', unit ] } }, status };
    const filter = { docid };
    let rs = await service.query(filter, { sort: 'unit' });
    rs = rs.reduce((p, c) => {
      const a = c.feedback.map(f => [ ...f, c.unit ]);
      return p.concat(a);
    }, []);
    this.ctx.ok({ data: rs });
  }

  async export() {
    const { docid } = this.ctx.query;

    const service = this.ctx.service.post;
    const res = await service.exportFeedback({ docid });
    this.ctx.set('content-type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    this.ctx.set('content-disposition', 'attachment;filename=' + res.name);
    this.ctx.body = fs.createReadStream(path.join(res.dir, res.name));
  }

}

module.exports = CrudController(DraftController, meta);
