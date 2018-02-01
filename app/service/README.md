# CRUD服务
```
'use strict';

const ObjectID = require('mongodb').ObjectID;
const assert = require('assert');
const util = require('core-util-is');
const { BusinessError, ErrorCode } = require('naf-core').Error;
const service = require('naf-framework-mongoose').service;
const { CrudService } = service;

class CategoryService extends CrudService {
  constructor(ctx) {
    super(ctx, 'naf_code_category');
    this.model = ctx.model.Category;
    this.mItems = ctx.model.Items;
  }

  async delete({ id }) {
    assert(id);

    // TODO:检查数据是否存在
    const entity = await this._findOne({ _id: ObjectID(id) });
    if (util.isNullOrUndefined(entity)) throw new BusinessError(ErrorCode.DATA_NOT_EXIST);

    // TODO: 检查是否包含字典项数据
    const count = await this._count({ category: entity.code }, this.mItems);
    if (count > 0) {
      throw new BusinessError(ErrorCode.SERVICE_FAULT, '存在字典项数据，不能删除');
    }

    await this._remove({ _id: ObjectID(id) });
    return 'deleted';
  }

  // async query({ skip, limit, order } = {}, data = {}) {
  //   // const rs = await this._find(trimData(data), null, trimData({ skip, limit, sort: order && { [order]: 1 } }));
  //   const rs = await this.model.find({}, null, {}).exec();
  //   return rs;
  // }

}

module.exports = CategoryService;
```
