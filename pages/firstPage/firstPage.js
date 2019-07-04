let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // App._get('api/personInfo/testLink', {},
    //   function (res) {//成功
    //     console.log(res, "res")
    //   }
    // )
  },
  toLogin(){
    wx.navigateTo({
      url: '../login2/login2',
    })
  },
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})