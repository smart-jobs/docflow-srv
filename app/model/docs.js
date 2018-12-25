/**
 * 公文信息
 */
'use strict';
const Schema = require('mongoose').Schema;
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');
const { DocStatus } = require('../util/constants');

// 附件信息
const Attachment = new Schema({
  name: { type: String, maxLength: 128 },
  uri: { type: String, maxLength: 128 },
}, { _id: false });

// 公文信息
const SchemaDefine = {
  docno: { type: String, required: true, maxLength: 64 }, // 文号
  title: { type: String, required: false, maxLength: 128 }, // 标题
  content: { type: String, required: true, maxLength: 102400, select: false }, // 详情
  status: { type: String, required: false, maxLength: 64 }, // 发文状态
  attachment: [ Attachment ], // 附件
  sender: String, // 发文部门
  receiver: [ String ], // 收文单位列表
  feedback: { // 回执信息
    required: Boolean, // 是否回执
    fields: Array, // 回执字段
  },
  meta: {
    expiredAt: Date, // 过期时间
    postedAt: Date, // 投递时间
    createdBy: String, // 发文用户
    updatedBy: String, // 最后修改用户
  },
  remark: { type: String, maxLength: 500 }, // 备注
};
const schema = new Schema(SchemaDefine, { 'multi-tenancy': false, toJSON: { virtuals: true } });
schema.index({ status: 1 });
schema.index({ 'meta.expiredAt': 1 });
schema.index({ 'meta.createdBy': 1 });
schema.index({ 'meta.createdBy': 1, status: 1 });
schema.plugin(metaPlugin);
// Populate Virtuals
schema.virtual('posts', {
  ref: 'DocPost', // The model to use
  localField: '_id', // Find people where `localField`
  foreignField: 'docid', // is equal to `foreignField`
  // If `justOne` is true, 'members' will be a single doc as opposed to
  // an array. `justOne` is false by default.
  justOne: false,
});
schema.post('find', async function(docs) {
  for (const doc of docs) {
    if (doc.status === DocStatus.POST) {
      await doc.populate('posts', 'unit status -_id').execPopulate();
    }
  }
});
module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('DocInfo', schema, 'oa_docflow_docs');
};
