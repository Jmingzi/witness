<template>
  <div class="container">
    <div class="create__wrap">
      <div class="create__content">
        <p class="center">承诺书</p>
        <img src="../../images/yz.gif" class="seal">
        <van-field
          type="textarea"
          placeholder="我向月亮发誓..."
          :border="false"
          :focus="true"
          :error-message="errorMsg"
          :value="textContent"
          @change="e => textContent = e.mp.detail"
          maxlength="200"
          border
        />

        <van-row>
          <van-col span="12">
            <van-field
              label="甲方"
              title-width="40px"
              placeholder="请输入"
              disabled
              :value="userInfo.nickName"
            />
          </van-col>
          <van-col span="12">
            <van-field
              label="乙方"
              title-width="40px"
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
              :value="now.full"
            />
          </van-col>
          <van-col span="12">
            <van-field
              label="日期"
              title-width="40px"
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
      loading: false
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    },
    auth () {
      return store.state.auth
    }
  },

  onShow () {
    utils.setWxBg()
  },

  methods: {
    onChange (event) {
      // 需要手动对 checked 状态进行更新
      this.needExchange = event.mp.detail
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
        this.errorMsg = '至少10个字，承诺这么少有什么用呢...'
        return false
      }
      this.errorMsg = ''
      this.loading = true
      const reqData = {
        content: val,
        from: {
          name: this.userInfo.nickName,
          avatar: this.userInfo.avatarUrl,
          date: this.now.full
        },
        to: {
        },
        status: WAIT_SIGN,
        fromUserId: this.auth.openid,
        toUserId: '',
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
</style>
