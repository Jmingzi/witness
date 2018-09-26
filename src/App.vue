<script>
export default {
  created () {
    // 调用API从本地缓存中获取数据
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    console.log('app created and cache logs by setStorageSync')
  }
}
</script>

<style>
page {
  height: 100%;
}
view {
  box-sizing: border-box;
}
.container {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
}
.w-94 {
  width: 94%;
}
.f-14 {
  font-size: 14px;
}
.center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.bg-ee {
  background-color: #cccccc;
}
</style>
