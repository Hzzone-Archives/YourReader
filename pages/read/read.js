// pages/read/read.js
String.prototype.format = function () {
    var resultStr = this.toString();
    // 参数为对象
    if (typeof arguments[0] === "object") {
        for (var i in arguments[0]) {
            resultStr = resultStr.replace("{" + i + "}", arguments[0][i]);
        }
    }
    // 多个参数
    else {
        for (var i = 0; i < arguments.length; i++) {
            resultStr = resultStr.replace("{" + i + "}", arguments[i]);
        }
    }
    return resultStr;
};

Page({

    /**
     * 页面的初始数据
     */
    data: {
        book: {},
        booksources: [],
        curr_source: { chapters: [] },
        chapters: [],
        curr_chapter: {},
        curr_index: 0,
        showMenu: 'none',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var tmp = JSON.parse(options.book)
        var that = this
        var isConnected = true
        wx.onNetworkStatusChange(function (res) {
            console.log(res.isConnected)
            isConnected = res.isConnected
        })
        if (isConnected) {
            /// 有网络时读取当前章节
            // 获取书源
            //http://api.zhuishushenqi.com/atoc?view=summary&book=5373898f1032be0155019e73
            wx.showLoading({
                title: '正在加载数据',
            })
            // var sourceid = tmp.curr_source.split('_')[1]
            wx.request({
                url: 'https://api.zhuishushenqi.com/atoc?view=summary&book={0}'.format(tmp._id),
                method: 'get',
                success: res => {
                    var booksources = res.data
                    booksources.sort(function (a, b) {
                        return new Date(b.updated).getTime() - new Date(a.updated).getTime();
                    })
                    console.log(booksources)
                    var source = booksources[0]

                    wx.showLoading({
                        title: '正在加载数据',
                    })
                    /// 获取章节目录
                    wx.request({
                        url: 'https://api.zhuishushenqi.com/atoc/{0}?view=chapters'.format(source._id),
                        method: 'get',
                        success: res => {
                            var chapters = res.data
                            console.log(chapters)
                            this.setData({
                                booksources: booksources,
                                chapters: chapters.chapters,
                            })


                            //改变当前章节
                            this.chageCurrentChap()
                            

                        },
                        fail: res => {
                            wx.showToast({
                                title: '接口不可用',
                                icon: 'none',
                                duration: 10000
                            })
                        },
                        complete: function () {
                            wx.hideLoading()
                        }
                    })
                    
                },
                fail: res => {
                    wx.showToast({
                        title: '接口不可用',
                        icon: 'none',
                        duration: 10000
                    })
                },
                complete: function () {
                    wx.hideLoading()
                }
            })
            
        } else {
            /**
             * 无网提示
             */
            wx.showToast({
                title: '网络不可用',
                icon: 'none',
                duration: 10000
            })
        }
        
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
    
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
    
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
    
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
    
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {
    
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {
    
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {
    
    },
    showMenu: function () {
        console.log('点击屏幕中央')
        this.setData({
            showMenu: this.data.showMenu=='none'?'':'none'
        })
    },

    chageCurrentChap: function () {
        var that = this
        // 获取章节内容
        wx.showLoading({
            title: '正在加载章节内容',
        })
        wx.request({
            url: 'https://chapter2.zhuishushenqi.com/chapter/{0}'.format(that.data.chapters[that.data.curr_index].link),
            method: 'get',
            success: res => {
                var curr_chapter = res.data.chapter
                console.log(curr_chapter)
                curr_chapter.body = curr_chapter.body.split('\n').map(function (v) {
                    return v.replace(/(^\s*)|(\s*$)/g, "")
                })
                that.setData({
                    curr_chapter: curr_chapter
                })
                wx.setNavigationBarTitle({
                    title: curr_chapter.title,
                })
                wx.pageScrollTo({
                    scrollTop: 0,
                    duration: 0
                })
            },
            fail: res => {
                wx.showToast({
                    title: '接口不可用',
                    icon: 'none',
                    duration: 10000
                })
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    },

    prevChapter: function () {
        var curr_index = this.data.curr_index
        if (curr_index>0) {
            this.setData({
                curr_index: curr_index - 1
            })
            this.chageCurrentChap()
        }
    },

    nextChapter: function () {
        var curr_index = this.data.curr_index
        if (curr_index < this.data.chapters.length-1) {
            this.setData({
                curr_index: curr_index + 1
            })
            console.log(this.data.curr_index)
            this.chageCurrentChap()
        }
    },

    removeAll() {
        this.setData({
            showMenu: 'none',
            showChapterList: 'none',
            showBooksourcesList: 'none',
        })
    },

    change(e) {
        const action_type = e.currentTarget.dataset.type
        switch (action_type) {
            case '0':
                this.setData({
                    showMenu: 'none',
                })
                
                wx.navigateTo({
                    url: '/pages/list/list?action_type={0}'.format(action_type),
                })
                break;
            case '1':
                this.setData({
                    showMenu: 'none',
                })
                
                wx.navigateTo({
                    url: '/pages/list/list?action_type={0}'.format(action_type),
                })
                break;
        }
    },

    changeCurrChapter(e) {
        const index = e.currentTarget.dataset.index
        this.setData({
            showChapterList: 'none',
            curr_index: parseInt(index),
        })
        this.chageCurrentChap()
    }
})