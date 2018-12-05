'use strict';

const XGRequest = require('../../utils/XGRequest.js');

module.exports = {
    /**
     * 推送通知消息
     * @param {*} account_list 目标账号列表
     * @param {*} message 消息
     * @param {*} platform 平台
     */
    async pushNotifyMessage(account_list = [], message, platform = 'android') {
        if (typeof message !== 'object' || !Object.keys(message).length) {
            throw new Error('message参数不合法！');
        }
        // 追加消息参数
        message.android = {
            n_id: 0,
            builder_id: 0,
            ring: 1,
            ring_raw: "tixin",
            vibrate: 1,
            lights: 1,
            clearable: 1,
            icon_type: 0,
            icon_res: "xg",
            style_id: 1,
            small_icon: "xg",
            action: {
                action_type: 1,// 动作类型，1，打开activity或app本身；2，打开浏览器；3，打开Intent
            },
            custom_content: {
                key1: 'value1',
                key2: 'value2'
            }
        }
        return await XGRequest.xgPush(this, {
            audience_type: 'account_list',
            message_type: 'notify',
            account_list,
            message,
            platform
        });
    },
};