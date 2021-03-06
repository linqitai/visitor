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
    maxlengthIndentityNumber:18,
    form:{
      Name: "",
      Phone:"",
      Type: App.globalData.tab_bar_type
    },
    type: '',
    count:0,
    dataList:[],
    sex_array: ['男', '女'],
    reason_array: ['个人来访', '公务往来', '会议', '快递', '面试','其他'],
    number_array: ['1', '2', '3', '4', '5', '6','多于6人']
  },
  onShow: function () {
    // 刷新组件
    this.refreshView = this.selectComponent("#refreshView")
    // wx.setNavigationBarTitle({
    //   title: '预约审批'
    // })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: "#228B22" // 传递的颜色值
    })
    this.getUncheckList();
  },
  onLoad: function (options) {
    let _this = this;
    console.log(App.globalData.tab_bar_type, "App.globalData.tab_bar_type")
    _this.setData({
      active: 0,
      tab_bar: App.getTab_bar(App.globalData.tab_bar_type),
      type: App.globalData.tab_bar_type,
      'form.Type': App.globalData.tab_bar_type
    })
    console.log("history")
    console.log('type', _this.data.type)
    // _this.getUncheckList();
  },
  getUncheckList(){
    let _this = this;
    let prams = {
      Type: App.globalData.tab_bar_type,
      Phone: App.nullReturnEmpty(_this.data.form.Phone),
      Name: App.nullReturnEmpty(_this.data.form.Name),
      CheckStatus:0 //0 未审核 1 已审核 -1 审核拒绝
    }
    console.log('prams', prams)
    let url = "api/visitors/getListByNameOrPhone"
    App._get(url, prams, function (res) {
      let result = JSON.parse(res)
      console.log('result', result)
      if (result.code == 1) {
        if (result.count == 0) {
          App.showToast("暂无记录")
        }
        _this.setData({
          count: result.count,
          dataList: result.data
        })
      } else {
        console.log("msg", result.msg)
        App.showToast(result.msg);
      }
    })
  },
  bindStartDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.StartDate': e.detail.value
    });
  },
  bindEndDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value);
    this.setData({
      'form.EndDate': e.detail.value
    });
  },
  formSubmit(e){
    let _this = this;
    console.log('form', e.detail.value)
    _this.setData({
      form: e.detail.value
    });
    _this.setData({
      'form.Type': App.globalData.tab_bar_type
    });
    console.log('App.globalData.tab_bar_type', App.globalData.tab_bar_type)
    _this.getUncheckList();
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