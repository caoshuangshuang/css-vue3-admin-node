/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-09 14:45:05
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-10-15 16:36:26
 */
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
// const session = require('koa-generic-session')
// const redisStore = require('koa-redis')
// const fs = require('fs')
// const path = require('path')
// const morgan = require('koa-morgan')

const auth = require('./routes/auth')

// const { getRedisConf } = require('./conf/db')

// error handler
onerror(app)

// middlewares
app.use(
  bodyparser({
    enableTypes: ['json', 'form', 'text'],
  })
)
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// const ENV = process.env.NODE_ENV
// if (ENV !== 'production') {
//   app.use(morgan('dev'))
// } else {
//   const logFileName = path.join(__dirname, 'logs', 'access.log')
//   const writeStream = fs.createWriteStream(logFileName, {
//     flags: 'a',
//   })
//   app.use(
//     morgan('combined', {
//       stream: writeStream,
//     })
//   )
// }

//session配置
// app.keys = ['shumo_css']
// app.use(
//   session({
//     //配置cookie
//     cookie: {
//       path: '/',
//       httpOnly: true,
//       maxAge: 24 * 60 * 60 * 1000,
//     },
//     //配置redis
//     store: redisStore({
//       all: `${getRedisConf().host}:${getRedisConf().port}`,
//     }),
//   })
// )

// routes
app.use(auth.routes(), auth.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
