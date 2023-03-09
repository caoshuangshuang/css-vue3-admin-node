/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-24 19:56:59
 */
const { SuccessModel, ErrorModel } = require('../../model/resModel')
const {
  getUserTotal,
  checkUserExistsDb,
  loginDb,
  logoutDb,
  queryUserDb,
  addUserDb,
  editUserDb,
  deleteUserDb,
} = require('../../db/auth/user.js')
const { checkRoleExistsDb } = require('../../db/auth/role.js')
// 登录
const login = async (data = {}) => {
  try {
    const isUserExist = await checkUserExistsDb(data.account)
    if (!isUserExist) {
      return {
        success: false,
        message: '账号不存在',
      }
    }

    const res = await loginDb(data)
    if (res) {
      return {
        success: true,
        data: res,
      }
    }
    return {
      success: false,
      message: '密码错误',
    }
  } catch (err) {
    return {
      success: false,
      message: err,
    }
  }
}

// 登出
const logout = async (data) => {
  try {
    const isUserExist = await checkUserExistsDb(data.userId, 'userId')
    if (!isUserExist) {
      return {
        success: false,
        message: '账号不存在',
      }
    }
    const res = await logoutDb(data)
    if (res) {
      return {
        success: true,
      }
    }
  } catch (err) {
    return {
      success: false,
      message: err,
    }
  }
}

//查询用户
const queryUser = async (data) => {
  try {
    const { pageSize, pageNum } = data
    const [{ total }] = getUserTotal(data)
    const list = queryUserDb(data)
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

//添加用户
const addUser = async (data) => {
  try {
    const isRoleExist = await checkRoleExistsDb(data.roleId)
    if (!isRoleExist) {
      return {
        success: false,
        message: '角色不存在',
      }
    }
    const res = await addUserDb(data)
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

//编辑用户
const editUser = async (data) => {
  try {
    const isUserExist = await checkUserExistsDb(data.userId, 'userId')
    if (!isUserExist) {
      return {
        success: false,
        message: '账号不存在',
      }
    }
    const isRoleExist = await checkRoleExistsDb(data.roleId)
    if (!isRoleExist) {
      return {
        success: false,
        message: '角色不存在',
      }
    }
    const res = await editUserDb(data)
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

//删除用户
const deleteUser = async (data) => {
  try {
    const isUserExist = await checkUserExistsDb(data.userId, 'userId')
    if (!isUserExist) {
      return {
        success: false,
        message: '账号不存在',
      }
    }
    const res = await deleteUserDb(data)
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

module.exports = {
  login,
  logout,
  queryUser,
  addUser,
  editUser,
  deleteUser,
}
