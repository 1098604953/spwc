const app = getApp()
const WXAPI = require('../../wxapi/main')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    balance: 0.00,
    // freeze: 0,
    score: 0,
    score_sign_continuous: 0,
    cashlogs: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    const token = wx.getStorageSync('token')
    if (!token) {
      app.goLoginPageTimeOut()
      return
    }
    WXAPI.userAmount(token).then(function (res) {
      //此处尚未统计累计消费
      console.log(res)
      if (res.status == 700) {
        wx.showToast({
          title: '当前账户存在异常',
          icon: 'none'
        })
        return
      }
      if (res.status == 2000) {
        app.goLoginPageTimeOut()
        return
      }
      if (res.status == 200) {
        _this.setData({
          balance: res.data.user.moneyMy,
          totleConsumed: 0.0,
          score: res.data.user.monryScore
        });
      }
    })
    // 读取资金明细
    WXAPI.cashLogs({
      token: token,
      page:1,
      pageSize:50
    }).then(res => {
      if (res.code == 0) {
        _this.setData({
          cashlogs: res.data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

/**
 * 充值
 */
  recharge: function (e) {
    // WXAPI.addTempleMsgFormid({
    //   token: wx.getStorageSync('token'),
    //   type: 'form',
    //   formId: e.detail.formId
    // })
    wx.navigateTo({
      url: "/pages/recharge/index"
    })
  },
  withdraw: function (e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    wx.navigateTo({
      url: "/pages/withdraw/index"
    })
  }
})