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
    maxlengthPhone: 11,
    maxlengthSName: 10,
    maxlengthIndentityNumber:18,
    form:{
      SNo:"",
      SSex:"0",
      SName: "",
      SMPhone:"",
      SCarNo:"",
    },
    visible1:false,
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
    wx.setNavigationBarTitle({
      title: '信息录入'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff', // 必写项
      backgroundColor: "#228B22" // 传递的颜色值
    })
  },
  onLoad: function (options) {
    let _this = this;
    //console.log('onLoad');
    let params = {
      SDId: App.globalData.userInfo.SDId
    }
    App._get('api/visitors/getStaffList', params, function (res) {
      //console.log('getStaffList', res);
      let result = JSON.parse(res);
      _this.setData({ dataList: result.data });
    })
  },
  handleOpen1() {
    this.setData({
      visible1: true
    });
  },
  handleClose1() {
    this.setData({
      visible1: false
    });
  },
  addStaffBtn(){
    let _this = this;
    //console.log("addStaffBtn");
    //console.log("form",_this.data.form);
  },
  bindSexPickerChange(e) {
    //console.log('sex', e.detail.value)
    this.setData({
      'form.SSex': e.detail.value
    });
  },
  deleteBtn(event){
    let _this = this;
    console.log("event", event.currentTarget.dataset.id);
    let id = event.currentTarget.dataset.id;
    let name = event.currentTarget.dataset.name;
    App.showModel(`您确定要删除【${name}】吗？`,function(){
      console.log("delete");
      let params = {
        Id: id
      }
      App._post_form("api/visitors/deleteStaffInfo", params, function (res) {
        let result = JSON.parse(res);
        console.log('result', result);
        if (result.code == 0) {
          App.showError('删除失败');
        } else {
          App.toast('删除成功');
          _this.onLoad();
        }
      })
    });
  },
  formSubmit(e){
    let _this = this;
    _this.setData({
      form: e.detail.value
    });
    if (_this.data.form.SNo.length > 11) {
      App.showError("请填写少于11个字的编号"); return;
    }
    if (_this.data.form.SName.length > 20 || _this.data.form.SName.length < 2) {
      App.showError("请填写2~20个字的姓名"); return;
    }
    if (_this.data.form.SCarNo.length > 10) {
      App.showError("请填写少于10个字的车牌号"); return;
    }
    if (!(/^(1[3-9])\d{9}$/).test(_this.data.form.SMPhone)){
      App.showError("请填写合法手机号");return;
    }
    this.setData({
      'form.SDId': App.globalData.userInfo.SDId,
      'form.SDDetailName': App.globalData.userInfo.SDDetailName
    });
    //console.log('form', _this.data.form)
    App._post_form("api/visitors/addStaff", _this.data.form, function (res) {
      let result = JSON.parse(res);
      console.log('result', result);
      if (result.code==0){
        App.showError(result.msg);
      }else{
        App.toast("添加成功");
        _this.onLoad()
      }
    })
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