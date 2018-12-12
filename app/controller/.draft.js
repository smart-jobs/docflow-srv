module.exports = {
  // 起草公文
  "create": {
    "requestBody": ["!docno", "!title", "!content", "sender", "receiver", "attachment", "meta.expiredAt", "feedback", "action" ],
  },
  // 修改公文信息
  "update": {
    "parameters": {
      "query": ["!id"],
    },
    "requestBody": [ "docno", "title", "content", "sender", "receiver", "attachment", "meta.expiredAt", "feedback.required", "feedback.fields" ],
  },
  // 获取公文详情
  "fetch": {
    "parameters": {
      "query": ["!id"],
    },
  },
  // 递送公文
  "post": {
    "parameters": {
      "query": ["!id"],
    },
  },
  // 递送公文
  "delete": {
    "parameters": {
      "query": ["!id"],
    },
  },
};
