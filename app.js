App({
  onLaunch: function () {
      try {
          var res = wx.getStorageInfoSync()
          var that = this
          if (!(res.keys.indexOf('books')<0)) {
              wx.getStorage({
                  key: 'books',
                  success: function (res) {
                      console.log(res.data)
                      that.globalData.book_shelf = res.data
                  },
                  fail: function (res) {
                      console.log(res.data)
                  }
              })
          } else {
              try {
                  wx.setStorageSync('books', [])
                  this.globalData.book_shelf = []
                  console.log('no books local found')
              } catch (e) {
              }
          }
      } catch (e) {
          // Do something when catch error
      }
  },
  globalData: {
      static_url: 'https://statics.zhuishushenqi.com',
      book_shelf: []
  }
})
