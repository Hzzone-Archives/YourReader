Page({
    data: {
        book: {}
    },

    onLoad: function (options) {
        this.setData({
            book: JSON.parse(options.book)
        })
        console.log(this.data.book)
    }
});