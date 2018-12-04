module.exports = {
  // 获取公文详情
  "fetch": {
    "parameters": {
      "query": ["!id"],
    },
  },
  // 办结公文
  "finish": {
    "parameters": {
      "query": ["!id"],
    },
  },
  // 催办公文
  "remind": {
    "parameters": {
      "query": ["!docid", "unit"],
    },
    "service": "post.remind",
  },
};
