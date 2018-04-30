const app = getApp()
Page({
    data: {
        book: {},
        exists: true,
        cover: ''
    },

    onLoad: function (options) {
        var book = JSON.parse(options.book)

        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            resultShowed: false,
            inputVal: '',
            inputShowed: false
        })

        const app = getApp()
        console.log(app.globalData.static_url)

        var _id_li = app.globalData.book_shelf.map(function (v) { return v._id; })
        console.log(_id_li)
        var index = _id_li.indexOf(book._id)
        var exists = !(index < 0)
        if (exists) {
            this.setData({
                exists: exists,
                book: app.globalData.book_shelf[index],
                cover: app.globalData.static_url + book.cover
            })
        } else {
            this.setData({
                exists: exists,
                book: book,
                cover: app.globalData.static_url + book.cover
            })
        }
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