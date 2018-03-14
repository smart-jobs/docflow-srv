# CRUD控制器
```
'use strict';

const meta = require('./category.json');
const { CrudController, NafController } = require('naf-framework-mongoose').Controllers;

class CategoryController extends NafController {
  constructor(ctx) {
    super(ctx);
    this.service = this.ctx.service.category;
  }
}

module.exports = CrudController(CategoryController, meta);
```
# CRUD描述文档
```
{
  "create": {
    "requestBody": ["code","name","order"]
  },
  "delete": {
    "query": ["id"]
  },
  "update": {
    "query": ["id"],
    "requestBody": ["name","order"]
  },
  "list": {
    "parameters": {},
    "service": "query",
    "options": {
      "sort": ["order", "code"]
    }
  },
  "simple": {
    "parameters": {
      "query": ["corp.id"]
    },
    "service": "query",
    "options": {
      "query": ["skip", "limit"],
      "sort": ["meta.createAt"],
      "desc": true,
      "projection": {
        "title": 1,
        "corp.name": 1,
        "meta.createdAt": 1
      }
    }
  },
  "fetch": {
    "query": ["id"]
  }
}
```
