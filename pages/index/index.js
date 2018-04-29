const app = getApp()
Page({
    data: {
        inputShowed: false,
        inputVal: "",
        resultShowed: false,
        searcResults: [],
        book_shelf: [],
    },
    onLoad: function (options) {

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
            itemList: ['删除', '小说详情'],
            success: function (res) {
                if (!res.cancel) {
                    // console.log(res.tapIndex)
                    switch (res.tapIndex) {
                        case 0:
                            that.setData({
                                book_shelf: that.data.book_shelf.splice(0, index)
                            })
                            app.globalData.book_shelf = app.globalData.book_shelf.splice(0, index)
                            wx.setStorage({
                                key: "books",
                                data: app.globalData.book_shelf,
                                success: res => {
                                    console.log(res.data)
                                    wx.showToast({
                                        title: '删除成功',
                                    })
                                }
                            })
                            break
                        case 1:
                            wx.navigateTo({
                                url: '/pages/detail/detail?book=' + JSON.stringify(app.globalData.book_shelf[index]),
                            })
                            break
                    }
                    
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
    
    onShow: function () {
        const app = getApp()
        var tmp = JSON.stringify(app.globalData.book_shelf)
        tmp = JSON.parse(tmp)
        for (var idx in tmp) {
            tmp[idx].cover = app.globalData.static_url + tmp[idx].cover
        }
        this.setData({
            book_shelf: tmp
        })
        
    }
});