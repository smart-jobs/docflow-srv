'use strict';

const Controller = require('egg').Controller;

class HomeController extends Controller {
  async index() {
    this.ctx.body = '请通过服务接口进行调用';
  }
}

module.exports = HomeController;
