const WXAPI = require('../../wxapi/main')
const CONFIG = require('../../config.js')
//获取应用实例
var app = getApp()
Page({
  data: {
    inputShowed: false, // 是否显示搜索框
    inputVal: "", // 搜索框内容
    category_box_width: 750, //分类总宽度
    goodsRecommend: [], // 推荐商品
    kanjiaList: [], //砍价商品列表
    pingtuanList: [], //拼团商品列表
    kanjiaGoodsMap: {}, //砍价商品列表

    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    loadingHidden: false, // loading
    userInfo: {},
    swiperCurrent: 0,
    selectCurrent: 0,
    categories: [],
    activeCategoryId: 0,
    goods: [],
    
    scrollTop: 0,
    loadingMoreHidden: true,

    coupons: [],
    append:true,

    curPage: 1,
    pageSize: 10,
    cateScrollTop: 0
  },

  tabClick: function(e) {
    let offset = e.currentTarget.offsetLeft;
    if (offset > 150) {
      offset = offset - 150
    } else {
      offset = 0;
    }
    console.log(e.currentTarget.id +"    console.log(e.currentTarget.id)")
    this.setData({
      activeCategoryId: e.currentTarget.id,
      curPage: 1,
      cateScrollTop: offset
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  //事件处理函数
  swiperchange: function(e) {
    //console.log(e.detail.current)
    this.setData({
      swiperCurrent: e.detail.current
    })
  },
  toDetailsTap: function(e) {
    wx.navigateTo({
      url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
    })
  },
  tapBanner: function(e) {
    if (e.currentTarget.dataset.id != 0) {
      wx.navigateTo({
        url: "/pages/goods-details/index?id=" + e.currentTarget.dataset.id
      })
    }
  },
  bindTypeTap: function(e) {
    this.setData({
      selectCurrent: e.index
    })
  },
  onLoad: function(e) {   
    wx.showShareMenu({
      withShareTicket: true
    }) 
    const that = this
    if (e && e.scene) {
      const scene = decodeURIComponent(e.scene)
      if (scene) {        
        wx.setStorageSync('referrer', scene.substring(11))
      }
    }
    wx.setNavigationBarTitle({
      title: wx.getStorageSync('mallName')
    })
    /**
     * 示例：
     * 调用接口封装方法
     */
    WXAPI.banners({
    }).then(function(res) {
        that.setData({
          banners: res.data
        });
    
   })
  
    WXAPI.goodsCategory().then(function(res) {
      let categories = [];
      if (res.status == 200) {
        categories = categories.concat(res.data.categories)
      }
      const _n = Math.ceil(categories.length / 2)
      // const _n = Math.ceil(categories.length)
      that.setData({
        categories: categories,
        category_box_width: 150 * _n,
        activeCategoryId: 0,
        curPage: 1
      });
      that.getGoodsList(0);
    })
    WXAPI.goods({
      // recommendStatus: 1
    }).then(res => {
      console.log(res.data.goodsList)
      console.log(res.status)
      if (res.status == 200){
        that.setData({
          goodsRecommend: res.data
        })
      }      
    })
    that.getCoupons()
    that.getNotice()
    that.kanjiaGoods()
    that.pingtuanGoods()
  },
  onPageScroll(e) {
    let scrollTop = this.data.scrollTop
    this.setData({
      scrollTop: e.scrollTop
    })
  },
  getGoodsList: function(categoryId, append) {
    if (categoryId == 0) {
      categoryId = "";
    }
    var that = this;
    wx.showLoading({
      "mask": true
    })
    WXAPI.goods({
      categoryId: categoryId,
      nameLike: that.data.inputVal,
      page: this.data.curPage,
      pageSize: this.data.pageSize
    }).then(function(res) {
    
      wx.hideLoading()
      if (res.status == 404 ) {
        let newData = {
          loadingMoreHidden: false
        }
        append = false;
        if (!append) {
         
          newData.goods = []
        }
        // that.setData(newData);
        that.setData({
          goods: goods,
       

        });
        return
      }
      let goods = [];
      if (append) {
        goods = that.data.goods
      }
      for (var i = 0; i < res.data.goodsList.length; i++) {
        goods.push(res.data.goodsList[i]);
      }
      that.setData({
        goods: goods,
        loadingMoreHidden: false,
        
      });
    })
  },
  getCoupons: function() {
    var that = this;
    WXAPI.coupons().then(function (res) {
      if (res.code == 0) {
        that.setData({
          coupons: res.data
        });
      }
    })
  },
  onShareAppMessage: function() {    
    return {
      title: '"' + wx.getStorageSync('mallName') + '" ' + CONFIG.shareProfile,
      path: '/pages/index/index?inviter_id=' + wx.getStorageSync('uid')
    }
  },
  getNotice: function() {
    var that = this;
    WXAPI.noticeList({pageSize: 5}).then(function (res) {
      console.log(res.data.artis + "/res")
      console.log(res.status + "/res.data")
      if (res.status == 200) {
        that.setData({
          noticeList: res.data.artis
        });
      }
    })
  },
  toSearch: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId);
  },
  onReachBottom: function() {
    this.setData({
      curPage: this.data.curPage + 1
    });
    this.getGoodsList(this.data.activeCategoryId, true)
  },
  onPullDownRefresh: function() {
    this.setData({
      curPage: 1
    });
    this.getGoodsList(this.data.activeCategoryId)
    wx.stopPullDownRefresh()
  },
  // 以下为搜索框事件
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  // 以下为砍价业务
  kanjiaGoods(){
    const _this = this
    WXAPI.kanjiaList().then(function (res) {
      if (res.code == 0) {
        _this.setData({
          kanjiaList: res.data.result,
          kanjiaGoodsMap: res.data.goodsMap
        })
      }
    })
  },
  goCoupons: function (e) {
    wx.navigateTo({
      url: "/pages/coupons/index"
    })
  },
  pingtuanGoods(){ // 获取团购商品列表
    const _this = this
    WXAPI.goods({
      pingtuan: true
    }).then(res => {
      if (res.code === 0) {
        _this.setData({
          pingtuanList: res.data
        })
      }
    })
  }
})