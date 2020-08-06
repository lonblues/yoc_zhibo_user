module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/index.php': {
        target: 'http://101.132.180.199/host/AwardReport/',
        secure: false
      }
    },
    port: 8083
  }
}
