/**
 * 获取小程序access_token
 */

const http = require('http')
const axios = require('axios')
// const token = '14_9Fzm8-PigyNupNE88aLCfUD1Bl12LocVky8flnUaeDSSSnlmbu6fQxj-sx9daMiYNezv4xuYIMsgccptIze9--mNLBhkaGxHvnqAvTBnhKk-7Rv0nUcxero6xT3CBrnjJTv5bfvUVlus-1AQECFjAHAYWZ'
const querystring = require('querystring')

let getTokenStartTime
let expireSeconds
let accessToken
const getAccessToken = () => {
  if (Date.now() - getTokenStartTime < expireSeconds * 1000) {
    console.log('从缓存取token')
    return Promise.resolve(accessToken)
  }
  console.log('获取token')
  // token 失效，需要重新获取
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx33160dea62feba36&secret=20304416114d0da2a81bc8211462fe36`
  return axios.get(url).then(res => {
    getTokenStartTime = Date.now()
    expireSeconds = res.data.expires_in
    accessToken = res.data.access_token
    return accessToken
  })
}

const getQuery = (url) => {
  const search = url.substring(url.indexOf('?') + 1)
  return querystring.parse(search)
}

const logConsole = (url) => {
  return Promise.resolve().then(() => {
    const params = getQuery(url)
    console.log(params.msg || 'receive message.')
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

const server = http.createServer((req, res) => {
  console.log(req.url)
  if (/\/getAccessToken/.test(req.url)) {
    getAccessToken().then(token => {
      res.writeHead(200)
      res.end(JSON.stringify({ token }))
    }).catch(res => {
      res.writeHead(200)
      res.end(JSON.stringify({ ...res.data }))
    })
  } else if (/\/sendTemplateMessage/.test(req.url)) {
    sendTemplateMessage(req.url).then(data => {
      res.writeHead(200)
      console.log('发送消息成功', data.data)
      res.end(JSON.stringify(data.data))
    }).catch(data => {
      res.writeHead(200)
      console.log('发送消息catch', data)
      res.end(JSON.stringify(data))
    })
  } else if (/\/console/.test(req.url)) {
    logConsole(req.url).then(data => {
      res.writeHead(200)
      res.end(JSON.stringify(data))
    }).catch(data => {
      res.writeHead(200)
      res.end(JSON.stringify(data))
    })
  }
})

server.listen(3001, () => {
  console.log('server is start at http://localhost:3001')
})
