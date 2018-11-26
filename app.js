
'use strict';

module.exports = app => {
  app.appTitle = 'MyTools';
  app.beforeStart(async () => {
    // 保证应用启动监听端口前数据已经准备好了
    // 后续数据的更新由定时任务自动触发
    if (app.config.env === 'local') {
        await app.model.sync(); // { force: true }
    }
    await app.runSchedule('reptile_price');
  });
};