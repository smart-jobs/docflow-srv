# CRUD控制器
```
'use strict';

const Controller = require('egg').Controller;
const meta = require('./category.json');
const { CrudController } = require('naf-framework-mongoose').controller;

class CategoryController extends Controller {
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
  "fetch": {
    "query": ["id"]
  }
}
```
