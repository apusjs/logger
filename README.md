# Logger

[![npm version](https://img.shields.io/npm/v/@apus/logger.svg?style=flat-square)](https://www.npmjs.org/package/@apus/logger)
[![install size](https://packagephobia.now.sh/badge?p=@apus/logger)](https://packagephobia.now.sh/result?p=axios)
[![npm downloads](https://img.shields.io/npm/dm/@apus/logger.svg?style=flat-square)](http://npm-stat.com/charts.html?package=@apus/logger)

客户端日志上报工具，用于浏览器和小程序
## 目录

## 特点

- 使用img方式上报，提升上报性能与跨域问题
- 可自定义上报方式
- 灵活的上报率配置
- 预设多个上报场景方便方式接入
> - logger.speed 计算统计某个点的耗时
> - logger.error  自定义错误信息
> - logger.log  日志接口
> - logger.retCode  统计前端接口的成功率耗时问题
> - logger.custom  用来发送自定义的日志


## 浏览器支持

![Chrome](https://raw.github.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png) | ![Firefox](https://raw.github.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png) | ![Safari](https://raw.github.com/alrra/browser-logos/master/src/safari/safari_48x48.png) | ![Opera](https://raw.github.com/alrra/browser-logos/master/src/opera/opera_48x48.png) | ![Edge](https://raw.github.com/alrra/browser-logos/master/src/edge/edge_48x48.png) | ![IE](https://raw.github.com/alrra/browser-logos/master/src/archive/internet-explorer_9-11/internet-explorer_9-11_48x48.png) |
--- | --- | --- | --- | --- | --- |
Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | Latest ✔ | 11 ✔ |

## 安装

Using npm:

```bash
$ npm install @apus/logger
```

Using bower:

```bash
$ bower install @apus/logger
```

Using yarn:

```bash
$ yarn add @apus/logger
```

Using unpkg CDN:

```html
<script src="https://unpkg.com/@apus/logger@1.0.0/dist/index.js"></script>
```

## 例子

### 上报
In order to gain the TypeScript typings (for intellisense / autocomplete) while using CommonJS imports with `require()` use the following approach:

```js
logger.error('testing...');
logger.retCode('api', true, 100, 'testing api sampling');
```
::: tip Tip
1.页面地址中加入请求参数`wpodebug=1`进入debug模式，强制 `sampling=1` 保证100%发送请求。
:::

## speed

```javascript
// 记录0点位置，耗时100ms
logger.speed(0, 100);
```

有三个参数，主要用来统计某个点的耗时，这儿的点主要指的是spmid埋点所在的页面。第一个参数是页面埋点的标示，一个页面最多可以埋11个speed的点，分别用s0-s10来表示。第二个点是需要上报的时间，如果没有定义的时候，会自动设置为页面的起始时间到当前上报的时间差。第三个参数是布尔型，可以省略，是否为马上发送，不设置则大约会收集3s内的数据进行发送。当页面中有一个点被触发发出日志时，页面中其余被定义的speed点也会被合并一起发送。

#### 场景

计算页面的白屏时间。针对h5项目，可以在页面的根节点设置一个时间点，在页面的js渲染完成之后设置一个时间点，通过计算两者时间点的偏差，就可以得到页面的白屏时间。也可以在页面的js渲染过程中再次进行埋点，最后根据各个不同埋点间的耗时情况，分析出页面渲染可以优化的部分，提高页面的渲染速度。

### error

```javascript
logger.error('sys', 'my system error');
```

第一个参数用于标示出错的类型，有sys和log两个选项，系统js报错的用sys,但凡该站点系统中的js出现错误，都会将错误进行上报。<br/>
log是人工自定义的上报出错，结合业务场景，认为是不符合业务场景需要的情况都可以进行上报。

#### 场景

比如我们的监控平台的任务列表，有一个获取任务的数据接口，如果接口返回的数据数组长度为空，我们认为这是一个需要跟踪记录的状态，就可以在此处进行打点设置。去年双十一项目中手淘app有一个定位功能，大致情况是调用windVane的时候返回的数据格式有误，如果我们的页面没有做很强大的容错性，那么会导致页面的功能异常，并且这种情况的错误定位很麻烦，如果我们对返回的数据进行了类型的监控，那么很容易我们就能定位到出错点，这样就能比较快速的对错误进行响应。

```javascript
window.WindVane.call('WVLocation', 'getLocation', n, function(e) {
    //e为定位成功后返回的json值
    callback(e);
    var isValid = test(e);//test为检测数据是否合法的方法
    if(!isValid){
     logger.error('log', 'location data error');
    }
}, function(e) {
    //定位失败后会返回空值，有时甚至没有返回异常的回调
    callback(e);
    logger.error('sys', 'my system error');
});
```
同理，还可以用于tms等平台的监控，当运营输入不符合我们业务场景使用的数据时，会进行一个比较及时以及准确快速的报警。

### retCode

```javascript
// 成功
logger.retCode('api1', true, 100, 'testing success api request');

// 失败
logger.retCode('api1', false, 100, 'testing failed api request');
```

用来统计前端接口的成功率耗时问题。第一个参数是api的名字，可以是后端的数据接口（TOP接口、MTOP接口、java的do接口），也可以是浏览器、Native App外壳提供的功能接口（比如获取GPS坐标接口、获取本地图片列表接口）。第二个参数是接口成功失败的布尔类型，失败会100%发送，成功会按照抽样比例发送。第三个参数是接口的调用的响应时间，第四个参数是你自定义的向监控平台发送的消息。当我们需要统计一个平台接口的成功率时就必须要把成功和失败的情况都进行上报。

#### 场景

比如我们的监控平台的任务列表，有一个获取任务的数据接口，如果接口返回的数据数组长度不为空，我们才认为这是接口调用成功的标志

```javascript
var startTime = new Date();
$http.get('//retcode.alibaba.net/api/list').
success(function (json) {
     var items = json.items;
     if(json.ret == 'success'){
          if(json.items.length < 0){
               var endTime = new Date();
               var sendTime1 = endTime - startTime;
               logger.retCode('//retcode.alibaba.net/api/list', true, sendTime1, 'get right items');
          }
     }else{
       ………
     }

}).
error(function(json){
……
var endTime2 = new Date();
var sendTime2 = endTime2 - startTime;

logger.retCode('//retcode.alibaba.net/api/list', false, sendTime2, json.ret[0]); //json.ret[0]为错误的返回信息
})
```

### custom

该接口有两种记录方式，一种是根据时间，另一种是根据使用次数。调用方式为第一个传入参数的差异。
::: tip 
0/time表示的是时间。
1/count表示的是次数的统计 第二个参数则是你对该监控的命名，用于进行唯一标示。
:::

#### 场景

任务列表有一个根据spmid搜索任务的按钮，我想知道使用该按钮进行任务搜索的使用情况，此时就用到了count的计数上报。

```javascript
<button type="button" onclick="logger.custom('count', 'btnClickTime');">搜索</button>
```

此时用于统计点击该按钮的点击次数，我们可以在监控平台看到名为btnClickTime的点击次数统计；同理，如果你需要监听页面中某个链接点击进入的次数，只需要放在页面对应的链接处，放入该方法即可。 当我们想要知道一个用户我们的retCode平台停留了多久的时候，我们可以在页面加载的时候设置一个时间点，在页面退出的时候设置一个时间点，然后计算出中间的时间差，将时间差进行上报。

```javascript
var startTime = new date();//页面初始加载处
.....
.....
var endTime = new date();//页面结束退出时
var sendTime = endTime - startTime;
logger.custom(0, 'itACustomLog', sendTime);
```

同理，该方法还可以用于监控一个弹窗的显示时间等类似的业务应用场景。


## Logger API

##### Logger.init(config)

| key   | 类型   | 默认值     | 说明        |                                              
| :----------------| ---------------- | ---------------- | ------------------------------------------------------------ |
| imgUrl  | {String}  | `required` 无默认值     | 页面上报的图片地址   |
| sample   | {Number}   | `optional` `10`      | 抽样率设置,默认为`10%`  |
| spmId  | {String}  | `required` 无默认值     | 页面上报key值,必选值,如果不设置,会尝试从meta和body标签获取,如获取失败则不会触发任何上报   |
| retCode  | {Object}  | `optional`     | 可为空，api抽样率，如果没有设置，按照全局抽样率采集  |
| nick   | {String}   | `optional` 昵称    | 上报的用户昵称,默认取昵称,也可主动配置 |
| report  | {Boolean}  | `true`    | 是否上报，默认上报  |
| fetch  | {Function / Object}  | `{ method: 'HEAD' }`    | 自定义上报方式  |
| startTime  | {String}  | `optional` 无默认值    | 自定义测速类页面统计起始时间（底层无法取到时间时使用）  |
| name   | {String}   | `logger`      |  挂载的全局对象名   |

```js
logger.init({
        // 页面上报的图片地址 
        imgUrl : '',
        // 抽样率，100 = 1%，1 = 100%，默认100
        sample : 100,
        // 页面唯一的key值
        spmId  : 'testing.0',
        // 可为空，api抽样率，如果没有设置，按照全局抽样率采集
        retCode: {
            // 例子，api为testing的抽样率为100%
            "testingapi"      : 1,
            // api为apineeds1percent的抽样率为1%
            "apineeds1percent": 100
        },
        // 主动设置用户nick
        nick   : 'woodsrong',
        // 是否上报，默认上报
        report: true,
        // 是否使用fetch上报，默认关闭false，使用img src方式上报
        fetch: false,
        // 上报挂载的全局对象名
        name : ''
});
```

## 资源

## 参考

## License

[MIT](LICENSE)
