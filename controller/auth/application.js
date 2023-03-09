/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-21 11:14:08
 */
const {
  getApplicationTotal,
  queryApplicationDb,
  addApplicationDb,
  editApplicationDb,
  deleteApplicationDb,
  checkApplicationExistsDb,
} = require('../../db/auth/application.js')

//查询应用
const queryApplication = async (data) => {
  const { pageSize, pageNum } = data
  try {
    const [{total}] = await getApplicationTotal(data)
    const list = await queryApplicationDb(data)
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

//添加应用
const addApplication = async (data) => {
  try {
    const res = await addApplicationDb(data)
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

//编辑应用
const editApplication = async (data) => {
  try {
    const isApplicationExist = await checkApplicationExistsDb(data.applicationId)
    if (!isApplicationExist) {
      return {
        success: false,
        message: '应用不存在',
      }
    }
    const res = await editApplicationDb(data)
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

//删除应用
const deleteApplication = async (data) => {
  try {
    const isApplicationExist = await checkApplicationExistsDb(data.applicationId)
    if (!isApplicationExist) {
      return {
        success: false,
        message: '应用不存在',
      }
    }
    const res = await deleteApplicationDb(data)
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
  queryApplication,
  addApplication,
  editApplication,
  deleteApplication,
}
