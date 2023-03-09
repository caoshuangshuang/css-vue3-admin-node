/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-22 15:22:14
 */
const xss = require('xss')
const { exec, escape } = require('../../db/mysql')
const anyid = require('anyid').anyid
const ids = anyid().encode('0').length(3).random()
const constant = require('../../utils/constant')

//获取用户总数
const getUserTotal = async (data) => {
  const {userId, account, mobile} = data
  let sql = `select count(*) as total from user where 1=1`
  if(userId) {
    sql+=`and userId=${userId}`
  }
  if(account) {
    sql+=`and account=${account}`
  }
  if(mobile) {
    sql+=`and mobile=${mobile}`
  }
 return await exec(sql)
}

//登录
const loginDb = async (data={}) => {
  const account = escape(data.account)
  const password = escape(data.password)

  const sql = `
  select account,mobile from user where account = ${account} and password = ${password}
  `
  const rows = await exec(sql)
  return rows[0] || null
}

// 登出
const logoutDb = async (data) => {
  const { userId} = data
  const sql = `
  update user set state = ${constant.STATE_LOGOUT} where userId = '${userId}'
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//查询用户
const queryUserDb = async (data) => {
  const {userId, account, mobile } = data
  let sql = `
  select userId, account, mobile, password, createTime,roleId, roleName from user inner role on user.roleId=role.roleId
  `
  if(userId) {
    sql+=`and user.userId=${userId}`
  }
  if(account) {
    sql+=`and user.account=${account}`
  }
  if(mobile) {
    sql+=`and user.mobile=${mobile}`
  }
  sql+=` limit ${(pageNum-1)*pageSize},${pageSize} `
  return await exec(sql)
}

//添加用户
const addUserDb = async (data) => {
  const {account, mobile, roleId} = data
  const userId = ids.id()
  const sql = `
  insert into user (userId, account, mobile, roleId) 
  values ('${userId}', '${account}', '${mobile}', '${roleId}')
  `
  const res =  await exec(sql)
  return res.affectedRows>0
}

//编辑用户
const editUserDb = async (data) => {
  const {userId, account, mobile, roleId } = data
  let sql = `
  update user set account='${account}', mobile='${mobile}', roleId='${roleId}' where userId = '${userId}'
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//删除用户
const deleteUserDb = async (data) => {
  const {userId} = data
  const sql = `
  delete from user where userId = '${userId}'
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

// 检查用户是否存在
const checkUserExistsDb = async (value,type='account') => {
  value = escape(value)
  const sql = `select userId from user where ${type} = ${value}`
  const rows = await exec(sql)
  return rows&&rows.length?true:false
}

module.exports = {
  getUserTotal,
  checkUserExistsDb,
  loginDb,
  logoutDb,
  queryUserDb,
  addUserDb,
  editUserDb,
  deleteUserDb
}