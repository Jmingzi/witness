const AV = require('leancloud-storage')
const { Query, User } = AV

AV.init({
  appId: "iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz",
  appKey: "OR3zEynwWJ7f8bk95AdiGFzJ",
  serverURL: "https://api.iming.work"
})

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
