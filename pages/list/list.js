// pages/list/list.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        contents: [],
        curr_index: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var action_type = parseInt(options.action_type)
        console.log(action_type)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        switch(action_type) {
            case 0:
                var contents = prevPage.data.booksources.map(function (v) { return v.name; })
                wx.setNavigationBarTitle({
                    title: '书源',
                })
                var index = prevPage.data.booksources.indexOf(prevPage.data.curr_source)
                console.log(index)
                break
            case 1:
                var contents = prevPage.data.chapters.map(function (v) { return v.title; })
                wx.setNavigationBarTitle({
                    title: '目录',
                })
                var index = prevPage.data.curr_index
                break
        }
        console.log(index)
        console.log(contents[index])
        this.setData({
            contents: contents,
            curr_index: index
        })
        // var location = res.windowWidth / 750 * (index + 1) * 50

        // wx.pageScrollTo({
        //     scrollTop: location,
        //     duration: 0
        // })
        
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        console.log(app.globalData.windowWidth)
        var location = app.globalData.windowWidth * (this.data.curr_index - 5) * 80
        console.log(location)
        wx.pageScrollTo({
            scrollTop: location,
            duration: 0
        })
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

    changePrevPage(e) {
        const index = e.currentTarget.dataset.index
        console.log(index)
        var pages = getCurrentPages();
        var prevPage = pages[pages.length - 2];  //上一个页面
        prevPage.setData({
            curr_index: index,
            curr_chapter: prevPage.data.chapters[index]
        })
        prevPage.chageCurrentChap()
        wx.navigateBack({
            
        })
    }
})