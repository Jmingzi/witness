function formatNumber (n) {
  const str = n.toString()
  return str[1] ? str : `0${str}`
}

function getNow () {
  const t = new Date()
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

function setWxBg () {
  wx.setNavigationBarColor({
    frontColor: '#000000',
    backgroundColor: '#f2f2f2',
    animation: 'linear'
  })
  wx.setBackgroundColor({
    backgroundColor: '#f2f2f2'
  })
}

function setWxTitle (title) {
  wx.setNavigationBarTitle({
    title
  })
}

export default {
  getNow,
  setWxBg,
  setWxTitle
}
