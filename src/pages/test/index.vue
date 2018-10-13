<template>
  <div class="container">
    <p>formId: {{ formId }}</p>
    <form @submit="getToken" report-submit="true">
      <button type='primary' form-type="submit" size='mini'>发送模板消息</button>
    </form>
  </div>
</template>

<script>
export default {
  data () {
    return {
      formId: ''
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
          openId: 'okbFo5JofpMsNWsD156pnLpo5yXc'
        },
        success (res) {
          console.log(res.data)
        }
      })
    }
  }
}
</script>

<style>

</style>
