// 小程序开发api接口工具包，https://github.com/gooking/wxapi
const CONFIG = require('./config.js')
const API_BASE_URL = 'https://api.it120.cc'

const LOCALHOST_URL ='http://192.168.2.177:8080'
const request = (url, needSubDomain, method, data) => {
  let _url = API_BASE_URL + (needSubDomain ? '/' + CONFIG.subDomain : '') + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request) {
        resolve(request.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}



const request1 = (url, needSubDomain, method, data) => {
  let _url = LOCALHOST_URL + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success(request1) {
        resolve(request1.data)
      },
      fail(error) {
        reject(error)
      },
      complete(aaa) {
        // 加载完成
      }
    })
  })
}

/**
 * 小程序的promise没有finally方法，自己扩展下
 */
Promise.prototype.finally = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}

module.exports = {
  request,
  queryMobileLocation: (data) => {
    return request('/common/mobile-segment/location', false, 'get', data)
  },
  queryConfigBatch: (keys) => {
    return request('/config/values', true, 'get', { keys })
  },
  scoreRules: (data) => {
    return request('/score/send/rule', true, 'post', data)
  },
  scoreSign: (token) => {
    return request('/score/sign', true, 'post', {
      token
    })
  },
  scoreSignLogs: (data) => {
    return request('/score/sign/logs', true, 'post', data)
  },
  scoreTodaySignedInfo: (token) => {
    return request('/score/today-signed', true, 'get', {
      token
    })
  },
  scoreExchange: (amount, type,token) => {
    return request1('/tUserScoreChange/ScoreExchange', true, 'post', {
      amount,
      type,
      token
    })
  },
  scoreTransfer: (amount,type, toUser, token) => {
    return request1('/tUserScoreChange/scoreTransfer', true, 'post', {
      amount,
      type,
      toUser,
      token
    })
  },
  scoreLogs: (data) => {
    return request('/score/logs', true, 'post', data)
  },
  shareGroupGetScore: (referrer, encryptedData, iv) => {
    return request('/score/share/wxa/group', true, 'post', {
      referrer,
      encryptedData,
      iv
    })
  },
  kanjiaList: (data) => {
    return request('/shop/goods/kanjia/list', true, 'post', data)
  },
  kanjiaSet: (goodsId) => {
    return request('/shop/goods/kanjia/set', true, 'get', { goodsId })
  },
  kanjiaJoin: (kjid, token) => {
    return request('/shop/goods/kanjia/join', true, 'post', {
      kjid,
      token
    })
  },
  kanjiaDetail: (kjid, joiner) => {
    return request('/shop/goods/kanjia/info', true, 'get', {
      kjid,
      joiner
    })
  },
  kanjiaHelp: (kjid, joiner, token, remark) => {
    return request('/shop/goods/kanjia/help', true, 'post', {
      kjid,
      joinerUser: joiner,
      token,
      remark
    })
  },
  kanjiaHelpDetail: (kjid, joiner, token) => {
    return request('/shop/goods/kanjia/myHelp', true, 'get', {
      kjid,
      joinerUser: joiner,
      token
    })
  },
  checkToken: (token) => {
    return request('/user/check-token', true, 'get', {
      token
    })
  },
  addTempleMsgFormid: (data) => {
    return request1('/template-msg/wxa/formId', true, 'post', data)
  },
  sendTempleMsg: (data) => {
    return request('/template-msg/put', true, 'post', data)
  },
  wxpay: (data) => {
    return request('/pay/wx/wxapp', true, 'post', data)
  },
  alipay: (data) => {
    return request('/pay/alipay/semiAutomatic/payurl', true, 'post', data)
  },
  login: (code) => {
    return request1('/wxlogin', true, 'post', {
      code
    })
  },
  register: (data) => {
    return request('/user/wxapp/register/complex', true, 'post', data)
  },
  banners: () => {
    return request('/banner/list', true, 'get')
  },
  goodsCategory: () => {
    return request1('/tGoodscategory/all', true, 'get')
  },
  goods: (data) => {
    return request1('/tGoods/index/goodsList', true, 'get', data)
  },
  goodsDetail: (id) => {
    return request1('/tGoods/goodsdetails', true, 'get', {
      id
    })
  },
  goodsPrice: (data) => {
    return request('/shop/goods/price', true, 'post', data)
  },
  goodsReputation: (data) => {
    return request('/shop/goods/reputation', true, 'post', data)
  },
  coupons: (data) => {
    return request('/discounts/coupons', true, 'get', data)
  },
  couponDetail: (id) => {
    return request('/discounts/detail', true, 'get', {
      id
    })
  },
  myCoupons: (data) => {
    return request('/discounts/my', true, 'get', data)
  },
  fetchCoupons: (data) => {
    return request('/discounts/fetch', true, 'post', data)
  },
  noticeList: (data) => {
    return request1('/tArticle/index', true, 'get', data)
  },
  noticeDetail: (id) => {
    return request1('/notice/detail', true, 'get', {
      id
    })
  },
  addAddress: (data) => {
    return request('/user/shipping-address/add', true, 'post', data)
  },
  updateAddress: (data) => {
    return request('/user/shipping-address/update', true, 'post', data)
  },
  deleteAddress: (id, token) => {
    return request('/user/shipping-address/delete', true, 'post', {
      id,
      token
    })
  },
  queryAddress: (token) => {
    return request('/user/shipping-address/list', true, 'get', {
      token
    })
  },
  defaultAddress: (token) => {
    return request1('/tUser/shipping-address/default', true, 'get', {
      token
    })
  },
  addressDetail: (id, token) => {
    return request('/user/shipping-address/detail', true, 'get', {
      id,
      token
    })
  },
  pingtuanSet: (goodsId) => {
    return request('/shop/goods/pingtuan/set', true, 'get', {
      goodsId
    })
  },
  pingtuanOpen: (goodsId, token) => {
    return request('/shop/goods/pingtuan/open', true, 'post', {
      goodsId,
      token
    })
  },
  pingtuanList: (goodsId) => {
    return request('/shop/goods/pingtuan/list', true, 'get', {
      goodsId
    })
  },
  videoDetail: (videoId) => {
    return request('/media/video/detail', true, 'get', {
      videoId
    })
  },
  bindMobile: (data) => {
    return request('/user/wxapp/bindMobile', true, 'post', data)
  },
  userDetail: (token) => {
    return request1('/tUser/detail', true, 'get', {
      token
    })
  },
  userAmount: (token) => {
    return request1('/tUser/amount', true, 'get', {
      token
    })
  },
  tgRegUser: (token, name, mobile) => {
    return request1('/tUser/tgRegUser', true, 'post', { token, name, mobile })
  },
  orderCreate: (data) => {
    return request1('/tOrder/create', true, 'post', data)
  },
  orderList: (data) => {
    return request1('/tOrder/list', true, 'post', data)
  },
  orderDetail: (id, token) => {
    return request1('/tOrder/detail', true, 'get', {
      id,
      token
    })
  },
  orderDelivery: (orderId, token) => {
    return request('/order/delivery', true, 'post', {
      orderId,
      token
    })
  },
  orderReputation: (data) => {
    return request('/order/reputation', true, 'post', data)
  },
  orderClose: (orderId, token) => {
    return request('/order/close', true, 'post', {
      orderId,
      token
    })
  },
  orderPay: (orderId, token) => {
    return request1('/tOrder/pay', true, 'post', {
      orderId,
      token
    })
  },
  orderStatistics: (token) => {
    return request('/order/statistics', true, 'get', {
      token
    })
  },
  withDrawApply: (money, token) => {
    return request('/user/withDraw/apply', true, 'post', {
      money,
      token
    })
  },
  province: () => {
    return request1('/tAddress/province', false, 'get')
  },
  nextRegion: (pid) => {
    return request('/common/region/v2/child', false, 'get', {
      pid
    })
  },
  cashLogs: (data) => {
    return request('/user/cashLog', true, 'post', data)
  },
  rechargeSendRules: () => {
    return request('/user/recharge/send/rule', true, 'get')
  },
  payBillDiscounts: () => {
    return request('/payBill/discounts', true, 'get')
  },
  payBill: (data) => {
    return request('/payBill/pay', true, 'post', data)
  },
  vipLevel: () => {
    return request('/config/vipLevel', true, 'get')
  },
  fxApply: (token, name, mobile) => {
    return request1('/tApply/fxRegister', true, 'post', { token, name, mobile })
  },

  fxApplyProgress: (token) => {
    return request('/saleDistribution/apply/progress', true, 'get', { token })
  },
  fxMembers: (data) => {
    return request('/saleDistribution/members', true, 'post', data)
  },
  fxCommisionLog: (data) => {
    return request('/saleDistribution/commision/log', true, 'post', data)
  },
  //推广二维码
  wxaQrcode: (data) => {
    return request('/qrcode/wxa/unlimit', true, 'post', data)
  },
  uploadFile: (token, tempFilePath) => {
    const uploadUrl = API_BASE_URL + '/' + CONFIG.subDomain + '/dfs/upload/file'
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: uploadUrl,
        filePath: tempFilePath,
        name: 'upfile',
        formData: {
          'token': token
        },
        success(res) {
          resolve(JSON.parse(res.data))
        },
        fail(error) {
          reject(error)
        },
        complete(aaa) {
          // 加载完成
        }
      })
    })
  },
  refundApply: (token, orderId, type, logisticsStatus, reason, amount, remark, pic) => {
    return request('/order/refundApply/apply', true, 'post', {
      token,
      orderId,
      type,
      logisticsStatus,
      reason,
      amount,
      remark,
      pic
    })
  },
  refundApplyDetail: (token, orderId) => {
    return request('/order/refundApply/info', true, 'get', {
      token,
      orderId
    })
  },
  refundApplyCancel: (token, orderId) => {
    return request('/order/refundApply/cancel', true, 'post', {
      token,
      orderId
    })
  },
  cmsCategories: () => {
    return request('/cms/category/list', true, 'get', {})
  },
  cmsArticles: (data) => {
    return request('/cms/news/list', true, 'post', data)
  },
  cmsArticleDetail: (id) => {
    return request('/cms/news/detail', true, 'get', {
      id
    })
  },
}