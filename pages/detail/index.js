let App = getApp();

var QRCode = require('../../utils/weapp-qrcode.js')
import rpx2px from '../../utils/rpx2px.js'

var qrcode;

// 300rpx 在6s上为 150px
const qrcodeWidth = rpx2px(500)

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
    Type:"",
    Id:"",
    CreateTime: "",
    Name: "",
    Sex: "",
    Phone: "",
    IdentityNumber: "",
    Reason: "",
    Number: "",
    PlateNumber: "",
    Unit: "",
    DateTime: "",
    Remark: "",
    InvitorName: "",
    InvitorDep: "",
    CheckStatus: "",
    Checker: "",
    CheckDate: "",
    EnterCode: "",
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
      Remark:""
    },
    qrcodeWidth: qrcodeWidth,
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // App._get("api/visitors/testLink",{},function(res){
    //   console.log('res',res)
    // })
  },
  onLoad: function (options) {
    let _this = this;
    console.log('item.CreateTime', options.CreateTime);
    console.log('item.Name', options.Name);
    this.setData({
      Type: App.globalData.tab_bar_type,
      active: 1,
      Id: options.Id,
      CreateTime: options.CreateTime,
      Name: options.Name,
      Sex: App.globalData.sex_array[options.Sex],
      Phone: options.Phone,
      IdentityNumber: options.IdentityNumber,
      Reason: App.globalData.reason_array[options.Reason],
      Number: App.globalData.number_array[options.Number],
      PlateNumber: options.PlateNumber,
      Unit: options.Unit,
      DateTime: options.DateTime,
      Remark: options.Remark,
      InvitorName: options.InvitorName,
      InvitorDep: options.InvitorDep,
      CheckStatus: options.CheckStatus,
      Checker: options.Checker,
      CheckDate: options.CheckDate,
      Date: options.Date,
      StartTime: options.StartTime,
      EndTime: options.EndTime,
      Remark: (options.Remark == 'null' || options.Remark == null) ? "--" : options.Remark,
      SName: options.SName,
      SMPhone: (options.SMPhone == 'null' || options.SMPhone == null) ? "--" : options.SMPhone,
      SDDetailName: options.SDDetailName,
      EnterCode: (options.EnterCode == 'null' || options.EnterCode == null) ? "--" : options.EnterCode
    })
    console.log("data:",this.data)
    // this.setData({ 'form.Date': App.getDate(new Date().getTime()) })
    // this.setData({ 'form.StartTime': App.getHM(new Date().getTime()) })
    // this.setData({ 'form.EndTime': "17:00" })

    qrcode = new QRCode('canvas', {
      usingIn: this,
      // text: "https://github.com/tomfriwel/weapp-qrcode",
      image: '/images/logo.png',
      width: qrcodeWidth,
      height: qrcodeWidth,
      // width: 150,
      // height: 150,
      colorDark: "#1CA4FC",
      colorLight: "white",
      correctLevel: QRCode.CorrectLevel.H,
    });

    // 生成图片，绘制完成后调用回调
    qrcode.makeCode(_this.data.EnterCode)
    if (_this.data.CheckStatus=='0'&&_this.data.Type=='check'){
      if (App.globalData.access_token==""){
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
      
    }
  },
  // 长按保存
  save: function () {
    console.log('save')
    wx.showActionSheet({
      itemList: ['保存图片'],
      success: function (res) {
        console.log(res.tapIndex)
        if (res.tapIndex == 0) {
          qrcode.exportImage(function (path) {
            wx.saveImageToPhotosAlbum({
              filePath: path
            })
          })
        }
      }
    })
  },

  passSubmit(e){
    let _this = this;
    console.log('e', e);
    App.globalData.formId = e.detail.formId;
    let _access_token = App.globalData.access_token;
    let url = 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=' + _access_token;
    let _jsonData = {
        access_token: _access_token,
        touser: App.globalData.openid,
        template_id: '-1RkZaEQZ2YKukTI6wQ3Q9H0_M9Azp5-Nhy9hdWfMhQ',
        form_id: e.detail.formId,
        page: "pages/index/index",
        data: {
          "keyword1": { "value": "测试数据一", "color": "#173177" },
          "keyword2": { "value": "测试数据二", "color": "#173177" },
          "keyword3": { "value": "测试数据三", "color": "#173177" },
          "keyword4": { "value": "测试数据四", "color": "#173177" },
        }
      }
    wx.request({
      url: url,
      data: _jsonData,
      method: method,
      success: function (res) {
        console.log(res)
      },
      fail: function (err) {
        console.log('request fail ', err);
      },
      complete: function (res) {
        console.log("request completed!");
      }
    })

    // App.showModel("审核后不得修改，您决定好了吗？", function (e) {
    //   console.log('e', e);
    //   console.log('e', e.confirm);
    //   if(e.confirm){
    //     console.log("审核通过");
    //     let prams = {
    //       Id: _this.data.Id,
    //       CheckStatus: "1",// 1通过，-1拒绝
    //       Checker: App.globalData.userInfo.SName
    //     }
    //     console.log('prams', prams)
    //     // 下面调用接口
    //     App._post_form("api/visitors/check", prams, function (res) {
    //       let result = JSON.parse(res)
    //       console.log("result", result)
    //       if (result.code == 1) {
    //         App.showToast("操作成功");
    //         setTimeout(function () {
    //           wx.navigateTo({
    //             url: "../checked/index"
    //           });
    //         }, 1000)
    //       } else {
    //         App.showToast("操作失败");
    //       }
    //     })
    //   }
    // })
  },
  refuseSubmit(){
    let _this = this;
    App.showModel("审核后不得修改，您决定好了吗？", function (e) {
      console.log('e', e);
      console.log('e', e.confirm);
      if (e.confirm) {
        console.log("审核拒绝");
        let prams = {
          Id: _this.data.Id,
          CheckStatus: "-1",// 1通过，-1拒绝
          Checker: App.globalData.userInfo.SName
        }
        console.log('prams', prams)
        // 下面调用接口
        App._post_form("api/visitors/check", prams, function (res) {
          let result = JSON.parse(res)
          console.log("result", result)
          if (result.code == 1) {
            App.showToast("操作成功");
            setTimeout(function () {
              wx.navigateTo({
                url: "../checked/index"
              });
            }, 1000)
          } else {
            App.showToast("操作失败");
          }
        })
      }
    })
  },
  nullToLine: function (value) {
    if (value == "" || value == null) {
      return "--";
    }
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
    console.log('number', e.detail.value)
    console.log('detail', e.detail)
    console.log('e', e)
    this.setData({
      'form.number': e.detail.value
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