export const WAIT_SIGN = 'waitSign'
export const WAIT_SIGN_CONFIRM = 'waitSignConfirm'
export const SIGN = 'sign'
export const WAIT_COMPLETE = 'waitComplete'
export const WAIT_COMPLETE_CONFIRM = 'waitConfirmComplete'
export const COMPLETE = 'complete'
export const TAB_INDEX = 'tab_index'

export const STATUS = {
  'waitSign': {
    text: '待签署',
    btnText: '签署承诺',
    btnTextSelf: '转发给Ta',
    noticeFromMe: '您的承诺书还未被签署，发给Ta吧～',
    style: ''
  },
  'waitSignConfirm': {
    text: '待确认签署',
    btnTextSelf: '确认是Ta',
    btnTextSelfSecond: '不是Ta',
    noticeFromMe: '您的承诺书已被Ta签署，请确认～',
    noticeFromTarget: '该承诺书已被签署，等待甲方确认～',
    noticeOther: '这是a向b发起的承诺，天地为证，日月可鉴～',
    style: 'primary'
  },
  'sign': {
    text: '已签署',
    style: 'success',
    btnText: '回到首页',
    noticeOther: '这是a向b发起的承诺，天地为证，日月可鉴～'
  },
  'waitComplete': {
    text: '待兑现',
    btnText: '兑现承诺',
    style: 'primary',
    noticeFromMe: '您的承诺书已被Ta签署，等待Ta兑现承诺～',
    noticeOther: '这是a向b发起的承诺，天地为证，日月可鉴～'
  },
  'waitConfirmComplete': {
    text: '待确认兑现',
    btnText: '确认已兑现',
    noticeFromTarget: '您已兑现了承诺，等待对方确认哦～',
    noticeFromMe: '对方已兑现了承诺，请您确认～',
    noticeOther: '这是a向b发起的承诺，天地为证，日月可鉴～',
    style: 'primary'
  },
  'complete': {
    text: '已兑现',
    style: 'success',
    btnText: '回到首页',
    noticeOther: '这是a向b发起的承诺，天地为证，日月可鉴～'
  }
}
