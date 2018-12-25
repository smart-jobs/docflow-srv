/**
 * 公文投递信息
 */
'use strict';
const Schema = require('mongoose').Schema;
const _ = require('lodash');

// 公文信息
const SchemaDefine = {
  docno: { type: String, required: true, maxLength: 64 }, // 文号
  title: { type: String, required: false, maxLength: 128 }, // 标题
  feedback: Object,
  attachment: [],
};
const schema = new Schema(SchemaDefine, { toJSON: {
  // eslint-disable-next-line no-unused-vars
  transform: (doc, ret, options) => {
    return { ..._.pick(ret, 'docno', 'title'),
      feedback: ret.feedback && ret.feedback.required,
      attachment: _.isArray(ret.attachment) && ret.attachment.length > 0,
    };
  },
} });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('DocSimple', schema, 'oa_docflow_docs');
};
