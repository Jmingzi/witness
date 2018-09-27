export default {
  insert (data) {
    console.log(data)
    return Promise.resolve(1)
  },

  getDetail (id) {
    console.log(`id: ${id}`)
    return Promise.resolve(1)
  }
}
