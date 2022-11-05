const AV = require('leancloud-storage')
const { Query, User } = AV

const appId = 'iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz'
const appKey = 'OR3zEynwWJ7f8bk95AdiGFzJ'
const serverURLs = 'https://api.iming.work'
AV.init({ appId, appKey, serverURLs })

async function getAv (openid, type) {
  const instance = new Query('CardBag')
  instance.equalTo('type', type)
  instance.equalTo('openid', openid)
  instance.descending('createdAt')
  const res = await instance.find()
  return res.map(x => x.toJSON())
}

module.exports = {
  getAv
}
