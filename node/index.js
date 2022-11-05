const http = require('http')
const axios = require('axios')
const url = require('url')
const sha1 = require('sha1')
const parseString = require('xml2js').parseString
const { getAv, addAv, delAv, searchAv } = require('./db')
const _ = require('lodash')

const state = {
  loginMap: {}
}

let getTokenStartTime
let expireSeconds
let accessToken
const getAccessToken = () => {
  if (Date.now() - getTokenStartTime < expireSeconds * 1000) {
    console.log('从缓存取token')
    return Promise.resolve(accessToken)
  }
  console.log('获取token')
  const appId = 'wxb39d255a0621cedc'
  const secret = '3605eb0e51b0afe46ff9caac64671521'
  // token 失效，需要重新获取
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appId}&secret=${secret}`
  return axios.get(url).then(res => {
    getTokenStartTime = Date.now()
    expireSeconds = res.data.expires_in
    accessToken = res.data.access_token
    return accessToken
  })
}

// const sendTemplateMessage = (reqUrl) => {
//   if (!accessToken) {
//     throw new Error('请先获取token，/api/getAccessToken')
//   }
//
//   const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${accessToken}`
//   const templateId = 'keRZcuEsnmNUVh6I2qd9isd2MOLM7LHAmry0RwURZ9k'
//
//   const params = getQuery(reqUrl)
//   console.log('send message params:\n', params)
//
//   return axios.post(url, {
//     access_token: accessToken,
//     touser: params.openId,
//     template_id: params.templateId || templateId,
//     form_id: params.formId,
//     page: params.page,
//     data: {
//       keyword1: {
//         value: params.value1
//       },
//       keyword2: {
//         value: params.value2
//       },
//       keyword3: {
//         value: params.value3
//       }
//     }
//     // emphasis_keyword: 'keyword1.DATA'
//   })
// }

const uri = {
  '/wx/checkstatus': function (query, bodyString) {
    const token = 'wxtoken'
    const { signature, timestamp, echostr, nonce } = query || {}
    const newLocalToken = [nonce, timestamp, token].sort().join('')
    const sha = sha1(newLocalToken)
    if (signature === sha) {
      bodyString ? handleMessage.call(this, bodyString, query) : this.end(echostr)
    } else {
      // 验证失败
      this.end('error')
    }
  },
  '/wx/accessToken': function () {
    this.end(getAccessToken())
  }
}

/**
 * 输入任意字符校验是否登录，未登录提示：请输入口令继续～，登录后输入字符查询
 * 0：帮助
 * 1：列出我的 app
 * 2：列出我的 卡
 * 3：新增/编辑覆盖信息，示例 3+建设银行+卡号+6236681540021874925
 * 4：删除，示例 4+建设银行+卡号
 * 5：退出登录
 */
async function getResponseText (text, { openid }) {
  // console.log('openid', openid, 'text', text)
  const help = `可以输入如下指令进行操作：\n\n✅ 输入任意字符查询账号卡信息\n❓ 输入 0 查看帮助\n📱 输入 1 查询我的账号信息\n🏦 输入 2 查询我的卡信息\n✒️ 输入 3+建设银行+卡号+123456 添加/覆盖信息\n❌ 输入 4+建设银行+卡号，删除一条信息\n😡 输入 5，退出登录口令`
  const input = text.trim()
  if (input === '小柠檬') {
    state.loginMap[openid] = true
    return `口令登录成功！${help}`
  }

  if (!state.loginMap[openid]) {
    return '请输入口令继续～'
  }

  let optText = ''
  let list = []
  // 格式化口令
  const [cmd2, title, name, number] = input.split('+')
  const cmd = Number(cmd2)
  if (cmd === 0) {
    return help
  } else if (cmd === 1) {
    optText = '查询账号信息成功!'
    list = await getAv(openid, 'app')
  } else if (cmd === 2) {
    optText = '查询卡信息成功!'
    list = await getAv(openid, 'card')
  } else if (cmd === 3) {
    const { obj, exist } = await addAv(openid, title, name, number)
    optText = exist ? '更新成功!' : '新增成功!'
    list = [obj]
  } else if (cmd === 4) {
    const res = await delAv(openid, title, name)
    return res === undefined ? '没有找到你要删除的数据～，输入 0 查看操作指引' : `删除成功了~ ，输入 0 查看操作指引`
  } else if (cmd === 5) {
    delete state.loginMap[openid]
    return `退出口令成功！，输入 0 查看操作指引`
  } else {
    // 模糊匹配
    optText = '查询成功！'
    list = await searchAv(openid, text)
  }

  if (!list.length) {
    return '没有查询到信息呢，看看是不是输错了~，输入 0 查看操作指引'
  }
  const data = _.groupBy(list, 'title')
  const listInfo = Object.keys(data).map(title => {
    const nameInfo = data[title].map(x => `${x.name}: <a href="${x.number}">${x.number}</a>`).join('\n')
    return `【${title}】\n${nameInfo}`
  }).join('\n\n')
  return `${optText}\n${listInfo}`
}

function handleMessage (bodyString, query) {
  parseString(Buffer.from(bodyString).toString('utf-8'), { explicitArray: false }, async (err, result) => {
    if (err) {
      // 打印错误信息
      console.log(err)
    } else {
      // 打印解析结果
      result = result.xml
      const toUser = result.ToUserName // 接收方微信
      const fromUser = result.FromUserName // 发送仿微信
      if (result.Event) {
        // 处理事件类型
        switch (result.Event) {
          case 'subscribe':
            // 关注公众号
            break
          default:
        }
      } else {
        // 处理消息类型
        switch (result.MsgType) {
          case 'text':
            // 处理文本消息
            this.end(`<xml>
  <ToUserName><![CDATA[${fromUser}]]></ToUserName>
  <FromUserName><![CDATA[${toUser}]]></FromUserName>
  <CreateTime>${result.CreateTime}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${await getResponseText(result.Content, query)}]]></Content>
</xml>`)
            break
          case 'image':
            // 处理图片消息
            break
          case 'voice':
            // 处理语音消息
            break
          case 'video':
            // 处理视频消息
            break
          case 'shortvideo':
            // 处理小视频消息
            break
          case 'location':
            // 处理发送地理位置
            break
          case 'link':
            // 处理点击链接消息
            break
          default:
            this.end('')
        }
      }
    }
  })
}

const server = http.createServer((req, res) => {
  // console.log(req.url)
  const { query } = url.parse(req.url, true)
  let body = ''
  req.on('data', function (chunk) {
    body += chunk
  })
  req.on('end', function () {
    // body = querystring.parse(body)
    // handleResponse(req, res, query, body)
    const path = req.url.split('?')[0]
    if (!uri[path]) {
      console.log(path, '没有匹配到方法...')
      return res.end('没有匹配到方法')
    }

    uri[path].call(res, query, body)
  })
})

server.listen(3001, () => {
  console.log('server is start at http://localhost:3001')
})
