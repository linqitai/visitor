let App = getApp();

Page({
  data: {
    // banner轮播组件属性
    indicatorDots: true, // 是否显示面板指示点	
    autoplay: true, // 是否自动切换
    interval: 3000, // 自动切换时间间隔
    duration: 800, // 滑动动画时长
    imgHeights: {}, // 图片的高度
    imgCurrent: {}, // 当前banne所在滑块指针
    test:'/pages/category/index?category_id=29',
    // 页面元素
    scrollTop: 0,
    top: '',
    left: '',
    windowWidth: '',
    windowHeight: '',
    maxlengthPhome: 11,
    maxlengthIdentityNumber:18,
    form:{
      Name: "",
      Sex: 0,
      Phone: "",
      IdentityNumber:"",
      Reason:0,
      Number:0,
      PlateNumber:"",
      Unit:"",
      Date:"",
      StartTime:"",
      EndTime: "",
      Remark:"",
      Checker:"",
      SNo:"",
      OpenId4In:""
    },
    sex_array: App.globalData.sex_array,
    reason_array: App.globalData.reason_array,
    number_array: App.globalData.number_array
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // App._get("api/visitors/testLink",{},function(res){
    //   console.log('res',res)
    // })
    console.log('App.globalData.userInfo',App.globalData.userInfo)
    if (App.globalData.access_token == "") {
      let d = {
        appid: App.globalData.appid,
        secret: App.globalData.secret,
        grant_type: "client_credential"
      }
      let url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + d.appid + "&secret=" + d.secret;
      wx.request({
        url: url,
        data: {},
        method: 'GET', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT  
        // header: {}, // 设置请求的 header  
        success: function (res) {
          console.log('res', res)
          App.globalData.access_token = res.data.access_token;
        }
      });
    }
  },
  onLoad: function (options) {
    let _this = this;
    console.log(App.globalData.tab_bar_type, "App.globalData.tab_bar_type")
    this.setData({
      active: 0,
      tab_bar: App.getTab_bar(App.globalData.tab_bar_type)
    })
    console.log('tab_bar',_this.data.tab_bar)
    this.setData({ 'form.Date': App.getDate(new Date().getTime() + 24 * 60 * 60 * 1000) })
    this.setData({ 'form.StartTime': '08:00' })
    this.setData({ 'form.EndTime': "17:00" })
  },
  formSubmit(e) {
    let _this = this;
    App.globalData.formId = e.detail.formId;
    console.log('form', e.detail.value)
    _this.setData({
      form: e.detail.value
    });
    _this.setData({
      'form.Checker': App.globalData.userInfo.SName,
      'form.SNo': App.globalData.userInfo.SNo,
      'form.OpenId4In': App.globalData.openid
    });
    console.log('form', _this.data.form)
    if (App.isNull(_this.data.form.Name)) {
      App.showToast("访客姓名不可为空"); return;
    }
    if (App.isNull(_this.data.form.Phone)) {
      App.showToast("联系电话不可为空"); return;
    }
    // if (App.isNull(_this.data.form.IdentityNumber)) {
    //   App.showToast("证件号不可为空"); return;
    // }
    App.showModel("提交后不得修改，您确定要提交此访客单吗？", function (e) {
      console.log('e',e);
      // 下面调用接口
      let params = {
        Name: _this.data.form.Name,
        Sex: _this.data.form.Sex,
        Phone: _this.data.form.Phone,
        IdentityNumber: _this.data.form.IdentityNumber,
        Reason: _this.data.form.Reason,
        Number: _this.data.form.Number,
        PlateNumber: _this.data.form.PlateNumber,
        Unit: _this.data.form.Unit,
        Date: _this.data.form.Date,
        StartTime: _this.data.form.StartTime,
        EndTime: _this.data.form.EndTime,
        Remark: _this.data.form.Remark,
        SNo: _this.data.form.SNo,
        OpenId4In: _this.data.form.OpenId4In,
        Checker: _this.data.form.Checker,
      }
      App._get("api/visitors/add4In", params, function (res) {
        console.log("res", res)
        let result = JSON.parse(res)
        if (result.code == 1) {
          App.showToast("数据提交成功");
          //在这里发送微信服务消息通知访客
          let openid = result.openid;
          console.log('openid',openid)
          if (openid != "") {
            let _access_token = App.globalData.access_token;
            let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
            console.log('result.ordercode', result.ordercode)
            let _jsonData = {
              access_token: _access_token,//有问题
              touser: openid,
              template_id: 'R8sYQm8vDdeXxtM_1xtp-ott5PtK125o9_IAibqpHrc',//预约结果通知
              form_id: App.globalData.formId,
              page: "pages/firstPage/firstPage",
              data: {
                "keyword1": { "value": _this.data.form.Name, "color": "#173177" },//预约对象
                "keyword2": { "value": _this.data.form.Date + " " + _this.data.form.StartTime, "color": "#173177" },//预约时间
                "keyword3": { "value": App.globalData.userInfo.SName, "color": "#173177" },//联系人
                "keyword4": { "value": App.globalData.userInfo.SMPhone, "color": "#173177" },//电话电话
                "keyword5": { "value": App.globalData.userInfo.SDDetailName, "color": "#173177" },//联系地址
                "keyword6": { "value": result.ordercode, "color": "#173177" }//预约码
              }
            }
            console.log('_jsonData', _jsonData)
            wx.request({
              url: url,
              data: _jsonData,
              method: 'POST',
              success: function (res) {
                console.log('消息发送成功', res)
              },
              fail: function (err) {
                console.log('request fail ', err);
              },
              complete: function (res) {
                console.log("request completed!", res);
              }
            })
          } else {
            App.showError("预约成功，但此访客尚未在此系统开通微信服务消息收发权限，请主动联系对方并把此次预约码（" + result.ordercode +"）告诉对方");
          }
          setTimeout(function(){
            wx.navigateTo({
              url: '../history/index',
            })
          },1000)
        } else if(result.code == 101){
          App.showModel(result.msg)
        } else {
          console.log("msg", result.msg)
          App.showToast(result.msg);
        }
      })
    })
  },
  bindStartTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.StartTime': e.detail.value
    });
  },
  bindEndTimeChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.EndTime': e.detail.value
    });
  },
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.Date':e.detail.value
    });
  },
  bindSexPickerChange(e){
    console.log('sex', e.detail.value)
    this.setData({
      'form.Sex': e.detail.value
    });
  },
  bindReasonPickerChange(e) {
    console.log('reason', e.detail.value)
    this.setData({
      'form.Reason': e.detail.value
    });
  },
  bindNumberPickerChange(e){
    console.log('Number', e.detail.value)
    console.log('detail', e.detail)
    console.log('e', e)
    this.setData({
      'form.Number': e.detail.value
    });
  },
  to_shopcart_view(){
    wx.navigateTo({
      url: "../flow/index"
    });
  },
  // 拖动不超过规定范围
  setTouchMove: function (e) {
    e.preventDefault();
    console.log("---------------- e.touches[0].clientX----------------8==" + e.touches[0].clientX)
    console.log("---------------- e.touches[0].clientX----------------8=======" + e.touches[0].clientY)
    if (e.touches[0].clientX < 650 && e.touches[0].clientY < 1110 && e.touches[0].clientX > 0 && e.touches[0].clientY > 0) {
      this.setData({
        left: e.touches[0].clientX,
        top: e.touches[0].clientY
      })
    }else{
      this.setData({
        left: 650,
        top: 1110
      })
    }
  },
  //触摸开始
  handletouchstart: function (event) {
    // console.log("触摸开始", event)
    this.refreshView.handletouchstart(event)
  },
  //触摸移动
  handletouchmove: function (event) {
    // console.log("触摸开始", event)
    this.refreshView.handletouchmove(event)
  },
  //触摸结束
  handletouchend: function (event) {
    // console.log("触摸结束")
    this.refreshView.handletouchend(event)
  },
  //触摸取消
  handletouchcancel: function (event) {
    // console.log("触摸取消")
    this.refreshView.handletouchcancel(event)
  },
  //页面滚动
  onPageScroll: function (event) {
    // console.log("页面滚动", event)
    this.refreshView.onPageScroll(event)
  },
  onPullDownRefresh: function () {
    console.log("onPullDownRefresh")
    setTimeout(() => { this.refreshView.stopPullRefresh() }, 2000)
    // 获取首页数据
    // this.getIndexData();
    // this.getCateData();
    // this.getGoodsData();
    // this.getBestGoodsData();
  },
  _pullState: function(e) {
    console.log(e,"_pullState")
  },
  scroll: function(t) {
    this.setData({
      indexSearch: t.detail.scrollTop
    }), t.detail.scrollTop > 300 ? this.setData({
      floorstatus: !0
    }) : this.setData({
      floorstatus: !1
    });
  }
});