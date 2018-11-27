'use strict';
const Service = require('egg').Service;

class GoodsReptileConfigsService extends Service {
    constructor(ctx) {
      super(ctx);
      this.ctx = ctx;
    }
    /**
     * 创建
     * @param {*} config 
     */
    async create(config = {}) {
      return await this.ctx.model.GoodsReptileConfigs.create(config);
    }
    /**
     * 修改
     * @param {*} config 
     */ 
    async update(config = {}) {
        return await this.ctx.model.GoodsReptileConfigs.update(config, { where: {id: config.id} });
    }
    /**
     * 删除
     * @param {*} uuid 
     */
    async delete(uuid) {
        const { app } = this;
        await app.model.GoodsReptileConfigs.delete(uuid);
        return uuid;
    }
    /**
     * 获取列表
     * @param {*} where 查询条件
     * @param {*} page 第几页
     * @param {*} size 显示多少条数据
     */
    async getList(where = {}, page, size) {
        return await this.ctx.model.GoodsReptileConfigs.findAndCountAll({
          where,
          limit: size || 10, // 返回数据量
          offset: page - 1, // 数据偏移量
          order: [ [ 'updated_at', 'DESC' ] ],
        });
    }
    /**
     * 获取全部数据
     * @param {*} where 条件
     */
    async getAll(where = {}) {
        return await this.ctx.model.GoodsReptileConfigs.findAll({
          where,
          order: [ [ 'updated_at', 'DESC' ] ],
        });
    }
    /**
     * 根据id获取一条数据
     * @param {*} id 
     */
    async getConfigById(id) {
        return await this.ctx.model.GoodsReptileConfigs.findById(id);
    }
}

module.exports = GoodsReptileConfigsService;