/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-21 11:16:14
 */
const {
  getMenuTotal,
  queryMenuDb,
  addMenuDb,
  editMenuDb,
  deleteMenuDb,
  checkMenuExistsDb,
} = require('../../db/auth/menu.js')

//查询菜单
const queryMenu = async (data) => {
  try {
    const { pageSize, pageNum } = data
    const [{ total }] = await getMenuTotal(data)
    const list = await queryMenuDb(data)
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

//添加菜单
const addMenu = async (data) => {
  try {
    let isParentMenuIdExist = true
    if (data.parentMenuId) {
      isParentMenuIdExist = await checkMenuExistsDb(data.parentMenuId)
    }
    if (!isParentMenuIdExist) {
      return {
        success: false,
        message: '父级菜单不存在',
      }
    }
    const res = await addMenuDb(data)
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

//编辑菜单
const editMenu = async (data) => {
  try {
    const isMenuIdExist = await checkMenuExistsDb(data.menuId)
    if (!isMenuIdExist) {
      return {
        success: false,
        message: '菜单不存在',
      }
    }
    let isParentMenuIdExist = true
    if (data.parentMenuId) {
      isParentMenuIdExist = await checkMenuExistsDb(data.parentMenuId)
    }
    if (!isParentMenuIdExist) {
      return {
        success: false,
        message: '菜单不存在',
      }
    }
    const res = await editMenuDb(data)
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

//删除菜单
const deleteMenu = async (data) => {
  try {
    const isMenuIdExist = await checkMenuExistsDb(data.menuId)
    if (!isMenuIdExist) {
      return {
        success: false,
        message: '菜单不存在',
      }
    }
    const res = await deleteMenuDb(data)
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
  queryMenu,
  addMenu,
  editMenu,
  deleteMenu,
}
