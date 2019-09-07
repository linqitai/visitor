let App = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    EnterCode:""
  },
  onShow: function () {
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onload");
    this.login();
  },
  login(){
    wx.login({
      success: function (res) {
        console.log('res', res)
        if (res.code) {
          //发起网络请求
          // let code = res.code;
          //把code传给接口
          let d = {
            appid: App.globalData.appid,
            secret: App.globalData.secret,
            js_code: res.code,
            grant_type: "authorization_code"
          }
          let url = 'https://api.weixin.qq.com/sns/jscode2session?appid=' + d.appid + '&secret=' + d.secret + '&js_code=' + res.code + '&grant_type=authorization_code';
          wx.request({
            url: url,
            data: {},
            method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
            // header: {}, // 设置请求的 header  
            success: function (res) {
              console.log('res', res)
              console.log('App.globalData.openid', res.data.openid)
              App.globalData.openid = res.data.openid;
              wx.setStorageSync('openid', res.data.openid)
              console.log('App.globalData.openid', App.globalData.openid)
              let prams = {
                OpenId: App.globalData.openid
              }
              App._post_form('api/visitors/haveUserInfo', prams, function (res) {
                console.log('havaUserInfo', res)
                let result = JSON.parse(res);
                if (result.code == 0) {
                  wx.navigateTo({
                    url: '../login/login',
                  })
                }
              })
            }
          });
        } else {
          console.log('获取用户登录态失败！' + res.errMsg)
        }
      },
      fail(e){
        console.log("fail",e)
      }
    });
  },
  onChange(e){
    console.log('e',e.detail)
    this.setData({
      EnterCode:e.detail
    });
  },
  searchInfo(){
    let _this = this;
    wx.navigateTo({
      url: '../detail2/index?EnterCode=' + _this.data.EnterCode,
    })
  },
  toCheck() {
    App.globalData.tab_bar_type = "check"
    if (App.globalData.userInfo.SName) {
      wx.navigateTo({
        url: '../check/index',
      })
    } else {
      wx.navigateTo({
        url: '../login2/login2',
      })
    }
  },
  toLogin(){
    App.globalData.tab_bar_type = "in"
    console.log('SName',App.globalData.userInfo.SName)
    if (App.globalData.userInfo.SName){
      wx.navigateTo({
        url: '../index/index',
      })
    }else{
      wx.navigateTo({
        url: '../login2/login2',
      })
    }
    
  },
  toDatePage(){
    App.globalData.tab_bar_type = "out"
    wx.navigateTo({
      url: '../date/index',
    })
  },
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  }
})