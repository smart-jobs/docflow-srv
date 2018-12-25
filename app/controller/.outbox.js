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
  // 归档公文
  "archive": {
    "parameters": {
      "query": ["!id"],
    },
  },
  // 获取公文投递记录
  "posts": {
    "parameters": {
      "query": ["!docid"],
    },
    "service": "post.query",
  },
  // 催办公文
  "remind": {
    "parameters": {
      "query": ["!docid", "unit"],
    },
    "service": "post.remind",
  },
};
