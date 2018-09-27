<template>
  <div class="container bg-f2 p-10 f-14">
    <div class="detail__content">
      <img src="../../images/yz.gif" class="seal">
      <img src="../../images/logo.jpg" class="detail__logo">
      <div class="detail__line"></div>

      <p class="f-18 t-c">承诺书</p>
      <p class="detail__content-a">福尔曼根特人个人模糊了他们好明天来看模块他们离开见面会与喀麦隆客人连体裤离开就如同看热闹开通客人太快了努力让他同人漫画来看厉害你来看美女</p>

      <van-row>
        <van-col span="12">
          <van-cell
            title="甲方"
            title-width="40px"
            value="无非"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
        <van-col span="12">
          <van-cell
            title="乙方"
            title-width="40px"
            value="无非"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
      </van-row>
      <van-row>
        <van-col span="12">
          <van-cell
            title="日期"
            title-width="40px"
            value="123"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
        <van-col span="12">
          <van-cell
            title="日期"
            title-width="40px"
            value="123"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
      </van-row>

      <van-row>
        <van-col span="24">
          <div class="my-cell b-b">
            <span>截止兑现日期</span>
            <span class="c-99 my-cell__value">123</span>
          </div>
        </van-col>
      </van-row>

      <van-row>
        <van-col span="24">
          <div class="my-cell">
            <span>状态</span>
            <van-tag class="my-cell__value">已兑现</van-tag>
          </div>
        </van-col>
      </van-row>
    </div>

    <div style="width: 100%">
      <p class="detail__notice center c-99">您的承诺书还未被签署，发给Ta吧～</p>

      <van-button
        size="large"
        :loading="loading"
        custom-class="bg-main detail__btn c-ff"
      >
        签署承诺
      </van-button>
    </div>
  </div>
</template>

<script>
import utils from '@/utils/index'
// import store from './store'

export default {
  computed: {
  },

  data () {
    return {
      loading: false,
      shareFrom: 'menu'
    }
  },

  methods: {
  },

  onShow () {
    utils.setWxBg()
  },

  onLaunch () {
    wx.showShareMenu()
  },

  onShareAppMessage () {
    const name = '卡尔'
    return {
      title: `@你，${name}发来一封承诺书，请注意查收～`
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '../../styles/common.styl'

.container
  justify-content initial

.detail
  &__content
    @extend $content__area
    width:99.2%
    padding px2rpx(20)
    margin 0 auto 10px auto
    &-a
      text-indent 2em
      margin px2rpx(20) 0
  &__notice
    margin-bottom 10px
  &__logo
    position absolute
    left 0
    top 0
    width 40px
    height 40px
  &__line
    position absolute
    left -45px
    top -45px
    width 90px
    height 90px
    border-bottom 1rpx #304261 dashed
    transform rotate(-45deg)

.my-cell
  display flex
  justify-content space-between
  align-items center
  line-height 44px
  margin-left 15px

  &__value
    display:block;
    width:47.5%;
</style>
