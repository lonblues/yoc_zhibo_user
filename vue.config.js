module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '/index.php': {
        target: 'http://web-backend-test.reachable-edu.com/Zhibo/',
        secure: false
      }
    },
    port: 8083
  }
}
