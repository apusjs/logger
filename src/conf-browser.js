const makeRnd = function () {
  return (+new Date()) + Math.floor(Math.random() * 1000)
}

let spmId = ''

const getSpmId = function () {
  let meta = document.getElementsByTagName('meta')
  let id = []
  let spma = ''
  if (spmId) {
    return spmId
  }
  // spm第一位
  for (let i = 0; i < meta.length; i++) {
    let tag = meta[i]
    if (tag && tag.name && (tag.name === 'data-spm' || tag.name === 'spm-id')) {
      spma = tag.content
    }
  }
  if (spma) {
    id.push(spma)
  }
  // spm第二位
  if (document.body && document.body.getAttribute('data-spm')) {
    id.push(document.body.getAttribute('data-spm'))
  }

  id = id.length ? id.join('.') : 0

  if (id && id.indexOf('.') !== -1) {
    spmId = id
  }

  return spmId
}

if (!getSpmId.bind) {
  getSpmId.bind = function () {
    return getSpmId
  }
}

/* TODO: 版本新添的代码，就代码无注释，功能暂未分析 */
const win = typeof window === 'object' ? window : {}

let _catch = ['catch'][0]

const oFetch = typeof win.fetch === 'function' ? win.fetch : undefined
const noop = function () {

}

export default {
  sendRequest: function (src) {
    if (!this.debug && !this.config.report) {
      return
    }
    // 是否使用自定义上报
    if(typeof this.config.fetch === 'function') {
      setTimeout(() => {
        this.config.fetch(src)
      })
      return
    }
    // 是否使用 fetch 上报
    if (oFetch) {
      return oFetch(src, {method: this.config.fetch.method, mode: 'no-cors'})[_catch](noop)
    }
    const n = 'jsFeImage_' + makeRnd()
    let img = win[n] = new Image()
    img.onload = img.onerror = function () {
      win[n] = undefined
    }
    img.src = src
    img = null
  },

  getCookie: function () {
    return document.cookie
  },

  getSessionStorage: function (key) {
    try {
      return sessionStorage.getItem(key)
    } catch (e) {
      // console.log(e)
    }
  },

  getSpmId: getSpmId
}
