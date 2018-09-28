<template>
  <div class="my-button">
    <button
      v-if="false"
      class="my-button__btn"
      open-type="getUserInfo"
      @getuserinfo="getUserInfo"
      plain
    >
    </button>
    <slot></slot>
  </div>
</template>

<script>
import store from '@/store/index'

export default {
  props: {
    callback: {
      type: Function,
      required: true
    }
  },

  computed: {
    userInfo () {
      return store.state.userInfo
    }
  },

  methods: {
    getUserInfo (res) {
      store.commit('setUser', Object.assign(res.mp.detail.userInfo))
      Promise.resolve(() => {
        this.callback()
      })
    }
  }
}
</script>

<style lang="stylus">
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
