<template>
  <div class="container bg-f2">
    <div class="list__tab">
      <van-tabs :active="active" @change="changeTab">
        <van-tab title="我承诺的"></van-tab>
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
          v-for="item in list"
          :key="item.objectId"
          class="list__item f-14"
          hover-class="tab__hover"
          hover-start-time="0"
          hover-stay-time="100"
          @click="toDetail(item)"
        >
          <div class="img">
            <img :src="item.to.avatar ? item.to.avatar : '../../images/logo.jpg'">
          </div>
          <div class="list__item-right">
            <div class="list__item-info">
              <div class="center">
                <van-icon class="list__item-icon" name="clock"></van-icon>
                <span>{{ item.updatedAt }}</span>
              </div>
              <van-tag :type="item.statusObj.style">{{ item.statusObj.text }}</van-tag>
            </div>
            <p class="list__item-word">{{ item.content }}</p>
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
          立即添加承诺
        </van-button>
      </div>
    </div>
  </div>
</template>

<script>
import db from '@/db/index'
import utils from '@/utils/index'
import store from '@/store/index'
import { STATUS, TAB_INDEX } from '@/constant/index'

export default {
  components: {
  },

  data () {
    return {
      active: 0,
      list: [],
      currentPage: 1,

      hasLoad: false
    }
  },

  computed: {
    query () {
      return this.$root.$mp.query
    },

    auth () {
      return store.state.auth
    }
  },

  mounted () {
  },

  watch: {
    auth () {
      console.log('has auth, get list')
      this.getList()
    }
  },

  onShow () {
    this.active = this.$mp.query.type - 1
    utils.getStore(TAB_INDEX).then(res => {
      if (res) {
        this.active = res

        if (this.auth) {
          console.log('has auth, get list')
          this.getList()
        }
      }
    })
  },

  methods: {
    toCreate () {
      wx.redirectTo({
        url: '/pages/create/main'
      })
    },

    getList () {
      this.hasLoad = true
      wx.showLoading({ title: '获取列表' })
      const field = this.active === 0 ? 'fromUserId' : 'toUserId'
      db.getList(this.currentPage, { [field]: store.state.auth.openid }).then(res => {
        wx.hideLoading()
        this.list = res.map(x => {
          const item = x.toJSON()
          return {
            ...item,
            updatedAt: utils.format(item.updatedAt),
            statusObj: STATUS[item.status]
          }
        })
      })
    },

    changeTab (e) {
      this.active = e.mp.detail.index
      utils.setStore(TAB_INDEX, this.active)
      this.getList()
    },

    toBottom () {
      console.log(1)
    },

    toDetail (item) {
      wx.navigateTo({
        url: `/pages/detail/main?id=${item.objectId}`
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
  /*width: 250rpx;*/
  width: 140rpx;
  height: 140rpx;
  border-radius: 4rpx;
  overflow: hidden;
  margin-right: 20rpx;
}
.list__item .img img {
  width: 100%;
  height: 100%;
}
.list__item-right {
  width: 255px;
}
.list__item-icon {
  margin-right: 5px
  margin-bottom: -4px
}
.list__item-word
  word-break break-all
  display:-webkit-box;
  overflow:hidden;
  -webkit-line-clamp:2;
  -webkit-box-orient:vertical

.list__item-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 5px;
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
