const app = getApp()
Page({
    data: {
        book: {},
        exists: true,
        cover: ''
    },

    onLoad: function (options) {
        this.setData({
            book: JSON.parse(options.book),
        })

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            resultShowed: false,
            inputVal: '',
            inputShowed: false
        })

        const app = getApp()
        console.log(app.globalData.static_url)
        this.setData({
            cover: app.globalData.static_url + this.data.book.cover
        })

        var _id_li = app.globalData.book_shelf.map(function (v) { return v._id; });
        console.log(_id_li)
        this.setData({
            exists: !(_id_li.indexOf(this.data.book._id)<0)
        })
        console.log(this.data.book)
    },

    errorFunction: function (e) {
        this.setData({
            cover: '/images/default.jpg',
        })
    },
    addBook: function () {
        var that = this
        app.globalData.book_shelf.unshift(this.data.book)
        console.log(app.globalData.book_shelf)
        wx.setStorage({
            key: "books",
            data: app.globalData.book_shelf,
            success: res => {
                wx.showToast({
                    title: '添加书架成功',
                })
                that.setData({
                    exists: !that.data.exists 
                })
            },
            fail: res => {
                console.log('添加失败')
            }
        })
    },
    read: function () {
        wx.navigateTo({
            url: '/pages/read/read?book=' + JSON.stringify(this.data.book),
        })
    }
});