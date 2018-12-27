'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/', controller.home.index);
  router.post('/api/goodsReptileConfig/get/:id', controller.goodsReptileConfigs.get);
  router.post('/api/goodsReptileConfig/create', controller.goodsReptileConfigs.create);
  router.post('/api/goodsReptileConfig/update', controller.goodsReptileConfigs.update);
  router.get('/api/goodsReptileConfig/getList', controller.goodsReptileConfigs.getList);
};
