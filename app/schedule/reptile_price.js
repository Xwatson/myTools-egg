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
        // 获取配置数据
        const configs = await this.ctx.service.goodsReptileConfigs.getAll();
        const interval = Math.random() * 5000 + 5000;
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
        const price = await page.evaluate((config) => {
            const currentPrice = (document.querySelector(config.query_selector) || {}).innerText;
            return {
                currentPrice
            };
        }, config);
        await this.updateData(config, parseFloat(price.currentPrice));
        console.log(config.name + '：', price);
        return price;
    }
    // 更新数据
    async updateData(config, currentPrice) {
        const _config = {
            id: config.id,
            name: config.name,
            site_name: config.site_name,
            url: config.url,
            query_selector: config.query_selector,
            current_price: currentPrice,
            is_phone: config.is_phone
        }
        _config.current_price = currentPrice;
        // 最低价大于现在的价格，设置现在价格为最低价
        if (_config.lowest_price > currentPrice || _config.lowest_price == null) {
            _config.lowest_price = currentPrice;
            _config.lowest_price_time = this.ctx.app.formatToDayTime(Date.now());
        }
        return await this.ctx.service.goodsReptileConfigs.update(_config);
    }
}

module.exports = UpdatePrice;