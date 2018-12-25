'use strict';

module.exports = app => {
  const { STRING, INTEGER, DATE, DOUBLE, ENUM, TEXT, BOOLEAN } = app.Sequelize;

  const GoodsReptileConfigs = app.model.define('goodsReptileConfigs', {
    id: {
      type: INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      unique: true,
    },
    name: STRING(255), // 名称
    site_name: STRING(255), // 站点名称
    image_url: STRING(1000), // 图片地址
    image_selector: STRING(255), // 图片选择器
    url: { // 地址
      type: STRING(2000),
      allowNull: false
    },
    query_selector: { // document选择器
      type: STRING(255),
      allowNull: false
    },
    vip_query_selector: STRING(255), // 会员document选择器
    current_price: DOUBLE, // 现在价格
    vip_price: DOUBLE, // 会员价
    lowest_price: DOUBLE, // 最低价格
    expect_price: DOUBLE, // 期望价格
    lowest_price_time: DATE, // 最低价出现时间
    is_phone: BOOLEAN, // 是否移动端
    replace_str: STRING(255), // 替换字符
    vip_replace_str: STRING(255), // vip价替换字符
    code: INTEGER, // 查询错误码 0成功 1错误
    message: STRING(500), // 错误信息
    status: { // 状态
      type: ENUM,
      allowNull: false,
      values: [ 'ENABLE', 'DISABLE' ], // 启用，禁用
    },
  });
  return GoodsReptileConfigs;
};