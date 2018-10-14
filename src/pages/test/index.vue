<template>
  <div class="container">
    <p>formId: {{ formId }}</p>
    <p>message - res: {{ resData }}</p>
    <p>userInfo: {{ userInfo }}</p>
    <form @submit="getToken" report-submit="true">
      <button
        type='primary'
        form-type="submit"
        open-type="getUserInfo"
        @getuserinfo="getUserInfo"
      >
        发送模板消息
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formId: '',
      resData: '',
      userInfo: ''
    }
  },

  methods: {
    getToken (e) {
      this.formId = e.mp.detail.formId
      wx.request({
        url: 'https://iming.work/api/getAccessToken',
        success: () => {
          this.templateSend(this.formId)
        }
      })
    },

    templateSend (formId) {
      wx.request({
        url: 'https://iming.work/api/sendTemplateMessage',
        data: {
          formId,
          openId: 'okbFo5JofpMsNWsD156pnLpo5yXc',
          page: 'pages/index/main',
          templateId: 'keRZcuEsnmNUVh6I2qd9inGlabqRg2rzv628rmsiKNE',
          value1: '已签署',
          value2: '2018-10-15 12:01',
          value3: '您的承诺已被签署，请尽快查看哦～'
        },
        success: (res) => {
          console.log(2)
          this.resData = JSON.stringify(res.data)
        }
      })
    },

    getUserInfo (res) {
      console.log(1)
      this.userInfo = JSON.stringify(res.mp.detail.userInfo.nickName)
    }
  }
}
</script>

<style>

</style>
