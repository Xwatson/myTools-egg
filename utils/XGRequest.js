'use strict';

const xingeConfig = require('../config/config.xinge');

module.exports = {
    /**
     * 信鸽推送
     * @param {*} ctx 上下文对象
     * @param {*} data 参数
     */
    async xgPush(ctx, data) {
        if (!ctx || !data) {
            throw new Error('调用通知推送前请检查参数！');
        }
        const authStr= 'Basic ' + Buffer.from(`${xingeConfig.APPID}:${xingeConfig.SECRETKEY}`).toString('base64');
        return await ctx.curl(xingeConfig.API, {
            method: 'POST',
            contentType: 'json',
            headers: {
                'Authorization': authStr,
                'Cache-Control': 'no-cache'
            },
            data
        })
    }
}