# 数据模型
```
'use strict';
const Schema = require('mongoose').Schema;

const SchemaDefine = {
  code: { type: String, required: true, maxLength: 64 },
  name: { type: String, required: true, maxLength: 128 },
  order: Number,
};
const schema = new Schema(SchemaDefine);
schema.index({ code: 1 }, { unique: true });

module.exports = app => {
  const { mongoose } = app;
  return mongoose.model('CodeCategory', schema, 'naf_code_category');
};
```
