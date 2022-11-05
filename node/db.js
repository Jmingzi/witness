const AV = require('leancloud-storage')
const { Query, User } = AV

const appId = 'iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz'
const appKey = 'OR3zEynwWJ7f8bk95AdiGFzJ'
const serverURLs = 'https://api.iming.work'
AV.init({ appId, appKey, serverURLs })

function getAv () {
  const instance = new Query('CardBag')
  instance.select(['name', 'pwdJsonString'])
  // instance.notEqualTo('type', 'record-days')
  instance.descending('createdAt')
  return instance.find()
}

module.exports = {
  getAv
}
