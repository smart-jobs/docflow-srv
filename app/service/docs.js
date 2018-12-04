'use strict';

const assert = require('assert');
const _ = require('lodash');
const moment = require('moment');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { isNullOrUndefined, trimData } = require('naf-core').Util;
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { DocStatus } = require('../util/constants');

class DocsService extends CrudService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Docs;
  }

  async create({ docno, title, content, receiver, attachment, expiredAt, feedback, action }) {
    // 检查数据
    assert(_.isString(docno), 'docno不能为空');
    assert(_.isString(title), 'title不能为空');
    assert(_.isString(content), 'content不能为空');
    assert(receiver, 'receiver不能为空');
    assert(_.isArray(receiver), 'receiver必须为数组');
    assert(!expiredAt || _.isDate(expiredAt), 'expiredAt必须为Date');
    if (!feedback) {
      feedback = { required: false };
    } else {
      assert(_.isObject(feedback), 'feedback必须为对象');
      assert(feedback.fields, 'feedback.fields不能为空');
      assert(_.isArray(feedback.fields), 'feedback.fields必须为数组');
    }
    if (!expiredAt) {
      expiredAt = moment().add(1, 'months').toDate();
    }

    // TODO: 检查用户信息
    const userid = this.ctx.userid;
    if (!_.isString(userid)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    // TODO: 查询数据是否存在
    const doc = await this.model.findOne({ docno }).exec();
    if (doc) {
      throw new BusinessError(ErrorCode.DATA_EXISTED, '文号已经存存在');
    }

    // TODO:保存数据
    const data = {
      docno, title, content, receiver, attachment, feedback, status: DocStatus.DRAFT,
      meta: { createdBy: userid, expiredAt }
    };

    const res = await this.model.create(data);

    // TODO: 立即发送
    if (action === 'post') {
      console.log('立即发送...');
      this.postDoc(res._id);
    }

    return res;
  }

  async update({ id }, { docno, title, content, receiver, attachment, expiredAt, feedback }) {
    // 检查数据
    assert(id, 'id不能为空');
    assert(!docno || _.isString(docno), 'docno不能为空');
    assert(!title || _.isString(title), 'title不能为空');
    assert(!content || _.isString(content), 'content不能为空');
    assert(!receiver || _.isArray(receiver), 'receiver必须为数组');
    assert(!expiredAt || _.isDate(expiredAt), 'expiredAt必须为Date');
    if (feedback) {
      assert(_.isObject(feedback), 'feedback必须为对象');
      assert(feedback.fields, 'feedback.fields不能为空');
      assert(_.isArray(feedback.fields), 'feedback.fields必须为数组');
    }

    // TODO: 检查用户信息
    const userid = this.ctx.userid;
    if (!_.isString(userid)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    // TODO:检查数据是否存在
    const doc = await this.model.findById(id).exec();
    if (isNullOrUndefined(doc)) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST);
    }

    // TODO:检查数据状态
    if (doc.status !== DocStatus.DRAFT) {
      throw new BusinessError(ErrorCode.SERVICE_FAULT, '数据无法修改');
    }

    // TODO:保存数据
    const meta = trimData({ expiredAt, updatedBy: userid });
    const data = trimData({ docno, title, content, receiver, attachment, feedback, meta });
    const res = await this.model.findByIdAndUpdate(id, data, { new: true }).exec();
    return res;
  }

  async post({ id }) {
    // 检查数据
    assert(id, 'id不能为空');

    // TODO: 检查用户信息
    const userid = this.ctx.userid;
    if (!_.isString(userid)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    // TODO:检查数据是否存在
    const doc = await this.model.findById(id).exec();
    if (isNullOrUndefined(doc)) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST);
    }

    // TODO: 检查数据状态
    if (doc.status !== DocStatus.DRAFT) {
      throw new BusinessError(ErrorCode.SERVICE_FAULT, '公务已发送');
    }

    // TODO: 批量投递
    await this.ctx.service.post.batchCreate({ docid: doc._id, receiver: doc.receiver });

    // TODO: 修改公文状态
    doc.status = DocStatus.POST;
    doc.meta.postedAt = new Date();
    doc.meta.updatedBy = userid;
    return await doc.save();
  }

  async delete({ id }) {

    // TODO: 检查数据状态
    const doc = await this.model.findById(id).exec();
    if (!doc) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST);
    }
    if (doc.status !== DocStatus.DRAFT) {
      throw new BusinessError(ErrorCode.SERVICE_FAULT, '公文已发送，不能删除');
    }

    await this.model.findByIdAndDelete(id).exec();
  }

  // 办结公文
  async finish({ id }) {
    // 检查数据
    assert(id, 'id不能为空');

    // TODO: 检查用户信息
    const userid = this.ctx.userid;
    if (!_.isString(userid)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    // TODO:检查数据是否存在
    const doc = await this.model.findById(id).exec();
    if (isNullOrUndefined(doc)) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST);
    }

    // TODO: 检查数据状态
    if (doc.status === DocStatus.DONE) {
      throw new BusinessError(ErrorCode.SERVICE_FAULT, '公务已办结');
    }

    // TODO: 修改公文状态
    doc.status = DocStatus.DONE;
    doc.meta.updatedBy = userid;
    return await doc.save();
  }

  async fetch({ id }) {
    const doc = await this.model.findById(id, '+content').exec();
    return doc;
  }
}

module.exports = DocsService;
