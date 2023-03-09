/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-22 11:06:52
 */
const xss = require('xss')
const { exec, escape } = require('../../db/mysql')
const anyid = require('anyid').anyid
const ids = anyid().encode('0').length(3).random()
const constant = require('../../utils/constant')

//获取操作总数
const getOperationTotal = async (data) => {
  const {operationId, operationName} = data
  let sql = `select count(*) as total from operation where 1=1`
  if(operationId) {
    sql+=`and operationId=${operationId} `
  }
  if(operationName) {
    sql+=`and operationName like '%${operationName}%'`
  }
 return await exec(sql)
}

// 查询操作权限
const queryOperationDb  = async (data) => {
  const { operationId,operationName} = data
  const sql = `
  select operationId, buttonName, menuId, createTime from operation where 1=1 
  `
  if(operationId) {
    sql+=`and operationId = ${operationId}`
  }
  if(operationName) {
    sql+=`and operationName like '%${operationName}%'`
  }
  sql+=` limit ${(pageNum-1)*pageSize},${pageSize} `
  const rows = await exex(sql)
  return rows || []
}

// 添加操作权限
const addOperationDb = async (data) => {
  const { operationName, menuId } = data
  const sql = `
  insert into operation ( operationName, menuId) 
  values ( '${operationName}', '${menuId}')
  `
  const res  = await exec(sql)
  return res.affectedRows>0
}

//编辑操作权限
const editOperationDb = async (data) => {
  const {operationId, operationName, menuId } = data
  let sql = `
  update operation set operationName='${operationName}',menuId='${menuId}' where operationId = ${operationId}
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//删除操作权限
const deleteOperationDb = async (data) => {
  const {operationId} = data
  let sql = `
  delete from operation where operationId = ${operationId}
  `
  const deleteData = await exec(sql)
  return deleteData.affectedRows
}

//检查操作是否存在
const checkOperationExistsDb = async (value) => {
  const sql = `
  select * from operation where operationId = ${value}
  `
  const rows = await exec(sql)
  return rows&&rows.length>0
}

module.exports = {
  getOperationTotal,
  queryOperationDb,
  addOperationDb,
  editOperationDb,
  deleteOperationDb,
  checkOperationExistsDb
}