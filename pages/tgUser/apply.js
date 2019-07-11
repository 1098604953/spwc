const app = getApp()
const WXAPI = require('../../wxapi/main')

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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    const _this = this
    WXAPI.userDetail(wx.getStorageSync('token')).then(res => {
      
      console.log(res.status)
      if (res.status === 200) {
        _this.setData({
          userDetail: res.data.user
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
   * 推广
   */
  bindSave: function (e) {
    WXAPI.addTempleMsgFormid({
      token: wx.getStorageSync('token'),
      type: 'form',
      formId: e.detail.formId
    })
    const name = e.detail.value.name
    const mobile = e.detail.value.mobile
    if (!name) {
      wx.showToast({
        title: '请输入真实姓名',
        icon: 'none'
      })
      return
    }
    if (!mobile) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return
    }
    WXAPI.fxApply(wx.getStorageSync('token'), name, mobile).then(res => {
      console.log(res.data.regUser)
      if (res.status != 200) {
        wx.showToast({
          title: res.msg,
          icon: 'none',
           duration: 2000
        })
        return
      }
      wx.showLoading({ 
        title: '注册成功 \r\n 用户名:' + res.data.regUser.username+'初始密码:111111',
      
      })
      wx.hideLoading({
          success: function () {
            wx.switchTab({
              url: "/pages/index/index"
            })

        }
      });
  
     
    })
  }
})