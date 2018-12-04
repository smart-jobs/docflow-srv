module.exports = {
  // 起草公文
  "create": {
    "requestBody": [ "!docno", "!title", "!content", "receiver", "attachment", "expiredAt", "feedback", "action" ],
  },
  // 修改公文信息
  "update": {
    "parameters": {
      "query": ["!id"],
    },
    "requestBody": [ "docno", "title", "content", "receiver", "attachment", "expiredAt", "feedback.required", "feedback.fields" ],
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
};
