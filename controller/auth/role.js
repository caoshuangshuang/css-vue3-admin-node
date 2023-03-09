/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-25 13:47:18
 */
const { AUTH_WHITE_LIST } = require('../../conf/config.js')
const { SuccessModel, ErrorModel } = require('../../model/resModel')
const {
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
} = require('../../db/auth/role.js')

//查询角色
const queryRole = async (data) => {
  try {
    const { pageSize, pageNum } = data
    const [{ total }] = getRoleTotal(data)
    const list = queryRoleDb(data)
    return {
      success: true,
      data: {
        list,
        total,
        pageSize,
        pageNum,
      },
    }
  } catch (err) {
    return {
      success: false,
      message: err,
    }
  }
}

//添加角色
const addRole = async (data) => {
  try {
    const res = await addRoleDb(data)
    if (res) {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err,
    }
  }
}

//编辑角色
const editRole = async (data) => {
  try {
    const isRoleExist = await checkRoleExistsDb(data.roleId)
    if (!isRoleExist) {
      return {
        success: false,
        message: '角色不存在',
      }
    }
    const res = await editRoleDb(data)
    if (res) {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err,
    }
  }
}

//删除角色
const deleteRole = async (data) => {
  try {
    const isRoleExist = await checkRoleExistsDb(data.roleId)
    if (!isRoleExist) {
      return {
        success: false,
        message: '角色不存在',
      }
    }
    const res = await deleteRoleDb(data)
    if (res) {
      return {
        success: true,
      }
    } else {
      return {
        success: false,
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err,
    }
  }
}

//为角色分配权限
const assignAuthToRole = async (data) => {
  const isRoleExist = await checkRoleExistsDb(data.roleId)
  if (!isRoleExist) {
    return new ErrorModel('角色不存在')
  }
  const res = await assignAuthToRoleDb(data)
  if (res) {
    return new SuccessModel(res, '操作成功')
  } else {
    return new ErrorModel('操作失败')
  }
}

//查询用户权限
const queryRoleAuth  = async (data) => {
  try {
    const { roleId } = data
    const isRoleExist = await checkRoleExistsDb(data.roleId)
    if (!isRoleExist) {
      return {
        success: false,
        message: '角色不存在',
      }
    }
    let param = {}
    if(!AUTH_WHITE_LIST.includes(roleId)) {
      param.roleId = roleId
    }
    const applicationArr = await queryRoleApplication(param)
    const menuArr = await queryRoleMenu(param,'menuId')
    const subMenuArr = await queryRoleMenu(param,'subMenuId')
    const operationArr = await queryRoleOperation(param)
    let list = handleAuthData(applicationArr,menuArr,subMenuArr,operationArr)
    return {
      success:true,
      data:list
    }
  } catch (err) {
    return {
      success:false,
      message:err
    }
  }
}

const handleAuthData = (applicationArr,menuArr,subMenuArr,operationArr) => {
  let applicationIndexMap = {}
  let menuIndexMap = {}
  let authList = []
  let applicationMap = {}
  applicationArr.forEach((item,index) => {
    item.menuList = []
    applicationMap[item.applicationId] = item
    authList.push(item)
    applicationIndexMap[item.applicationId] = index
  })
  
  menuArr.forEach((item, index) => {
    item.subMenuList = []
    authList[applicationIndexMap[item.applicationId]].menuList.push(item)
    menuIndexMap[item.menuId] = [applicationIndexMap[item.applicationId], index]
  })

  subMenuArr.forEach((item, index) => {
    item.operationList = []
    let applicationIndex = menuIndexMap[item.parentMenuId][0] //应用索引
    let menuIndex = menuIndexMap[item.parentMenuId][1] //一级菜单索引
    menuIndexMap[item.menuId] = [applicationIndex, menuIndex, index] //存储二级菜单索引
    authList[applicationIndex].menuList[menuIndex].subMenuList.push(item)
  })
  operationArr.forEach((item) => {
    let applicationIndex = menuIndexMap[item.menuId][0] //应用索引
    let menuIndex = menuIndexMap[item.menuId][1] //一级菜单索引
    let subMenuIndex = menuIndexMap[item.menuId][2] //二级菜单索引
    authList[applicationIndex].menuList[menuIndex].subMenuList[subMenuIndex].operationList.push(item)
  })
  
  return authList
}
module.exports = {
  queryRole,
  addRole,
  editRole,
  deleteRole,
  assignAuthToRole,
  queryRoleAuth
}
