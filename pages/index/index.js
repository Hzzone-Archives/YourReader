Page({
    data: {
        inputShowed: false,
        inputVal: "",
        resultShowed: false,
        searcResults: [],
        book_shelf: [],
    },
    onLoad: function (options) {
        const app = getApp()
        console.log(app.globalData.book_shelf)
        this.setData({
            book_shelf: app.globalData.book_shelf
        })
    },
    showInput: function () {
        this.setData({
            inputShowed: true
        });
    },
    hideInput: function () {
        this.setData({
            inputVal: "",
            inputShowed: false,
            resultShowed: false,
            searcResults: []
        });
    },
    clearInput: function () {
        this.setData({
            inputVal: "",
            searcResults: [],
        });
    },
    search: function (e) {
        this.setData({
            inputVal: e.detail.value,
            resultShowed: true
        });
        wx.showLoading({
            title: '正在搜索',
        })
        wx.request({
            url: 'https://api.zhuishushenqi.com/book/fuzzy-search?query=' + this.data.inputVal,
            method: 'get',
            success: res => {
                console.log(res.data)
                this.setData({
                    searcResults: res.data.books 
                })
            },
            fail: res => {
                wx.showToast({
                    title: '接口不可用',
                    icon: 'none',
                    duration: 3000
})
            },
            complete: function() {
                wx.hideLoading()
            }
        })

    },
    goToDetail: function (e) {
        const index = e.currentTarget.dataset.index
        console.log(this.data.searcResults[index])
        wx.navigateTo({
            url: '/pages/detail/detail?book=' + JSON.stringify(this.data.searcResults[index]),
        })
    },
    deleteBook: function (e) {
        const index = e.currentTarget.dataset.index
        console.log(index)
        var that = this
        wx.showActionSheet({
            itemList: ['删除'],
            success: function (res) {
                if (!res.cancel) {
                    // console.log(res.tapIndex)
                    
                    that.setData({
                        book_shelf: that.data.book_shelf.splice(0, index)
                    })
                }
            }
        });
    },
    goToRead: function (e) {
        const index = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '/pages/read/read?book=' + JSON.stringify(this.data.book_shelf[index]),
        })        
    },
});