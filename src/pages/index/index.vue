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
      >
        <van-icon name="edit-data" size="30px" />
        <span class="tab__label">我创建的</span>
      </div>
      <div
        class="tab center tab__to-me"
        hover-class="tab__hover"
        hover-start-time="0"
        hover-stay-time="100"
      >
        <van-icon name="password-view" size="30px" />
        <span class="tab__label">我见证的</span>
      </div>
    </div>

    <div class="add">
      <div class="add__circle">
        <span>+</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
    }
  },

  methods: {
  },

  created () {
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
  width: 80%;
  height: 200rpx;
  border-radius: 10rpx;
  color: #ffffff;
  flex-direction: column;
}
.tab__hover {
  background-color: #dddddd !important;
}
.tab__from-me {
  margin-bottom: 20rpx;
  background-color: #CCCCCC;
}
.tab__to-me {
  background-color: #FF6666;
}
.tab__label {
}
.add {
  position: absolute;
  bottom: 50rpx;
  left: 50%;
  transform: translateX(-50%);
}
.add__circle {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  box-shadow:0rpx 0rpx 20rpx rgba(0, 0, 0, .2);
  font-size: 0;
  font-weight:200;
  color:#999999;
}
.add__circle span {
  font-size:80rpx;
  height: 120rpx;
  color:#304261;
}
</style>
