/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-09 15:31:09
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-14 09:39:14
 */
const env = process.env.NODE_ENV

const MYSQL_CONF = {
  dev: {
    host:'localhost',
    user:'root',
    password:'123.shuang',
    port:'3306',
    database:'vue3admin',
    charset:'utf8',
    connectionLinit:1000
  },
  production: {
    host:'localhost',
    user:'root',
    password:'123.shuang',
    port:'3306',
    database:'vue3admin',
    charset:'utf8',
    connectionLinit:1000
  }
}

const REDIS_CONF = {
  dev:{
    port:'6379',
    host:'127.0.0.1'
  },
  production:{
    port:'6379',
    host:'127.0.0.1'
  }
}

const MysqlConf = function() {
  return MYSQL_CONF[env]
}()

const RedisConf = function() {
  return REDIS_CONF[env]
}()

module.exports = {
  MysqlConf,
  RedisConf
}