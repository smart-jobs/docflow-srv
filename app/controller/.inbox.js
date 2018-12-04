module.exports = {
  // 获取收文信息和公文详情
  "fetch": {
    "parameters": {
      "query": ["!docid"],
    },
  },
  // 提交公文回执
  "feedback": {
    "parameters": {
      "query": ["!docid"],
    },
    "requestBody": [ "!feedback" ],
  },
};
