const AV = require('leancloud-storage')
const { Query, User, Object } = AV

const appId = 'iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz'
const appKey = 'OR3zEynwWJ7f8bk95AdiGFzJ'
const serverURLs = 'https://api.iming.work'
AV.init({ appId, appKey, serverURLs })

async function getAv (openid, type) {
  const instance = new Query('CardBag')
  instance.equalTo('openid', openid)
  instance.equalTo('type', type)
  instance.equalTo('openid', openid)
  instance.descending('createdAt')
  const res = await instance.find()
  return res.map(x => x.toJSON())
}

async function getAvTable(data) {
  let av
  const res = await finOne(data)
  if (res) {
    av = Object.createWithoutData('CardBag', res.id)
  } else {
    const A = Object.extend('CardBag')
    av = new A()
  }
  return {
    av,
    exist: !!res
  }
}

async function finOne ({ title, name, number, openid }) {
  // 根据 title, name, number 查询唯一
  const instance = new Query('CardBag')
  instance.equalTo('openid', openid)
  instance.equalTo('title', title)
  instance.equalTo('name', name)
  if (number) {
    instance.equalTo('number', number)
  }
  const res = (await instance.find()).map(x => x.toJSON())
  return res[0]
}

async function addAv (openid, title, name, number) {
  const data = { openid, title, name, number, type: /银行/.test(name) ? 'card' : 'app' }
  const cur = await User.current()
  if (!cur) {
    await User.logIn('jmingzi', 'ck.123456')
  }

  const { av, exist } = getAvTable(data)
  Object.keys(data).forEach(key => {
    if (key !== 'id') {
      av.set(key, data[key])
    }
  })
  const res = await av.save()
  return {
    obj: res.toJSON(),
    exist
  }
}

async function delAv (openid, title, name) {
  const data = { openid, title, name }
  const item = await finOne(data)
  if (item) {
    const av = Object.createWithoutData('CardBag', item.id)
    return av.destroy()
  }
}

module.exports = {
  getAv,
  addAv,
  delAv
}
