/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-09 14:45:05
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-24 20:15:03
 */
const router = require('koa-router')()
const { ErrorModel, SuccessModel } = require('../model/resModel')
const { verifyRoleAuths } = require('../utils/verification.js')
const { login, logout, queryUser, addUser, editUser, deleteUser } = require('../controller/auth/user.js')
const { queryRole, addRole, editRole, deleteRole, assignAuthToRole, queryRoleAuth } = require('../controller/auth/role')
const {
  queryApplication,
  addApplication,
  editApplication,
  deleteApplication,
} = require('../controller/auth/application.js')
const { queryMenu, addMenu, editMenu, deleteMenu } = require('../controller/auth/menu.js')
const { queryOperation, addOperation, editOperation, deleteOperation } = require('../controller/auth/operation.js')
router.prefix('/auth')

//登录
router.post('/user/login', async function (ctx, next) {
  const body = ctx.request.body
  const { account, password } = body
  if (!account) {
    ctx.body = new ErrorModel('请输入账号')
    return
  }
  if (!password) {
    ctx.body = new ErrorModel('请输入密码')
    return
  }
  const res = await login({ account, password })
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

// 登出
router.post('/user/logout', async function (ctx, next) {
  const body = ctx.request.body
  const res = await logout(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//查询角色
router.post('/role/queryRole', async function (ctx, next) {
  const body = ctx.request.body
  const res = await queryRole(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//添加角色
router.post('/role/addRole', async function (ctx, next) {
  const body = ctx.request.body
  const { roleName } = body
  if (!roleName) {
    ctx.body = new ErrorModel('角色名称为空')
    return
  }
  const res = await addRole({ roleName })
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//编辑角色
router.post('/role/editRole', async function (ctx, next) {
  const body = ctx.request.body
  const { roleId, roleName } = body
  if (!roleId || !roleName) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await editRole(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//删除角色
router.post('/role/deleteRole', async function (ctx, next) {
  const body = ctx.request.body
  const { roleId } = body
  if (!roleId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await deleteRole(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

// 为角色分配权限
router.post('/role/assignAuthToRole', async function (ctx, next) {
  const body = ctx.request.body
  const { roleId, roleAuths } = body
  if (!roleId || !roleAuths || !verifyRoleAuths(roleAuths)) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await assignAuthToRole(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

// 获取角色权限
router.post('/role/queryRoleAuth', async function(ctx, next) {
  const body = ctx.request.body
  const {roleId} = body
  if(!roleId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await queryRoleAuth(body)
  if(res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

// 查询用户
router.post('/user/queryUser', async function (ctx, next) {
  const body = ctx.request.body
  const res = await queryUser(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//添加用户
router.post('/user/addUser', async function (ctx, next) {
  const body = ctx.request.body
  const { account, mobile, roleId } = body
  if (!account || !mobile || !roleId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await addUser(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//编辑用户
router.post('/user/editUser', async function (ctx, next) {
  const body = ctx.request.body
  const { userId, account, mobile, roleId } = body
  if (!userId || !account || !mobile || !roleId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await editUser(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//删除用户
router.post('/user/deleteUser', async function (ctx, next) {
  const body = ctx.request.body
  const { userId } = body
  if (!userId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await deleteUser(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

// 查询应用
router.post('/application/queryApplication', async function (ctx, next) {
  const body = ctx.request.body
  const { pageSize, pageNum } = body
  if (!pageNum || !pageSize) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await queryApplication(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//添加应用
router.post('/application/addApplication', async function (ctx, next) {
  const body = ctx.request.body
  const { applicationName } = body
  if (!applicationName ) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await addApplication(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//编辑应用
router.post('/application/editApplication', async function (ctx, next) {
  const body = ctx.request.body
  const { applicationId, applicationName } = body
  if (!applicationId || !applicationName) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await editApplication(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//删除应用
router.post('/application/deleteApplication', async function (ctx, next) {
  const body = ctx.request.body
  const { applicationId } = body
  if (!applicationId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await deleteApplication(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//查询菜单
router.post('/menu/queryMenu', async function (ctx, next) {
  const body = ctx.request.body
  const res = await queryMenu(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//添加菜单
router.post('/menu/addMenu', async function (ctx, next) {
  const body = ctx.request.body
  const { menuName, menuIcon, menuPath, applicationId } = body
  if (!menuName || !menuIcon || !menuPath || !applicationId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await addMenu(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//编辑菜单
router.post('/menu/editMenu', async function (ctx, next) {
  const body = ctx.request.body
  const { menuId, menuName, menuIcon, menuPath } = body
  if (!menuId || !menuName || !menuIcon || !menuPath) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await editMenu(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//删除菜单
router.post('/menu/deleteMenu', async function (ctx, next) {
  const body = ctx.request.body
  const res = await deleteMenu(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//查询操作权限
router.post('/operation/queryOperation', async function (ctx, next) {
  const body = ctx.request.body
  const res = await queryOperation(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//添加操作权限
router.post('/operation/addOperation', async function (ctx, next) {
  const body = ctx.request.body
  const { operationName, menuId } = body
  if (!operationName || !menuId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await addOperation(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//编辑操作权限
router.post('/operation/editOperation', async function (ctx, next) {
  const body = ctx.request.body
  const { operationId, operationName, menuId } = body
  if (!operationId || !operationName || !menuId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await editOperation(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

//删除操作权限
router.post('/operation/deleteOperation', async function (ctx, next) {
  const body = ctx.request.body
  const { operationId } = body
  if (!operationId) {
    ctx.body = new ErrorModel('缺少必要参数')
    return
  }
  const res = await deleteOperation(body)
  if (res.success) {
    ctx.body = new SuccessModel(res)
  } else {
    ctx.body = new ErrorModel(res)
  }
})

module.exports = router
