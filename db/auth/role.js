/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-25 11:28:48
 */
const xss = require('xss')
const { exec, execTransaction } = require('../../db/mysql')

//获取角色总数
const getRoleTotal = async (data) => {
  const {roleId, roleName} = data
  let sql = `select count(*) as total from role where 1=1`
  if(roleId) {
    sql+=`and roleId=${roleId} `
  }
  if(roleName) {
    sql+=`and roleName like '%${roleName}%'`
  }
 return await exec(sql)
}

//查询角色
const queryRoleDb = async (data) => {
  const { roleId, roleName } = data
  let sql = `
  select roleId, roleName from role where 1=1
  `
  if (roleId) {
    sql += `and roleId = ${roleId}`
  }
  if (roleName) {
    sql += `and roleName = ${roleName}`
  }
  return await exec(sql)
}

//添加角色
const addRoleDb = async (data) => {
  const { roleName } = data
  const sql = `
  insert into role (roleName) 
  values ('${roleName}')
  `
  const res = await exec(sql)
  if (res.affectedRows > 0) {
    return true
  } else {
    return false
  }
}

//编辑角色
const editRoleDb = async (data) => {
  const { roleId, roleName } = data
  let sql = `
  update role set roleName='${roleName}' where roleId = ${roleId}
  `
  const res = await exec(sql)
  if (res.affectedRows > 0) {
    return true
  } else {
    return false
  }
}

//删除角色
const deleteRoleDb = async (data) => {
  const { roleId } = data
  const sql = `
  delete from role where roleId = ${roleId}
  `
  const res = await exec(sql)
  if (res.affectedRows > 0) {
    return true
  } else {
    return false
  }
}

// 检查角色是否存在
const checkRoleExistsDb = async (value) => {
  value = escape(value)
  const sql = `select roleId from role where roleId = ${value}`
  const rows = await exec(sql)
  return rows && rows.length ? true : false
}

//为角色分配权限
const assignAuthToRoleDb = async (data) => {
  const { roleId, roleAuths } = data
  if (!roleAuths || !roleAuths.length) {
    return false
  }
  let sqlArr = [
    'delete from role_application_menu_operation where roleId = ?',
    'insert into role_application_menu_operation (roleId, applicationId, menuId, operationId) values ?'
  ]
  const insertData = handleRoleData(roleId, roleAuths)
  let paramArr = [
    roleId,
    insertData
  ]
 const res = await execTransaction(sqlArr, paramArr)
 return !!res
}

function handleRoleData(id, data) {
  return data.map((item) => {
    return [id, item.applicationId, item.menuId, item.operationId]
  })
}

//查询角色应用
const queryRoleApplication = async (data) => {
  const { roleId } = data
  let sql = `
  select distinct application.applicationId, applicationName from application join role_application_menu_operation on application.applicationId = role_application_menu_operation.applicationId
  `
  if(roleId) {
    sql+= ` and roleId = ${roleId}`
  }
  return await exec(sql)
}

//查询角色菜单
const queryRoleMenu = async (data, key) => {
  const { roleId } = data
  let sql = `
  select distinct menu.menuId, menuName, menuIcon, menuPath, parentMenuId, menu.applicationId from menu join role_application_menu_operation on menu.menuId = role_application_menu_operation.${key}
  `
  if(roleId) {
    sql+= ` and roleId = ${roleId}`
  }
  return await exec(sql)
}

//查询角色操作
const queryRoleOperation = async (data) => {
  const { roleId } = data
  let sql = `
  select distinct operation.operationId, operationName, operation.menuId from operation join role_application_menu_operation on operation.operationId = role_application_menu_operation.operationId
  `
  if(roleId) {
    sql+= ` and roleId = ${roleId}`
  }
  return await exec(sql)
}
module.exports = {
  getRoleTotal,
  queryRoleDb,
  addRoleDb,
  editRoleDb,
  deleteRoleDb,
  checkRoleExistsDb,
  assignAuthToRoleDb,
  queryRoleApplication,
  queryRoleMenu,
  queryRoleOperation
}
