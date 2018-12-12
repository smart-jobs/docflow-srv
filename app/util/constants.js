'use strict';

// 发文状态
exports.DocStatus = {
  DRAFT: 'draft', // 草稿
  POST: 'post', // 已发
  DONE: 'done', // 办结
  ARCHIVE: 'archive', // 归档
};

// 收文状态
exports.PostStatus = {
  NEW: 'new', // 新公文
  READ: 'read', // 已读
  DONE: 'done', // 已办
};
