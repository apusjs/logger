/*
 *
 * return status
 * 0 -> need to load new version log
 * 1 -> need to load config
 * 2 -> latest version of config as well as log
 *
 */
export default function (wpo) {
  let key = wpo._key
  let str
  let config
  let tag
  let url

  const loadScript = function (url) {
    const scriptTag = document.createElement('script')

    scriptTag.src = url
    document.getElementsByTagName('script')[0].parentNode.appendChild(scriptTag)
    return scriptTag
  }

  let isReady
  let loadConfigByDomReady = function () {
    if (isReady) {
      return
    }
    isReady = true
    loadConfig()
  }

  const loadConfig = function () {
    let url = '//retcode.examples.com/retcode/pro/config/' + wpo.getSpmId() + '.js'
    let tag = loadScript(url)

    tag.onerror = function () {
      tag.onerror = null
      wpo.error('sys', 'dynamic config error', url, 0)
      wpo.ready()
    }
  }

  const loadConfigWhenReady = function () {
    if (document.readyState === 'complete') {
      loadConfigByDomReady()
    } else if (document.addEventListener) {
      document.addEventListener('DOMContentLoaded', function () {
        document.removeEventListener('DOMContentLoaded', arguments.callee, false)
        loadConfigByDomReady()
      }, false)
    } else if (document.attachEvent) {
      document.attachEvent('onreadystatechange', function () {
        if (document.readyState === 'complete') {
          document.detachEvent('onreadystatechange', arguments.callee)
          loadConfigByDomReady()
        }
      })

      if (document.documentElement.doScroll && typeof window.frameElement === 'undefined') {
        (function () {
          try {
            // If IE is used, use the trick by Diego Perini
            // http://javascript.nwbox.com/IEContentLoaded/
            document.documentElement.doScroll('left')
          } catch (error) {
            setTimeout(arguments.callee, 0)
            return
          }
          // and execute any waiting functions
          loadConfigByDomReady()
        })()
      }

      wpo.on(window, 'load', function () {
        loadConfigByDomReady()
      }, true)
    }
  }

  //
  // key has been overriden
  //
  if (!key) {
    return 2
  }

  try {
    str = localStorage.getItem(key)
  } catch (e) {
    str = wpo.getCookie(key)
  }

  if (!str) {
    loadConfigWhenReady()
    return 1
  } else {
    config = wpo.query.parse(str)

    //
    // current ver is behind dynamic ver
    //
    let selfUpdate = function () {
      let versions = wpo.ver && wpo.ver.split('.')
      let compareVersions = config.ver && config.ver.split('.')

      //
      // force not updating
      //
      if (!versions || !compareVersions) {
        return false
      }

      for (let i = 0, len = versions.length; i < len; i++) {
        if (compareVersions[i]) {
          if (parseInt(versions[i], 10) < parseInt(compareVersions[i], 10)) {
            return true
          }
        }
      }

      return false
    }

    //
    // 动态更新脚本自己
    //
    if (selfUpdate()) {
      // url = '//g-assets.daily.taobao.net/retcode/retcodelog/' + config.ver + '/log.js';
      url = '//g.examples.com/retcode/log/' + config.ver + '/log.js'
      tag = loadScript(url)
      tag.onload = function () {
        tag.onload = null
        wpo.reloaded()
      }
      tag.onerror = function () {
        tag.onerror = null
        wpo.error('sys', 'self update error', url, 0)
        wpo.reloadFailed()
      }
      return 0
    } else if (parseInt(config.exp, 10) < (new Date()).getTime()) {
      //
      // 从localstorage里读取数据
      //
      loadConfigWhenReady()
      return 1
    }

    wpo.setConfig({
      sample: parseInt(config.sample, 10)
    })
  }

  return 2
}
