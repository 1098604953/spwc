const app = getApp()
const WXAPI = require('../../wxapi/main')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    uid: undefined,
   toUser:undefined,
    items: [
      { id: '1', value: '余额', checked: 'true' },
      { id: '2', value: '积分' },

    ],
    type: 1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


  radioChange: function (e) {
    var exchargeType = e.detail.value
    console.log('radio发生change事件，携带的value值为：', e.detail.value)
    this.setData({
      type: e.detail.value
    })
  },

  bindSave: function(e) {
    var that = this;
    var    amount = e.detail.value.amount;
    var  toUser = e.detail.value.toUser;
    if (amount == "") {
      wx.showModal({
        title: '错误',
        content: '请输入转账金额',
        showCancel: false
      })
      return
    }
    if (toUser == "") {
      wx.showModal({
        title: '错误',
        content: '请输入收款人用户名',
        showCancel: false
      })
      return
    }
 
    if (amount % 100 !=0){
      wx.showModal({
        title: '错误',
        content: '转换金额必须是100的倍数',
        showCancel: false
      })
      return
    }
    WXAPI.scoreTransfer(amount, this.data.type,toUser, wx.getStorageSync('token')).then(function(res) {
      console.log(res)
      // if (res.code == 700) {
      //   wx.showModal({
      //     title: '错误',
      //     content: '券号不正确',
      //     showCancel: false
      //   })
      //   return
      // }
      if (res.status == 200) {
        wx.showModal({
          title: '成功',
          content: '转账成功',
          showCancel: false,
          success: function(res) {
            if (res.confirm) {
              that.bindCancel();
            }
          }
        })
      } else {
        console.log("///////////" + res.data)
        wx.showModal({
          title: '错误',
          content: res.msg,
          showCancel: false
        })
      }
    })
  }
})