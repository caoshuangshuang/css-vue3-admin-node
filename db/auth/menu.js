/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-21 11:22:27
 */
const xss = require('xss')
const { exec, escape } = require('../../db/mysql')

//获取菜单总数
const getMenuTotal = async (data) => {
  const {menuId, menuName} = data
  let sql = `select count(*) as total from menu where 1=1`
  if(menuId) {
    sql+=`and menuId=${menuId} `
  }
  if(menuName) {
    sql+=`and menuName like '%${menuName}%'`
  }
 return await exec(sql)
}

// 查询菜单
const queryMenuDb  = async (data) => {
  const { menuId, menuName, pageNum, pageSize } = data
  let sql = 'select menuId, menuName, menuIcon, menuPath, parentMenuId, createTime from menu where 1=1'
  if(menuId) {
    sql+=`and menuId=${menuId} `
  }
  if(menuName) {
    sql+=`and menuName like '%${menuName}%'`
  }
  sql+=` limit ${(pageNum-1)*pageSize},${pageSize} `
  return await exec(sql)
}

// 添加菜单
const addMenuDb = async (data) => {
  const { menuName, menuIcon,  menuPath, parentMenuId, applicationId} = data
  const sql = `
  insert into menu (menuName,menuIcon, menuPath, parentMenuId, applicationId) 
  values ('${menuName}', '${menuIcon}', '${menuPath}', '${parentMenuId}','${applicationId}')
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//编辑菜单
const editMenuDb = async (data) => {
  const {menuId, menuName, menuIcon, menuPath, parentMenuId } = data
  let sql = `
  update menu set menuName='${menuName}',menuIcon='${menuIcon}',menuPath='${menuPath}',parentMenuId='${parentMenuId}' where menuId = ${menuId}
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//删除菜单
const deleteMenuDb = async (data) => {
  const {menuId} = data
  const sql = `
  delete from menu where menuId = ${menuId}
  `
  const res = await exec(sql)
  return res.affectedRows>0
}

//检查菜单是否存在
const checkMenuExistsDb = async (value) => {
  const sql = `
  select * from menu where menuId = ${value}
  `
  const rows = await exec(sql)
  return rows&&rows.length>0
}

module.exports = {
  getMenuTotal,
  queryMenuDb,
  addMenuDb,
  editMenuDb,
  deleteMenuDb,
  checkMenuExistsDb
}