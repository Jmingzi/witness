<template>
  <div class="container bg-f2 p-10 f-14">
    <div class="detail__content">
      <img src="../../images/yz.gif" class="seal">
      <img src="../../images/logo.jpg" class="detail__logo">
      <div class="detail__line"></div>

      <p class="f-18 t-c">承诺书</p>
      <p class="detail__content-a">{{ content && content.content }}</p>

      <van-row>
        <van-col span="12">
          <van-cell
            title="甲方"
            title-width="40px"
            :value="content && content.from.name"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
        <van-col span="12">
          <van-cell
            title="乙方"
            title-width="40px"
            :value="content && content.to.name"
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
            :value="content && content.from.date"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
        <van-col span="12">
          <van-cell
            title="日期"
            title-width="40px"
            :value="content && content.to.date"
            value-class="t-l c-99"
          >
          </van-cell>
        </van-col>
      </van-row>

      <template v-if="content">
        <van-row v-if="content.needExchange">
          <van-col span="24">
            <div class="my-cell b-b" v-if="isComplete">
              <span>兑现日期</span>
              <span class="c-99 my-cell__value">{{ content.updatedAt }}</span>
            </div>
            <div class="my-cell b-b" v-else>
              <span>截止兑现日期</span>
              <span class="c-99 my-cell__value">{{ content.exchangeDate }}</span>
            </div>
          </van-col>
        </van-row>

        <van-row>
          <van-col span="24">
            <div class="my-cell">
              <span>状态</span>
              <van-tag class="my-cell__value" :type="status.style">{{ status.text }}</van-tag>
            </div>
          </van-col>
        </van-row>
      </template>
    </div>

    <div style="width: 100%" v-if="status">
      <p
        v-if="isSelf && status.noticeFromMe || isTarget && status.noticeFromTarget || isOther && otherNotice"
        class="detail__notice center c-99"
      >
        {{ isSelf ? status.noticeFromMe : (isTarget ? status.noticeFromTarget : otherNotice) }}
      </p>

      <template v-if="status.btnText || status.btnTextSelf">
        <div v-if="isWaitSign && !isOther" class="my-button">
          <van-button
            size="large"
            :loading="loading"
            custom-class="bg-main detail__btn c-ff"
            @click="handleWaitSign"
            :open-type="isSelf ? 'share' : ''"
          >
            {{ isSelf ? status.btnTextSelf : status.btnText }}
          </van-button>
          <button
            v-if="!userInfo && !isSelf"
            class="my-button__btn"
            open-type="getUserInfo"
            @getuserinfo="val => getUserInfo(val, 'handleWaitSign')"
            plain
          >
          </button>
        </div>

        <template v-else-if="isWaitSignConfirm && isSelf">
          <div class="my-button">
            <van-button
              size="large"
              :loading="loading"
              custom-class="bg-main detail__btn c-ff"
              @click="handleWaitSignConfirm(true)"
            >
              {{ status.btnTextSelf }}
            </van-button>
            <button
              v-if="!userInfo"
              class="my-button__btn"
              open-type="getUserInfo"
              @getuserinfo="val => getUserInfo(val, 'handleWaitSignConfirm', true)"
              plain
            >
            </button>
          </div>
          <div class="my-button">
            <van-button
              size="large"
              :loading="loading"
              custom-class="bg-ee m-t10 detail__btn c-ff"
              @click="handleWaitSignConfirm(false)"
            >
              {{ status.btnTextSelfSecond }}
            </van-button>
            <button
              v-if="!userInfo"
              class="my-button__btn"
              open-type="getUserInfo"
              @getuserinfo="val => getUserInfo(val, 'handleWaitSignConfirm', false)"
              plain
            >
            </button>
          </div>
        </template>

        <div v-else-if="isWaitComplete && isTarget" class="my-button">
          <van-button
            size="large"
            :loading="loading"
            custom-class="bg-main detail__btn c-ff"
            @click="handleCompleteConfirm"
          >
            {{ status.btnText }}
          </van-button>
          <button
            v-if="!userInfo"
            class="my-button__btn"
            open-type="getUserInfo"
            @getuserinfo="val => getUserInfo(val, 'handleCompleteConfirm')"
            plain
          >
          </button>
        </div>

        <div v-else-if="isWaitCompleteConfirm && isSelf" class="my-button">
          <van-button
            size="large"
            :loading="loading"
            custom-class="bg-main detail__btn c-ff"
            @click="handleComplete"
          >
            {{ status.btnText }}
          </van-button>
          <button
            v-if="!userInfo"
            class="my-button__btn"
            open-type="getUserInfo"
            @getuserinfo="val => getUserInfo(val, 'handleComplete')"
            plain
          >
          </button>
        </div>
      </template>

      <van-button
        v-if="!isOther && (isSign || isComplete) || isOther"
        size="large"
        :loading="loading"
        custom-class="bg-main detail__btn c-ff"
        @click="toIndex"
      >
        {{ isOther ? '创建我的承诺书' : status.btnText }}
      </van-button>
    </div>

    <div class="t-l" v-if="false">
      <p>isSelf: {{ isSelf }}</p>
      <p>isTarget: {{ isTarget }}</p>
      <p>isOther: {{ isOther }}</p>
    </div>
  </div>
