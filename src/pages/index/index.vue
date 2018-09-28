<template>
  <div class="container">
    <div class="welcome w-94 f-14">
      <img src="../../images/logo.jpg">
      <p>见证承诺，见证时刻</p>
    </div>

    <div class="tab__list center w-94 f-14">
      <div
        class="tab center tab__from-me"
        hover-class="tab__hover"
        hover-start-time="0"
        hover-stay-time="100"
        @click="toList(1)"
      >
        <van-icon name="edit-data" size="30px" />
        <span class="tab__label">我承诺的</span>
        <button
          v-if="!userInfo"
          open-type="getUserInfo"
          @getuserinfo="val => getUserInfo(val, 1)"
          plain
        >
        </button>
      </div>
      <div
        class="tab center tab__to-me"
        hover-class="tab__hover"
        hover-start-time="0"
        hover-stay-time="100"
        @click="toList(2)"
      >
        <van-icon name="password-view" size="30px" />
        <span class="tab__label">我见证的</span>
        <button
          v-if="!userInfo"
          open-type="getUserInfo"
          @getuserinfo="val => getUserInfo(val, 2)"
          plain
        >
        </button>
      </div>
    </div>

    <div class="add">
      <div v-if="showAdd" class="add__out center">
        <div
          class="add__circle"
          hover-class="tab__hover"
          hover-start-time="0"
          hover-stay-time="100"
        >
          添加承诺
        </div>
        <div
          class="add__circle"
          hover-class="tab__hover"
          hover-start-time="0"
          hover-stay-time="100"
        >
          添加时刻
        </div>
      </div>
      <div
        class="add__circle"
        hover-class="tab__hover"
        hover-start-time="0"
        hover-stay-time="100"
        @click="handleAdd()"
      >
        <span>+</span>
      </div>
      <button
        v-if="!userInfo"
        open-type="getUserInfo"
        @getuserinfo="val => getUserInfo(val, 3)"
        plain
      >
      </button>
    </div>
  </div>
</template>

<script>
import store from '../../store'
import { TAB_INDEX } from '@/constant/index'
import utils from '@/utils/index'

export default {
  data () {
    return {
      showAdd: false
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    }
  },

  methods: {
    handleAdd () {
      console.log(this.userInfo)
      wx.navigateTo({
        url: '/pages/create/main'
      })
    },

    toList (type) {
      wx.navigateTo({
        url: `/pages/list/main?type=${type}`
      })
    },

    getUserInfo (res, type) {
      // db.setUser()
      store.commit('setUser', Object.assign(res.mp.detail.userInfo))
      if (type === 3) {
        this.handleAdd()
      } else {
        this.toList(type)
      }
    }
  },

  onShow () {
    utils.setStore(TAB_INDEX, 0)
    wx.showShareMenu()
  },

  onShareAppMessage () {
    return {
      title: '见证承诺，见证时刻',
      imageUrl: require('../../images/share.jpg')
    }
  }
}
</script>

<style>
.welcome {
  display: flex;
  align-items: center;
  flex-direction: column;
  color:#304261;
}
.welcome img {
  width: 180rpx;
  height: 180rpx;
  border-radius: 50%;
}
.tab__list {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  flex-direction: column;
}
.tab__list .tab {
  position: relative;
  width: 80%;
  height: 200rpx;
  border-radius: 4rpx;
  color: #ffffff;
  flex-direction: column;
  box-shadow:1rpx 2rpx 5rpx #cccccc;
}
.tab__list .tab button {
  position: absolute;
  width: 100%;
  height: 100%;
  border: none;
}
.tab__from-me {
  margin-bottom: 20rpx;
  background-color: #aaa;
}
.tab__to-me {
  /*background-color: #FF6666;*/
  background-color: #304261;
}
.add {
  position: absolute;
  bottom: 50rpx;
  left: 50%;
  transform: translateX(-50%);
}
.add__circle {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  box-shadow: 0rpx 0rpx 20rpx rgba(0, 0, 0, .2);
  font-size: 0;
  font-weight: 200;
  color: #999999;
  text-align: center;
}
.add__circle span {
  font-size: 80rpx;
  color: #304261;
  line-height:130rpx;
  height:140rpx;
}
.add button {
  position: absolute;
  top: 0;
  left: 0;
  height:140rpx;
  width:140rpx;
  border-radius:50%;
  border: none;
}
.add__out {
  position: absolute;
  top: -160rpx;
  left: 50%;
  transform: translateX(-50%);
}
.add__out .add__circle {
  font-size: 14px;
}
.add__out .add__circle:first-child {
  margin-right: 30rpx;
}
</style>
