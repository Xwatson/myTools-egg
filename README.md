# myTools-egg

mytools server

## QuickStart

> ### 安装puppeteer时注意
> * 直接使用npm i puppeteer时可能会显示以下错误
> >ERROR: Failed to download Chromium r515411! Set "PUPPETEER_SKIP_CHROMIUM_DOWNLOAD" env variable to skip download.

> * 解决
> > 跳过Chromium 下载，使用npm i puppeteer --ignore-scripts  
> > 然后手动下载Chromium，[下载地址](https://download-chromium.appspot.com)（需翻墙）
> * 在目录创建chromium文件夹，解压对应系统文件放入此文件夹下
> * 在启动puppeteer.launch中需配置路径，如Windows中
>>> ```executablePath: './chromium/chrome-win/chrome.exe'```
> ### 如未遇到下载错误则无需配置executablePath
<!-- add docs here for user -->

see [egg docs][egg] for more detail.

### Development

```bash
$ npm i
$ npm run dev
$ open http://localhost:7001/
```

### Deploy

```bash
$ npm start
$ npm stop
```

### npm scripts

- Use `npm run lint` to check code style.
- Use `npm test` to run unit test.
- Use `npm run autod` to auto detect dependencies upgrade, see [autod](https://www.npmjs.com/package/autod) for more detail.


[egg]: https://eggjs.org