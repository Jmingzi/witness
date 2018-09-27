<template>
  <div class="container bg-f2">
    <div class="list__tab">
      <van-tabs :active="active">
        <van-tab title="我添加的"></van-tab>
        <van-tab title="我见证的"></van-tab>
      </van-tabs>
    </div>

    <div class="list__area">
      <scroll-view
        style="height: 100%"
        v-if="list.length > 0"
        scroll-y
        @scrolltolower="toBottom"
      >
        <div
          v-for="(item, i) in list"
          :key="i"
          class="list__item f-14"
          hover-class="tab__hover"
          hover-start-time="0"
          hover-stay-time="100"
          @click="toDetail(item)"
        >
          <div class="img">
            <img src="../../images/logo.jpg">
          </div>
          <div class="list__item-right">
            <div class="list__item-info">
              <span>2018-08-08</span>
              <van-tag>已兑现</van-tag>
            </div>
            <p>内容很长内容很长内容很长内容很长内容很长内容很长内容很长内容很长</p>
          </div>
        </div>
      </scroll-view>

      <div v-else class="empty center">
        <van-icon name="info-o" size="40px" />
        <p class="f-14">暂无数据~</p>

        <van-button
          v-if="query.type === '1'"
          custom-class="empty__add"
          @click="toCreate"
        >
          立即添加
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
// import { formatTime } from '@/utils/index'
// import card from '@/components/card'

export default {
  components: {
  },

  data () {
    return {
      active: 0,
      list: [1, 2, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    }
  },

  computed: {
    query () {
      return this.$root.$mp.query
    }
  },

  mounted () {
  },

  onShow () {
    this.active = this.$mp.query.type - 1
  },

  methods: {
    toCreate () {
      wx.redirectTo({
        url: '/pages/create/main'
      })
    },

    toBottom () {
      console.log(1)
    },

    toDetail (item) {
      wx.navigateTo({
        url: `/pages/detail/main?id=1`
      })
    }
  }
}
</script>

<style lang="stylus">
.list__tab {
  width: 100%;
  position: absolute;
  left: 0;
  top: 0;
  box-shadow:0 1px 3px #ccc;
}
.list__area {
  position: absolute;
  top: 54px;
  bottom: 10rpx;
  width: 100%;
  left: 0;
}
.list__item {
  display: flex;
  border: 1rpx #eee solid;
  border-radius: 4rpx;
  box-shadow:1rpx 2rpx 5rpx #cccccc;
  margin: 0 20rpx 20rpx 20rpx;
  background-color: #fff;
  padding: 20rpx;
}
.list__item .img {
  width: 250rpx;
  height: 140rpx;
  border-radius: 4rpx;
  overflow: hidden;
  margin-right: 20rpx;
}
.list__item .img img {
  width: 100%;
  height: 100%;
}
.list__item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20rpx;
  font-size: 12px;
  color: #999999;
}
.empty {
  flex-direction: column;
  color: #999999;
  padding-top: 200rpx;
}
.empty__add {
  margin-top: 40rpx;
}
</style>
