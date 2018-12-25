'use strict';

const Subscription = require('egg').Subscription;
const path = require('path');
const puppeteer = require('puppeteer');
const devices = require('puppeteer/DeviceDescriptors');
const iPhone = devices['iPhone 6'];

class UpdatePrice extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        this.searchTimer = null;
        return {
            interval: '1s',
            type: 'worker',
            disable: true // 不被自动启动，设置了在app.beforeStart中启动一次
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        /* const test = await this.ctx.pushNotifyMessage(['xwatson'], {
            title: '项目测试',
            content: '开发环境测试。xwatson',
            custom_content: {
                key1: 'value1'
            },
        }) */
        // 获取配置数据
        const configs = await this.ctx.service.goodsReptileConfigs.getAll({ status: 'ENABLE' });
        const interval = Math.random() * 10000 + 20000;
        console.log('下次启动时间: ', interval + 'ms');
        this.searchTimer = setTimeout(async () => {
            if (await this.startSearch(configs)) {
                this.subscribe();
            } else {
                clearTimeout(this.searchTimer);
            }
        }, interval);
    }
    // 启动查询
    async startSearch(configs = []) {
        if (configs.length == 0) {
            console.log('未读取到配置，等待下次刷新.')
            return true;
        }
        console.log('启动chromium。');
        const browser = await puppeteer.launch({
            executablePath: path.resolve(__dirname, '../../chromium/chrome-win/chrome.exe'),
            headless: false
        });
        try {
            const sliceCount = 3;
            // 分割数组，每次最多打开3个页面
            for(let i = 0, len = configs.length; i < len; i += sliceCount ){
                const _s = configs.slice(i,i + sliceCount);
                const result = await Promise.all(_s.map((item) => this.openPage(browser, item)));
                console.log('结果:', result)
            }
            await browser.close();
            return true;
        } catch (error) {
            console.log('puppeteer发生错误：', error);
            this.ctx.logger.error('puppeteer发生错误：', error);
            await browser.close();
            return false;
        }
    }
    async openPage(browser, config) {
        const page = await browser.newPage();

        if (config.is_phone) {
            await page.emulate(iPhone);
        }
        await page.goto(config.url);
        const title = await page.title();
        const price = await page.evaluate((config) => {
            const currentPrice = (document.querySelector(config.query_selector) || {}).innerText;
            const vipPrice = (document.querySelector(config.vip_query_selector) || {}).innerText;
            const image = (document.querySelector(config.image_selector) || {}).src;
            return {
                currentPrice,
                vipPrice,
                image
            };
        }, config);
        config.name = title;
        config.current_price = price.currentPrice;
        config.vip_price = price.vipPrice;
        config.image_url = price.image_url;
        await this.updateData(config);
        console.log(config.name + '：', price);
        return price;
    }
    // 更新数据
    async updateData(config) {
        const _config = {
            id: config.id,
            name: config.name,
            site_name: config.site_name,
            image_url: config.image_url,
            image_selector: config.image_selector,
            url: config.url,
            query_selector: config.query_selector,
            vip_query_selector: config.vip_query_selector,
            expect_price: config.expect_price,
            is_phone: config.is_phone,
            replace_str: config.replace_str,
            vip_replace_str: config.vip_replace_str,
            code: 0,
            message: ''
        }
        this.setConfigPriceField(config, _config, 'current_price', 'replace_str');
        this.setConfigPriceField(config, _config, 'vip_price', 'vip_replace_str');
        return await this.ctx.service.goodsReptileConfigs.update(_config);
    }
    setConfigPriceField(config, targetConfig, priceField, replaceFiled) {
        const price = parseFloat((config[priceField] || '').replace(config[replaceFiled] || '', ''));
        if (!isNaN(price)) {
            targetConfig[priceField] = price;
            // 最低价大于目标价格，设置现在价格为最低价
            if (targetConfig.lowest_price > price || targetConfig.lowest_price == null) {
                targetConfig.lowest_price = price;
                targetConfig.lowest_price_time = this.ctx.app.formatToDayTime(Date.now());
            }
        } else if (typeof config[priceField] === 'undefined'){
            const _str = `获取${priceField}发生错误：${config.name}选择器错误。`;
            targetConfig.message += _str;
            // 只对当前价做状态码更新
            if (priceField == 'current_price') {
                targetConfig.code = 1;
            }
            console.log(_str);
            this.ctx.logger.error(_str);
        } else {
            const _str = `获取${priceField}发生错误：${config.name}字符错误：${config[priceField]}。`;
            targetConfig.message += _str;
            // 只对当前价做状态码更新
            if (priceField == 'current_price') {
                targetConfig.code = 1;
            }
            console.log(_str);
            this.ctx.logger.error(_str);
        }
        return targetConfig;
    }
}

module.exports = UpdatePrice;