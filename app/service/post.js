'use strict';

const util = require('util');
const fs = require('fs');
const path = require('path');
const os = require('os');
const assert = require('assert');
const _ = require('lodash');
const xlsx = require('xlsx');
const moment = require('moment');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const { CrudService } = require('naf-framework-mongoose/lib/service');
const { PostStatus, DocStatus } = require('../util/constants');
const { trimData } = require('naf-core').Util;

class PostService extends CrudService {
  constructor(ctx) {
    super(ctx);
    this.model = this.ctx.model.Post;
    this.mDocs = this.ctx.model.Docs;
  }

  async batchCreate({ docid, receiver }) {
    // 检查数据
    assert(_.isString(docid), 'docid不能为空');
    assert(_.isArray(receiver), 'receiver必须为数组');
    assert(receiver.length > 0, 'receiver不能为空');

    // TODO: 1.生成投递单位列表
    if (receiver.indexOf('all') !== -1) {
      // TODO: 发送给全部用户
      const rs = await this.ctx.service.axios.user.unitList();
      receiver = rs.map(p => p.code);
    }

    // TODO: 2.保存投递记录{userid,username,unit,department,status,createDate,updateDate}
    const datas = receiver.map(item => ({ docid, status: PostStatus.NEW, unit: item }));
    await this.model.insertMany(datas);

    // TODO: 3.发送消息
    // let res = await wxapi.sendTextMessage({
    //   touser: users.map(p => p.userid).join('|'),
    //   content: `收到新的公文《${doc.title}》,请及时查收。`
    // })
  }

  // 读取公文详情
  async fetch({ docid }) {
    // 检查数据
    assert(_.isString(docid), 'docid不能为空');

    // TODO: 检查用户信息
    const unit = this.ctx.tenant;
    if (!_.isString(unit)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    // TODO: 读取公文信息和发文信息
    const doc = await this.ctx.service.docs.fetch({ id: docid });
    if (!doc) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '公文信息不存在');
    }

    let post = await this.model.findOne({ docid, unit });
    if (!post) throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '收文信息不存在');

    // TODO: 更新收文状态
    if (post.status === PostStatus.NEW) {
      post.status = PostStatus.READ;
      if (!doc.feedback || !doc.feedback.required) post.status = PostStatus.DONE; // 如果不需要回执，直接将状态标记为完成
      post = await post.save();
    }

    return { doc, post };
  }

  // TODO: 提交公文回执
  async feedback({ docid }, { feedback }) {
    // 检查数据
    assert(_.isString(docid), 'docid不能为空');
    assert(_.isArray(feedback), 'feecback必须为数组');

    // TODO: 检查用户信息
    const unit = this.ctx.tenant;
    if (!_.isString(unit)) throw new BusinessError(ErrorCode.NOT_LOGIN);

    // TODO: 读取公文信息和发文信息
    const doc = await this.ctx.service.docs.fetch({ id: docid });
    if (!doc) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '公文信息不存在');
    }

    let post = await this.model.findOne({ docid, unit });
    if (!post) throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '收文信息不存在');

    // TODO: 检查公文状态
    if (doc.status === DocStatus.DONE) throw new BusinessError(ErrorCode.SERVICE_FAULT, '公文已办结，不能提交回执信息');

    // TODO: 保存数据
    post.status = PostStatus.DONE;
    post.feedback = feedback;
    post = await post.save();
    return post;
  }

  // TODO: 催办公文
  async remind({ docid, unit }) {
    // 检查数据
    assert(_.isString(docid), 'docid不能为空');

    // TODO: 读取公文信息和发文信息
    const doc = await this.ctx.service.docs.fetch({ id: docid });
    if (!doc) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '公文信息不存在');
    }

    const query = trimData({ docid, unit, status: { $ne: PostStatus.DONE } });
    const rs = await this.model.find(query);
    // TODO: 发送通知
    // console.log('remind:', rs);
    // const { agent_id } = this.app.config.axios.ddapi;
    // const userid_list	 = '';
    // const msg = { msgtype: 'text', text: { content: '消息内容' } };
    // const data = { agent_id, userid_list, msg };
    // const res = await this.service.axios.ddapi.message(data);
    // this.ctx.logger.debug('【发送通知消息】', res);
    // TODO: 发送提醒消息到MQ
    const units = rs.map(p => p.unit);
    const msg = `您有新的公文《${doc.title}》,请尽快查收办理。`;
    const data = JSON.stringify({ units, msg });
    const { mq } = this.ctx;
    const ex = 'service.docs';
    if (mq) {
      await mq.topic(ex, 'remind', data, { durable: true });
    } else {
      this.ctx.logger.error('!!!!!!没有配置MQ插件!!!!!!');
    }
  }

  async exportFeedback({ docid }) {
    // 检查数据
    assert(_.isString(docid), 'docid不能为空');

    // TODO: 读取公文信息和发文信息
    const doc = await this.mDocs.findById(docid);
    if (!doc) {
      throw new BusinessError(ErrorCode.DATA_NOT_EXIST, '公文信息不存在');
    }

    let rs = await this.query({ docid }, { sort: 'unit' });
    rs = rs.reduce((p, c) => {
      const a = c.feedback.map(f => [ ...f, c.unit ]);
      return p.concat(a);
    }, []);

    const header = [ ...doc.feedback.fields, '所在学校' ];
    const name = moment().format('YYYYMMDDHHmmss') + '.xlsx';
    const mkdtemp = util.promisify(fs.mkdtemp);
    const dir = await mkdtemp(path.join(os.tmpdir(), 'docflow-'));
    const file = path.join(dir, name);

    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.aoa_to_sheet([ header, ...rs ]);
    xlsx.utils.book_append_sheet(wb, ws);
    xlsx.writeFile(wb, file);
    return { dir, name };
  }
}

module.exports = PostService;
