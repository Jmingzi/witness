import AV from 'leancloud-storage'
import Witness from './model/promise'

AV.init({
  appId: 'iYzWnL2H72jtQgNQPXUvjFqU-gzGzoHsz',
  appKey: 'OR3zEynwWJ7f8bk95AdiGFzJ'
})

export default {
  user: null,

  login () {
    return AV.User.loginWithWeapp().then(res => {
      this.user = AV.User.current()
      return res.toJSON().authData.lc_weapp
    })
  },

  insert (data) {
    return new Witness(data).save().then(res => {
      // console.log(res)
      return res.id
    })
  },

  getDetail (id) {
    return new AV.Query(Witness).get(id)
  },

  getList (currentPage, expression) {
    console.log(Object.keys(expression)[0], Object.values(expression)[0])
    return new AV.Query(Witness)
      .equalTo(Object.keys(expression)[0], Object.values(expression)[0])
      .descending('updatedAt').find()
  }
}
