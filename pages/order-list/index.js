const wxpay = require('../../utils/pay.js')
const app = getApp()
const WXAPI = require('../../wxapi/main')
Page({
  data: {
    statusType: ["待付款", "待发货", "待收货", "待评价", "已完成"],
    hasRefund: false,
    currentType: 0,
    tabClass: ["", "", "", "", ""],
    curPage: 1,
    pageSize: 10,
    cateScrollTop: 0
  },
  statusTap: function(e) {
    const curType = e.currentTarget.dataset.index;
    this.data.currentType = curType
    console.log(e.currentTarget.dataset.index)
    this.setData({
      currentType: curType
    });
    this.onShow();
  },
  cancelOrderTap: function(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;
    wx.showModal({
      title: '确定要取消该订单吗？',
      content: '',
      success: function(res) {
        if (res.confirm) {
          WXAPI.orderClose(orderId, wx.getStorageSync('token')).then(function(res) {
            if (res.code == 0) {
              that.onShow();
            }
          })
        }
      }
    })
  },
  refundApply(e) {
    // 申请售后
    const orderId = e.currentTarget.dataset.id;
    const amount = e.currentTarget.dataset.amount;
    wx.navigateTo({
      url: "/pages/order/refundApply?id=" + orderId + "&amount=" + amount
    })
  },
  toPayTap: function(e) {
    const that = this;
    const orderId = e.currentTarget.dataset.id;

    let money = e.currentTarget.dataset.money;
    const needScore = e.currentTarget.dataset.score;
    WXAPI.userAmount(wx.getStorageSync('token')).then(function(res) {
      console.log(res.data.user.moneyMy)
      console.log(e.currentTarget.dataset.money)
      if (res.status == 200) {
        // 增加提示框
        if (res.data.user.moneyMy < money) {
          wx.showToast({
            title: '您的余额不足，无法支付',
            icon: 'none'
          })
          return;
        }
        let _msg = '订单金额: ' + money + ' 元'
        if (res.data.user.moneyMy > 0) {
          _msg += ',可用余额为 ' + res.data.user.moneyMy+ ' 元'
          if (money - res.data.user.moneyMy > 0) {
            _msg += ',仍需微信支付 ' + (money - res.data.user.moneyMy) + ' 元'
          }
        }
        if (needScore > 0) {
          _msg += ',并扣除 ' + money + ' 积分'
        }
        money = money - res.data.user.moneyMy
        wx.showModal({
          title: '请确认支付',
          content: _msg,
          confirmText: "确认支付",
          cancelText: "取消支付",
          success: function(res) {
            if (res.confirm) {
              that._toPayTap(orderId, money)
            } else {
              console.log('用户点击取消支付')
            }
          }
        });
      } else {
        wx.showModal({
          title: '错误',
          content: '无法获取用户资金信息',
          showCancel: false
        })
      }
    })
  },
  _toPayTap: function(orderId, money) {
    const _this = this
    if (money <= 0) {
      // 直接使用余额支付
      WXAPI.orderPay(orderId, wx.getStorageSync('token')).then(function(res) {
        _this.onShow();
      })
    } else {
      // wxpay.wxpay('order', money, orderId, "/pages/order-list/index");
    }
  },
  onLoad: function(options) {
    if (options && options.type) {
      if (options.type == 99) {
        this.setData({
          hasRefund: true,
          currentType: options.type
        });
      } else {
        this.setData({
          hasRefund: false,
          currentType: options.type
        });
      }
    }
  },
  onReady: function() {
    // 生命周期函数--监听页面初次渲染完成

  },
  getOrderStatistics: function() {
    var that = this;
    WXAPI.orderStatistics(wx.getStorageSync('token')).then(function(res) {
      if (res.code == 0) {
        var tabClass = that.data.tabClass;
        if (res.data.count_id_no_pay > 0) {
          tabClass[0] = "red-dot"
        } else {
          tabClass[0] = ""
        }
        if (res.data.count_id_no_transfer > 0) {
          tabClass[1] = "red-dot"
        } else {
          tabClass[1] = ""
        }
        if (res.data.count_id_no_confirm > 0) {
          tabClass[2] = "red-dot"
        } else {
          tabClass[2] = ""
        }
        if (res.data.count_id_no_reputation > 0) {
          tabClass[3] = "red-dot"
        } else {
          tabClass[3] = ""
        }
        if (res.data.count_id_success > 0) {
          //tabClass[4] = "red-dot"
        } else {
          //tabClass[4] = ""
        }

        that.setData({
          tabClass: tabClass,
        });
      }
    })
  },
  onShow: function() {
    // 获取订单列表
    var that = this;
    var postData = {
      token: wx.getStorageSync('token'),
      page: this.data.curPage,
      pageSize: this.data.pageSize
    };
    postData.hasRefund = that.data.hasRefund;
    if (!postData.hasRefund) {
      postData.status = that.data.currentType;
    }
    this.getOrderStatistics();
    WXAPI.orderList(postData).then(function(res) {
      console.log(res.data.userOrders);
      if (res.status == 200) {
        that.setData({
          orderList: res.data.userOrders,
          logisticsMap: {},
          goodsMap: {}
        });
      } else {
        that.setData({
          orderList: null,
          logisticsMap: {},
          goodsMap: {}
        });
      }
    })
  },
  onHide: function() {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function() {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function() {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function() {
    // 页面上拉触底事件的处理函数
    this.setData({
      curPage: this.data.curPage + 1
    });
  }



})