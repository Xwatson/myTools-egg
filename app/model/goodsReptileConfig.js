'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, DOUBLE, ENUM, TEXT } = app.Sequelize;

  const GoodsReptileConfig = app.model.define('goodsReptileConfig', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    name: STRING(255), // 名称
    url: STRING(2000), // 地址
    query_selector: STRING(255), // document选择器
    current_price: DOUBLE, // 现在价格
    lowest_price: DOUBLE, // 最低价格
    expect_price: DOUBLE, // 期望价格
    lowest_price_time: DATE, // 最低价出现时间
  });
  return GoodsReptileConfig;
};