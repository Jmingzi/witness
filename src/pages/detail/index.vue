<template>
  <div class="container bg-f2 p-10 f-14">
    <div class="detail__content">
      <img src="../../images/yz.gif" class="seal">
      <img src="../../images/logo.jpg" class="detail__logo">
      <div class="detail__line"></div>

      <p class="f-18 t-c">承诺书</p>
      <p class="detail__content-a">
        <span>甲方</span>
        <span class="detail__from">
          {{ content && content.from.name ? content && content.from.name : '' }}
          <span class="c-99">{{ isSelf ? '(我)' : '' }}</span>
        </span>
        要
        <span>乙方</span>
        <span class="detail__to">
          {{ content && content.to.name && !isWaitSign ? content && content.to.name : '' }}
        </span>
        承诺以下内容：
        {{ content && content.content }}
      </p>

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
              <span class="c-99 my-cell__value">{{ content.updatedDate }}</span>
            </div>
            <div class="my-cell b-b" v-else>
              <span>兑现截止日期</span>
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

      <form
        v-if="status.btnText || status.btnTextSelf"
        report-submit="true"
        @submit="getFormIdAndToken"
      >
        <div v-if="isWaitSign" class="my-button">
          <!--van-button只做展示用-->
          <van-button size="large" custom-class="bg-main detail__btn c-ff">
            {{ isSelf ? status.btnTextSelf : status.btnText }}
          </van-button>
          <button
            plain
            class="my-button__btn"
            form-type="submit"
            :open-type="isSelf ? 'share' : 'getUserInfo'"
            @click="beforeHandle('handleWaitSign')"
            @getuserinfo="getUserInfo"
          >
          </button>
        </div>

        <template v-else-if="isWaitSignConfirm && isSelf">
          <div class="my-button">
            <van-button size="large" custom-class="bg-main detail__btn c-ff">
              {{ status.btnTextSelf }}
            </van-button>
            <button
              plain
              class="my-button__btn"
              form-type="submit"
              open-type="getUserInfo"
              @click="beforeHandle('handleWaitSignConfirm', true)"
              @getuserinfo="getUserInfo"
            >
            </button>
          </div>
          <div class="my-button">
            <van-button size="large" custom-class="bg-ee m-t10 detail__btn c-ff">
              {{ status.btnTextSelfSecond }}
            </van-button>
            <button
              plain
              class="my-button__btn"
              form-type="submit"
              open-type="getUserInfo"
              @click="beforeHandle('handleWaitSignConfirm', false)"
              @getuserinfo="getUserInfo"
            >
            </button>
          </div>
        </template>

        <div v-else-if="isWaitComplete && isTarget" class="my-button">
          <van-button size="large" custom-class="bg-main detail__btn c-ff">
            {{ status.btnText }}
          </van-button>
          <button
            plain
            class="my-button__btn"
            form-type="submit"
            open-type="getUserInfo"
            @click="beforeHandle('handleCompleteConfirm')"
            @getuserinfo="getUserInfo"
          >
          </button>
        </div>

        <div v-else-if="isWaitCompleteConfirm && isSelf" class="my-button">
          <van-button size="large" custom-class="bg-main detail__btn c-ff">
            {{ status.btnText }}
          </van-button>
          <button
            plain
            class="my-button__btn"
            form-type="submit"
            open-type="getUserInfo"
            @click="beforeHandle('handleComplete')"
            @getuserinfo="val => getUserInfo(val, 'handleComplete')"
          >
          </button>
        </div>
      </form>

      <van-button
        v-if="!isOther && (isSign || isComplete) || isOther && !isWaitSign"
        size="large"
        custom-class="bg-main detail__btn c-ff"
        @click="toIndex"
      >
        {{ isOther ? '向Ta发起承诺' : status.btnText }}
      </van-button>

      <van-button
        v-if="isShowRefresh"
        size="large"
        custom-class="bg-ee detail__btn c-ff m-t10"
        @click="getDetail"
      >
        刷新状态
      </van-button>
    </div>

    <div class="t-l" v-if="true">
      <p>isSelf: {{ isSelf }}</p>
      <p>isTarget: {{ isTarget }}</p>
      <p>isOther: {{ isOther }}</p>

      <button
        type="primary"
        open-type="getUserInfo"
        @getuserinfo="getUserInfo"
      >
        获取个人信息
      </button>
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
      content: null,
      timer: null
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
      // return true
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
    },

    isShowRefresh () {
      return (this.isSelf && (this.isWaitSign || this.isWaitComplete)) ||
        (this.isTarget && (this.isWaitSignConfirm || this.isWaitCompleteConfirm))
    }
  },

  onShow () {
    utils.setWxBg()

    wx.showShareMenu()
    wx.showLoading({ title: '获取详情' })

    this.getDetail()
  },

  onHide () {
    this.timer && clearInterval(this.timer)
    console.log('clear timer.')
  },

  onShareAppMessage () {
    const name = this.content.from.name
    return {
      title: `${name}希望你答应Ta以下内容，请注意查收～`
    }
  },

  methods: {
    getDetail () {
      db.getDetail(this.$mp.query.id).then(res => {
        const data = res.toJSON()
        data.updatedDate = utils.format(data.updatedAt)
        this.content = data
        detailBak = res
        wx.hideLoading()
      })
    },

    getStatus (type) {
      return this.content
        ? this.content.status === type
        : false
    },

    beforeHandle (fn, params) {
      if (!this.timer) {
        this.timer = setInterval(() => {
          if (this.userInfo && this.formId) {
            clearInterval(this.timer)
            console.log('timer is stopped')

            if (this.isSelf) {
              if (this.isWaitSign) {
                this.saveFromUserFormId()
                return false
              }
            }

            fn && this[fn](params)
          } else {
            console.log('timer is circling...')
          }
        }, 10)
      } else {
        console.log('timer is exist!')
      }
    },

    getUserInfo (res) {
      store.commit('setUser', Object.assign(res.mp.detail.userInfo))
      wx.showToast({ title: 'getUserInfo' })
    },

    getFormIdAndToken (e) {
      wx.request({
        url: 'https://iming.work/api/getAccessToken',
        success: () => {
          this.formId = e.mp.detail.formId
          console.log('已获取token并记录formId')
          // if (this.isWaitSign) {
          // 只对这种情况处理，其余情况在button上绑定处理
          // 因为在分享时，不会触发button的点击事件
          // this.saveFromUserFormId()
          // }
        }
      })
    },

    saveFromUserFormId () {
      Object.assign(detailBak, {
        from: {
          ...detailBak.from,
          formId: this.formId
        }
      }).save().then(() => {
        wx.showToast({ title: '更新from.fromFormId成功' })
      })
    },

    handleCommon (status, opt) {
      this.loading = true
      // 响应式数据循环更新
      return Object.assign(detailBak, {
        status,
        to: Object.keys(this.content.to).length > 0 ? this.content.to : {
          name: this.userInfo.nickName,
          avatar: this.userInfo.avatarUrl,
          date: utils.getNow().full
        },
        ...opt,
        // 只需要更改一次
        toUserId: this.content.toUserId ? this.content.toUserId : store.state.auth.openid
      }).save().then(() => {
        this.loading = false
        this.getDetail()
        return ''
      })
    },

    handleWaitSign () {
      this.handleCommon(WAIT_SIGN_CONFIRM, { to: { formId: this.formId } }).then(() => {
        this.sendMessage({
          message: `您的承诺书已被${this.userInfo.nickName}签署，等待您确认~`,
          status: STATUS[WAIT_SIGN_CONFIRM].text,
          openId: this.content.fromUserId,
          formId: this.content.from.formId
        })
      })
    },

    handleWaitSignConfirm (isTarget) {
      let status
      let message
      const { needExchange, from, toUserId, to } = this.content

      if (isTarget) {
        status = needExchange ? WAIT_COMPLETE : SIGN
        message = `您签署的承诺书已被甲方${from.name}确认${needExchange ? '，等待您兑现承诺～' : ''}`
      } else {
        status = WAIT_SIGN
        message = `甲方${from.name}驳回了您的签署，您不是乙方～`
      }

      this.handleCommon(status, { from: { formId: this.formId } }).then(() => {
        this.sendMessage({
          message,
          status: STATUS[status].text,
          openId: toUserId,
          formId: to.formId
        })
      })
    },

    handleCompleteConfirm () {
      this.handleCommon(WAIT_COMPLETE_CONFIRM, { to: { formId: this.formId } }).then(() => {
        this.sendMessage({
          message: `承诺已被${this.content.to.name}兑现，请确认是否已兑现～`,
          status: STATUS[WAIT_COMPLETE_CONFIRM].text,
          openId: this.content.fromUserId,
          formId: this.content.from.formId
        })
      })
    },

    handleComplete () {
      this.handleCommon(COMPLETE, { from: { formId: this.formId } }).then(() => {
        this.sendMessage({
          message: `甲方${this.content.from.name}已确认您兑现了承诺`,
          status: STATUS[COMPLETE].text,
          openId: this.content.toUserId,
          formId: this.content.to.formId
        })
      })
    },

    sendMessage (opt) {
      wx.request({
        url: 'https://iming.work/api/sendTemplateMessage',
        data: {
          formId: opt.formId,
          openId: opt.openId,
          page: `pages/detail/main?id=${this.$mp.query.id}`,
          templateId: 'keRZcuEsnmNUVh6I2qd9inGlabqRg2rzv628rmsiKNE',
          value1: opt.status,
          value2: utils.getNow().fullTime,
          value3: opt.message
        },
        success: (res) => {
          console.log(res)
          wx.showToast({ title: '发送消息回调' })
        }
      })
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
      word-break break-all
      line-height 25px
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
  &__from,
  &__to {
    padding 0 10px
    border-bottom 1rpx #666 solid
    margin 0 5px
  }

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
