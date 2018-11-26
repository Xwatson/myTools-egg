'use strict';
const _ = require('lodash');
const moment = require('moment');

module.exports = {
  _,
  dayFormat: '%Y-%m-%d',
  dayTimeFormat: '%Y-%m-%d %H:%i:%s',

  // 日期格式化
  formatToDay(date) {
    return moment(date).format('YYYY-MM-DD');
  },
  formatToDayTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
  },
};