export const WAIT_SIGN = 'waitSign'

export const STATUS = {
  'waitSign': {
    text: '待签署',
    btnText: '签署承诺',
    noticeFromMe: '您的承诺书还未被签署，发给Ta吧～'
  },
  'refuse': {
    text: '拒绝签署',
    btnText: '重新发起',
    noticeFromTarget: '这封承诺书已经被拒签了，拒绝签署人是'
  },
  'sign': {
    text: '已签署'
  },
  'waitComplete': {
    text: '待兑现',
    btnText: '兑现承诺'
  },
  'waitConfirmComplete': {
    text: '待确认兑现',
    btnText: '确认已兑现',
    noticeFromTarget: '您已兑现了承诺，等待对方确认哦～',
    noticeFromMe: '对方已兑现了承诺，请您确认～'
  },
  'complete': {
    text: '已兑现'
  }
}
