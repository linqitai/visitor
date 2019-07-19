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

  },

  /**
   * 授权登录
   */
  authorLogin: function (e) {
    let _this = this;
    if (e.detail.errMsg !== 'getUserInfo:ok') {
      return false;
    }
    wx.showLoading({ title: "正在登录", mask: true });
    // 执行微信登录
    wx.login({
      success: function (res) {
        console.log('res', res)
        let prams = {
          code: res.code,
          user_info: e.detail.rawData,
          encrypted_data: e.detail.encryptedData,
          iv: e.detail.iv,
          signature: e.detail.signature
        }
        console.log('prams',prams)
        wx.hideLoading();
        let p = JSON.parse(prams.user_info);
        p.openid = App.globalData.openid;
        console.log('p',p)
        App._post_form('api/visitors/addWXUserInfo', p, function (res) {
          console.log('res',res)
          let result = JSON.parse(res)
          if(result.code==1){
            _this.navigateBack();
          }else{
            console.log('msg', result.msg)
          }
        });
        // _this.navigateBack();
          //openid: App.globalData.openid,
          // "{"nickName":"天道酬勤","gender":1,"language":"zh_CN","city":"温州","province":"浙江","country":"中国","avatarUrl":"https://wx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTJ3u8Rnrggn2thYlMQEhtmibIVdia2DJ0s3K7qtUdqyLTXCOglInq04Uyg8tMiaRiaUxW0L497lwYS6Ew/132"}"
        // 发送用户信息
        // App._post_form('user/login', prams, function (result) {
        //     // 记录token user_id
        //     wx.setStorageSync('token', result.data.token);
        //     wx.setStorageSync('user_id', result.data.user_id);
        //     // App.getUserDetail()
        //     // 跳转回原页面
        //     console.log(wx.getStorageSync('currentPage').route,"currentPage");
        //     let route = wx.getStorageSync('currentPage').route;
        //     if (route == 'pages/index/index') {
        //       wx.redirectTo({
        //         url: '../index/index',
        //       })
        //     } else {
        //       _this.navigateBack();
        //     }
        // });
      }
    });
  },
  /**
     * 获取当前用户信息
     */
  // getUserDetail: function () {
  //   let _this = this;
  //   App._get('user.index/detail', {}, function (result) {
  //     App.globalData.userInfo = result.data.userInfo
  //     App.globalData.orderCount = result.data.orderCount
  //     console.log(App.globalData.userInfo, "App.globalData.userInfo")
  //     if (App.globalData.userInfo.store_cert == 1) {
  //       App.globalData.tab_bar[2].is_show = true
  //     }
  //   });
  // },
  /**
   * 授权成功 跳转回原页面
   */
  navigateBack: function () {
    wx.navigateBack();
    // let currentPage = wx.getStorageSync('currentPage');
    // wx.redirectTo({
    //   url: '/' + currentPage.route + '?' + App.urlEncode(currentPage.options)
    // });
  },

})