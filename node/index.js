/**
 * 获取小程序access_token
 */

const http = require('http')
const axios = require('axios')
const token = '14_9Fzm8-PigyNupNE88aLCfUD1Bl12LocVky8flnUaeDSSSnlmbu6fQxj-sx9daMiYNezv4xuYIMsgccptIze9--mNLBhkaGxHvnqAvTBnhKk-7Rv0nUcxero6xT3CBrnjJTv5bfvUVlus-1AQECFjAHAYWZ'
const querystring = require('querystring')

let getTokenStartTime
let expireSeconds
let accessToken
const getAccessToken = () => {
  if (Date.now() - getTokenStartTime < expireSeconds * 1000) {
    console.log('从缓存取token')
    return Promise.resolve(accessToken)
  }
  console.log('token 失效，重新获取')
  // token 失效，需要重新获取
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx33160dea62feba36&secret=20304416114d0da2a81bc8211462fe36`
  return axios.get(url).then(res => {
    getTokenStartTime = Date.now()
    expireSeconds = res.data.expires_in
    accessToken = res.data.access_token
    return accessToken
  })
}

const addTemplate = () => {
  const url = `https://api.weixin.qq.com/cgi-bin/wxopen/template/add?access_token=${token}`
  console.log(url)
  return axios.post(url, {
    id: '承诺状态通知',
    keyword_id_list: [3, 4, 5]
  }).then(res => {
    return res.data
  })
}

const sendTemplateMessage = (reqUrl) => {
  const url = `https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send`
  const templateId = 'keRZcuEsnmNUVh6I2qd9isd2MOLM7LHAmry0RwURZ9k'

  const search = reqUrl.substring(reqUrl.indexOf('?') + 1)
  const params = querystring.parse(search)

  console.log(url)
  console.log({
    access_token: accessToken || token,
    touser: 'okbFo5JofpMsNWsD156pnLpo5yXc',
    template_id: templateId,
    form_id: params.formId
  })

  return axios.post(url, {
    access_token: accessToken || token,
    touser: 'okbFo5JofpMsNWsD156pnLpo5yXc',
    template_id: templateId,
    form_id: params.formId,
    data: {
      keyword1: {
        value: 339208499
      }
    }
  })
}

const server = http.createServer((req, res) => {
  console.log(req.url)
  if (/getAccessToken/.test(req.url)) {
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
      res.end(JSON.stringify(data))
    }).catch(data => {
      res.writeHead(200)
      res.end(JSON.stringify(data))
    })
  } else if (req.url === '/addTemplate') {
    addTemplate().then(data => {
      res.writeHead(200)
      res.end(JSON.stringify(data))
    }).catch(data => {
      res.writeHead(200)
      res.end(JSON.stringify(data))
    })
  }
})

server.listen(3001, () => {
  console.log('server is start')
})
