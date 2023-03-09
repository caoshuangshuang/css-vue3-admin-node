/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-17 11:05:21
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-22 11:02:21
 */
const { SuccessModel, ErrorModel } = require('../../model/resModel')
const {
  getOperationTotal,
  queryOperationDb,
  addOperationDb,
  editOperationDb,
  deleteOperationDb,
  checkOperationExistsDb
} = require('../../db/auth/operation.js')
const {
  checkMenuExistsDb
} = require('../../db/auth/menu.js')

//查询操作
const queryOperation = async (data) => {
  try {
    const { pageSize, pageNum } = data
    const [{total}] = getOperationTotal(data)
    const list = queryOperationDb(data)
    return {
      success:true,
      data:{
        list,
        total,
        pageSize,
        pageNum
      }
    }
  } catch (err) {
    return {
      success:false,
      message:err
    }
  }
}

//添加操作
const addOperation = async (data) => {
  try {
    const isMenuExist =await checkMenuExistsDb(data.menuId)
    if(!isMenuExist) {
      return {
        success:fasle,
        message:'菜单不存在'
      }
    }
    const res = await addOperationDb(data)
    if (res) {
      return {
        success:true
      }
    } else {
      return {
        success:false
      }
    }
  } catch (err) {
    return {
      success:false,
      message:err
    }
  }
  
}

//编辑操作
const editOperation = async (data) => {
  try {
    const isOperationExist =await checkOperationExistsDb(data.operationId)
  if(!isOperationExist) {
    return {
      success:false,
      message:'操作不存在'
    }
  }
  const isMenuExist =await checkMenuExistsDb(data.menuId)
  if(!isMenuExist) {
    return {
      success:false,
      message:'菜单不存在'
    }
  }
  const res = await editOperationDb(data)
  if(res) {
    return {
      success:true
    }
  } else {
    return {
      success:false
    }
  }
  } catch (err) {
    return {
      success:false,
      message:err
    }
  }
  
}

//删除操作
const deleteOperation = async (data) => {
  try {
    const isOperationExist =await checkOperationExistsDb(data.operationId)
    if(!isOperationExist) {
      return {
        success:false,
        message:'操作不存在'
      }
    }
    const res = await deleteOperationDb(data)
    if(res) {
      return {
        success:true
      }
    } else {
      return {
        success:false
      }
    }
  } catch (err) {
    return {
      success:false,
      message:err
    }
  }
  
}

module.exports = {
  queryOperation,
  addOperation,
  editOperation,
  deleteOperation
}
