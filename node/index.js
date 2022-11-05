const http = require('http')
const axios = require('axios')
const url = require('url')
const sha1 = require('sha1')
const parseString = require('xml2js').parseString
const { getAv } = require('./db')

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

const sendTemplateMessage = (reqUrl) => {
  if (!accessToken) {
    throw new Error('请先获取token，/api/getAccessToken')
  }

  const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token=${accessToken}`
  const templateId = 'keRZcuEsnmNUVh6I2qd9isd2MOLM7LHAmry0RwURZ9k'

  const params = getQuery(reqUrl)
  console.log('send message params:\n', params)

  return axios.post(url, {
    access_token: accessToken,
    touser: params.openId,
    template_id: params.templateId || templateId,
    form_id: params.formId,
    page: params.page,
    data: {
      keyword1: {
        value: params.value1
      },
      keyword2: {
        value: params.value2
      },
      keyword3: {
        value: params.value3
      }
    }
    // emphasis_keyword: 'keyword1.DATA'
  })
}

const uri = {
  '/wx/checkstatus': function (query, bodyString) {
    const token = 'wxtoken'
    const { signature, timestamp, echostr, nonce } = query || {}
    const newLocalToken = [nonce, timestamp, token].sort().join('')
    const sha = sha1(newLocalToken)
    if (signature === sha) {
      bodyString ? handleMessage.call(this, bodyString) : this.end(echostr)
    } else {
      //验证失败
      this.end('error')
    }
  },
  '/wx/accessToken': function () {
    this.end(getAccessToken())
  }
}

/**
 * 口令
 * 1：列出我的 app
 * 2：列出我的 卡
 * 3：新增信息
 * 新增、更新、删除、删除密码
 */
async function getResponseText (text) {
  const list = await getAv()
  // JSON.stringify(list)
  return `<img src="data:image/jpeg;base64,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"/> 222\n 333`
}

function handleMessage (bodyString) {
  console.log(`消息内容: ${bodyString}`)
  parseString(Buffer.from(bodyString).toString('utf-8'), { explicitArray: false }, async (err, result) => {
    if (err) {
      //打印错误信息
      console.log(err)
    } else {
      //打印解析结果
      result = result.xml
      const toUser = result.ToUserName //接收方微信
      const fromUser = result.FromUserName //发送仿微信
      if (result.Event) {
        //处理事件类型
        switch (result.Event) {
          case "subscribe":
            //关注公众号
            break;
          default:
        }
      } else {
        //处理消息类型
        switch (result.MsgType) {
          case "text":
            //处理文本消息
            this.end(`<xml>
  <ToUserName><![CDATA[${fromUser}]]></ToUserName>
  <FromUserName><![CDATA[${toUser}]]></FromUserName>
  <CreateTime>${result.CreateTime}</CreateTime>
  <MsgType><![CDATA[text]]></MsgType>
  <Content><![CDATA[${await getResponseText(result.Content)}]]></Content>
</xml>`)
            break;
          case "image":
            //处理图片消息
            break;
          case "voice":
            //处理语音消息
            break;
          case "video":
            //处理视频消息
            break;
          case "shortvideo":
            //处理小视频消息
            break;
          case "location":
            //处理发送地理位置
            break;
          case "link":
            //处理点击链接消息
            break;
          default:
            this.end('')
        }
      }
    }
  })
}

function send (res, obj) {
  res.writeHead(200)
  res.end(JSON.stringify(obj))
}

function handleResponse (req, res, query, bodyString) {
  const path = req.url.split('?')[0]
  if (!uri[path]) {
    console.log(path, '没有匹配到方法...')
    return res.end('没有匹配到方法')
  }

  uri[path].call(res, query, bodyString)
}

const server = http.createServer((req, res) => {
  console.log(req.url)
  const { query } = url.parse(req.url, true)
  let body = ''
  req.on('data', function(chunk){
    body += chunk
  })
  req.on('end', function(){
    // body = querystring.parse(body)
    handleResponse(req, res, query, body)
  })
})

server.listen(3001, () => {
  console.log('server is start at http://localhost:3001')
})
