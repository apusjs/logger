import browserConf from './conf-browser'
import core from './core'
import sampling from './sampling'
import apis from './apis'
import browserPerformance from './browser-performance'
// import apiAwait from './api-await'
// import serverConfig from './server-config'



const install = function (win, name) {

  let wpo = win[name] || {}
  let status = 2

  /**
   * browser环境下，如果已经初始化就不再重复初始化
   * 修改设置需要通过WPO.setConfig改变
   */
  if (wpo.__hasInitBlSdk) {
    return
  }
  // env设置
  wpo.env = 'browser'

  core(wpo, win, browserConf, name)

  const exec = function () {
    sampling(wpo)
    apis(wpo)
    browserPerformance(wpo, win, browserConf)
    wpo.__hasInitBlSdk = true
  }

  if (wpo.config.dynamic) {
    //
    // 自更新log.js
    //
/*    if (!(status = serverConfig(wpo))) {
      apiAwait(wpo, function () {
        exec()
        if (wpo.reloaded) {
          wpo.reloaded()
        }
      })
      return
    }*/
  }

  if (status === 2) {
    // 如使用document 初始化失败就尝试直接启动
    try {
      // support log.js async loaded
      if (document.readyState === 'complete') {
        wpo.ready()
      } else {
        wpo.on(win, 'load', function () {
          wpo.ready()
        }, true)
      }
    } catch (e) {
      try {
        wpo.ready()
      } catch (e) {
        // 无法启动成功
      }
    }
  }

  exec()
}

export default {
  init (conf, root) {
    const name = conf.name || 'logger'
    // 定义挂载对象 如空 使用 window
    if (!root) {
      install(window, name)
      window[name].setConfig(conf)
      return;
    }
    // 定义挂载对象 不如空 且 window 环境，先初始化到window再挂载到自定义对象
    if (root && typeof window !== 'object') {
      install(root, name)
      root[name].setConfig(conf)
      return
    }
    // 定义挂载对象 不如空 且不等于 window 环境，初始化到自定义对象
    if (root && typeof window === 'object') {
      install(window, name)
      window[name].setConfig(conf)
      root[name] = window[name]
      root[name].setConfig = window[name].setConfig
      return
    }

  }
}
