/**
 * 公文投递信息
 */
'use strict';
const Schema = require('mongoose').Schema;
const metaPlugin = require('naf-framework-mongoose/lib/model/meta-plugin');

// 公文投递信息
const SchemaDefine = {
  docid: { type: String, required: true, maxLength: 64 }, // 公文ID
  docno: { type: String, maxLength: 64 }, // 文号
  title: { type: String, maxLength: 128 }, // 标题
  unit: { type: String, required: true, maxLength: 64 }, // 收文单位
  status: { type: String, required: true, maxLength: 64 }, // 收文状态
  feedback: [[ String ]], // 回执信息，二维数组
  meta: {
    updatedBy: String, // 处理公文的用户ID
  },
  remark: { type: String, maxLength: 500 } // 备注
};
const schema = new Schema(SchemaDefine, { 'multi-tenancy': true, toJSON: { virtuals: true } });
schema.index({ status: 1 });
schema.index({ validity: 1 });
schema.plugin(metaPlugin);

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('DocPost', schema, 'oa_docflow_post');
};
