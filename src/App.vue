<script>
import db from './db'
import store from './store'

export default {
  onLaunch () {
    db.login().then(user => {
      console.log(user)
      store.commit('setAuth', user)
    })
  }
}
</script>

<style lang="stylus">
@import './styles/common.styl'

page
  height: 100%
view
  box-sizing: border-box
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.seal
  position absolute
  top 260rpx
  right 60rpx
  width 200rpx
  height 200rpx
  z-index 1
  transform rotate(-20deg)
.w-94
  width: 94%
.f-14
  font-size: 14px
.f-18
  font-size: 18px
.t-c
  text-align center
.t-l
  text-align left !important
.center
  display: flex
  justify-content: center
  align-items: center
.p-10
  padding px2rpx(10)
.m-t10
  margin-top 10px
.c-ff
  color: #fff !important
.c-99
  color #999 !important
.b-b
  border-bottom 1rpx #f2f2f2 solid
.bg-f2
  background-color: #f2f2f2!important
.bg-ee
  background-color: #cccccc!important
.bg-main
  background-color: #304261 !important
.tab__hover
  background-color: #dddddd !important
</style>
