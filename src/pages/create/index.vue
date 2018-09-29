<template>
  <div class="container">
    <div class="create__wrap f-14">
      <div class="create__content">
        <div class="center title__wrap">
          <div class="fromUser c-99">{{ fromUser.nickName ? (fromUser.nickName + '(我)') : '甲方' }}</div>
          <span>要</span>
          <div class="toUser c-99">{{ toUser.nickName ? (toUser.nickName + '(我)') : '乙方' }}</div>
          <span>承诺</span>
        </div>
        <img src="../../images/yz.gif" class="seal">

        <van-field
          type="textarea"
          placeholder="向月亮发誓..."
          :border="false"
          :focus="true"
          :error-message="errorMsg"
          :value="textContent"
          @change="e => textContent = e.mp.detail"
          maxlength="200"
          border
        />

        <div class="b-b role__wrap" v-if="false">
          <span>我是</span>
          <div class="c-99">
            <radio-group class="radio-group" @change="changeRole">
              <label class="radio" v-for="item in roles" :key="item.name">
                <radio
                  :value="item.name"
                  :checked="currentRoles === 'from' && item.name === 'from' || currentRoles === 'to' && item.name === 'to'"
                />
                {{ item.value }}
              </label>
            </radio-group>
          </div>
        </div>

        <van-row>
          <van-col span="12">
            <van-field
              label="甲方"
              title-width="40px"
              disabled
              :value="fromUser.nickName"
            />
          </van-col>
          <van-col span="12">
            <van-field
              label="乙方"
              title-width="40px"
              :value="toUser.nickName"
              disabled
            />
          </van-col>
        </van-row>

        <van-row>
          <van-col span="12">
            <van-field
              label="日期"
              title-width="40px"
              disabled
              :value="isFrom ? now.full : ''"
            />
          </van-col>
          <van-col span="12">
            <van-field
              label="日期"
              title-width="40px"
              :value="isTo ? now.full : ''"
              disabled
            />
          </van-col>
        </van-row>

        <van-switch-cell
          title="是否需要兑现"
          :checked="needExchange"
          @change="onChange"
          :border="needExchange"
        />

        <van-cell
          v-if="needExchange"
          title="兑现截止日期"
          :border="false"
        >
          <picker
            mode="date"
            :value="exchangeDate"
            :start="now.full"
            @change="onChangeDate"
          >
            {{ exchangeDate }}
          </picker>
        </van-cell>
      </div>

      <van-button
        size="large"
        :loading="loading"
        custom-class="bg-main c-ff"
        @click="submit"
      >
        提交
      </van-button>
    </div>
  </div>
</template>

<script>
import utils from '@/utils/index'
import db from '@/db/index'
import store from '../../store'
import { WAIT_SIGN } from '../../constant'

export default {
  components: {
  },

  data () {
    return {
      textContent: '',
      errorMsg: '',
      needExchange: false,
      exchangeDate: utils.getNow().full,
      now: utils.getNow(),
      loading: false,
      roles: [
        { name: 'from', value: '甲方' },
        { name: 'to', value: '乙方' }
      ],
      currentRoles: 'from'
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo || {}
    },
    auth () {
      return store.state.auth
    },
    isFrom () {
      return this.currentRoles === 'from'
    },
    isTo () {
      return this.currentRoles === 'to'
    },
    fromUser () {
      return this.isFrom ? this.userInfo : {}
    },
    toUser () {
      return this.isTo ? this.userInfo : {}
    }
  },

  onShow () {
    this.textContent = ''
    utils.setWxBg()
  },

  methods: {
    onChange (event) {
      // 需要手动对 checked 状态进行更新
      this.needExchange = event.mp.detail
    },

    changeRole (e) {
      this.currentRoles = e.mp.detail.value
    },

    onChangeDate (e) {
      this.exchangeDate = e.mp.detail.value
    },

    submit () {
      const val = this.textContent.trim()
      if (!val) {
        this.errorMsg = '请输入承诺内容'
        return false
      } else if (val.length < 5) {
        this.errorMsg = '至少5个字，承诺这么少有什么用呢...'
        return false
      }
      this.errorMsg = ''
      this.loading = true
      const user = {
        name: this.userInfo.nickName,
        avatar: this.userInfo.avatarUrl,
        date: this.now.full
      }
      const reqData = {
        content: val,
        from: this.isFrom ? user : {},
        to: this.isTo ? user : {},
        status: WAIT_SIGN,
        fromUserId: this.isFrom ? this.auth.openid : '',
        toUserId: this.isTo ? this.auth.openid : '',
        dataStatus: 1,
        imgUrl: '',
        needExchange: this.needExchange,
        exchangeDate: this.exchangeDate
      }
      db.insert(reqData).then(id => {
        this.loading = false
        wx.redirectTo({ url: `/pages/detail/main?id=${id}` })
      })
    }
  }
}
</script>

<style lang="stylus">
@import '../../styles/common.styl'

.create__wrap
  @extend $full-screen__bg

.create__content
  @extend $content__area
  width:99.2%
  margin: 0 auto 20rpx auto

.fromUser,
.toUser {
  padding 0 15px
  border-bottom 1rpx #666 solid
  margin 0 5px
}
.title__wrap
  margin-bottom 10px
.role__wrap
  display flex
  justify-content space-between
  align-items center
  height 46.5px
  margin-left 15px
</style>
