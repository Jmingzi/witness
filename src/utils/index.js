function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function getNow (time) {
  const t = time ? new Date(time) : new Date()
  let y = t.getFullYear()
  let m = t.getMonth() + 1
  let h = t.getDate()

  const res = {
    year: y,
    month: formatNumber(m),
    date: formatNumber(h),
    ts: t.getTime(),
    full: ''
  }
  res.full = `${res.year}-${res.month}-${res.date}`
  return res
}

function setWxBgBody () {
  wx.setBackgroundColor({
    backgroundColor: '#f2f2f2'
  })
}

function setWxBg () {
  wx.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#f2f2f2',
    animation: 'linear'
  })
  setWxBgBody()
}

function setWxTitle (title) {
  wx.setNavigationBarTitle({
    title
  })
}

function format (time) {
  return getNow(time).full
}

function getStore (key) {
  return new Promise(resolve => {
    wx.getStorage({
      key,
      success (r) {
        resolve(r.data)
      }
    })
  })
}

function setStore (key, val) {
  wx.setStorage({ key, data: val })
}

export default {
  getNow,
  setWxBg,
  setWxTitle,
  format,
  getStore,
  setStore,
  setWxBgBody
}
