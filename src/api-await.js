export default function (wpo, failedCallback) {
  let awaits = []
  let apis = ['custom', 'error', 'performance', 'retCode', 'speed', 'log']
  let name
  let i = 0

  const awaitFunc = function (apiName) {
    return function () {
      awaits.push({
        type: apiName,
        params: Array.prototype.slice.call(arguments)
      })
    }
  }

  while (name = apis[i++]) {
    wpo[name] = awaitFunc(name)
  }

  wpo.reloaded = function () {
    wpo.ready()
    for (let i = 0, len = awaits.length; i < len; i++) {
      wpo[awaits[i].type].apply(wpo, awaits[i].params)
    }
  }

  wpo.reloadFailed = function () {
    if (typeof failedCallback === 'function') {
      failedCallback()
      // wpo.reloaded();
    }
  }
}