</template>

<script>
import utils from '@/utils/index'
import db from '@/db/index'
import store from '@/store/index'
import {
  STATUS,
  WAIT_SIGN,
  WAIT_SIGN_CONFIRM,
  SIGN,
  WAIT_COMPLETE,
  WAIT_COMPLETE_CONFIRM,
  COMPLETE
} from '@/constant/index'
// import Btn from '@/components/btn.vue'
let detailBak = null

export default {
  // components: {
  //   Btn
  // }
  data () {
    return {
      loading: false,
      content: null
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    },

    status () {
      return this.content ? STATUS[this.content.status] : null
    },

    isSelf () {
      // return false
      return this.content && store.state.auth
        ? store.state.auth.openid === this.content.fromUserId
        : false
    },

    isTarget () {
      // return false
      return this.content && store.state.auth
        ? store.state.auth.openid === this.content.toUserId
        : false
    },

    isOther () {
      // return true
      return this.content && store.state.auth
        ? !this.isSelf && !this.isTarget
        : false
    },

    isWaitSign () {
      return this.getStatus(WAIT_SIGN)
    },

    isWaitSignConfirm () {
      return this.getStatus(WAIT_SIGN_CONFIRM)
    },

    isSign () {
      return this.getStatus(SIGN)
    },

    isWaitComplete () {
      return this.getStatus(WAIT_COMPLETE)
    },

    isWaitCompleteConfirm () {
      return this.getStatus(WAIT_COMPLETE_CONFIRM)
    },

    isComplete () {
      return this.getStatus(COMPLETE)
    },

    otherNotice () {
      return this.content && this.status.noticeOther
        ? this.status.noticeOther
          .replace('a', this.content.from.name)
          .replace('b', this.content.to.name)
        : ''
    }
  },

  onShow () {
    utils.setWxBg()

    wx.showShareMenu()
    wx.showLoading({ title: '获取详情' })

    this.getDetail()
  },

  onShareAppMessage () {
    const name = this.content.from.name
    return {
      title: `${name}发来一封承诺书，请注意查收～`
    }
  },

  methods: {
    getDetail () {
      db.getDetail(this.$mp.query.id).then(res => {
        this.content = res.toJSON()
        detailBak = res
        wx.hideLoading()
      })
    },

    getStatus (type) {
      return this.content
        ? this.content.status === type
        : false
    },

    getUserInfo (res, fn, params) {
      store.commit('setUser', Object.assign(res.mp.detail.userInfo))
      this[fn](params)
    },

    handleCommon (status) {
      this.loading = true
      // 响应式数据循环更新
      Object.assign(detailBak, { status }, {
        to: {
          name: this.userInfo.nickName,
          avatar: this.userInfo.avatarUrl,
          date: utils.getNow().full
        },
        toUserId: store.state.auth.openid
      }).save().then(() => {
        this.loading = false
        this.getDetail()
      })
    },

    handleWaitSign () {
      if (this.isSelf) {
        console.log('只做转发')
      } else {
        this.handleCommon(WAIT_SIGN_CONFIRM)
      }
    },

    handleWaitSignConfirm (isTarget) {
      const status = this.content.needExchange ? WAIT_COMPLETE : SIGN
      this.handleCommon(isTarget ? status : WAIT_SIGN)
    },

    handleCompleteConfirm () {
      this.handleCommon(WAIT_COMPLETE_CONFIRM)
    },

    handleComplete () {
      this.handleCommon(COMPLETE)
    },

    toIndex () {
      wx.redirectTo({
        url: '/pages/index/main'
      })
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
    margin 10px 20px 20px 20px
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

.my-button
  position: relative
  &__btn
    position absolute
    top: 0
    left: 0
    height 100%
    width 100%
    border: none
    z-index 1
    opacity 0
</style>
