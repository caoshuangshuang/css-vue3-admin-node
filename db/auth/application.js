/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-21 09:49:39
 */
const xss = require('xss')
const { exec, escape } = require('../../db/mysql')
const anyid = require('anyid').anyid
const constant = require('../../utils/constant')
const { genSqlCondition } = require('../../utils/index.js')

//获取应用总数
const getApplicationTotal = async (data) => {
  const {applicationId, applicationName} = data
  let sql = `select count(*) as total from application where 1=1`
  if(applicationId) {
    sql+=`and applicationId=${applicationId} `
  }
  if(applicationName) {
    sql+=`and menuName like '%${applicationName}%'`
  }
 return await exec(sql)
}

// 查询应用
const queryApplicationDb  = async (data) => {
  const { applicationId, applicationName, pageSize, pageNum} = data
  let sql = 'select applicationId, applicationName, createTime from application where 1=1'
  if(applicationId) {
    sql+=`and applicationId=${applicationId} `
  }
  if(applicationName) {
    sql+=`and menuName like '%${applicationName}%'`
  }
  sql+=` limit ${(pageNum-1)*pageSize},${pageSize} `
  const res = await exec(sql)
  return res
}

// 添加应用
const addApplicationDb = async (data) => {
  const { applicationName } = data
  const sql = `
  insert into application (applicationName) 
  values ('${applicationName}')
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//编辑应用
const editApplicationDb = async (data) => {
  const {applicationId, applicationName } = data
  let sql = `
  update application set applicationName='${applicationName}'where applicationId = ${applicationId}
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//删除应用
const deleteApplicationDb = async (data) => {
  const {applicationId} = data
  const sql = `
  delete from application where applicationId = ${applicationId}
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//检查应用是否存在
const checkApplicationExistsDb = async (value) => {
  value = escape(value)
  const sql = `select * from application where applicationId = ${value}`
  const rows = await exec(sql)
  return rows&&rows.length?true:false
}

module.exports = {
  getApplicationTotal,
  queryApplicationDb,
  addApplicationDb,
  editApplicationDb,
  deleteApplicationDb,
  checkApplicationExistsDb
}