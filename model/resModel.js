/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-10 09:42:56
 * @LastEditors: 曹双双
 * @LastEditTime: 2023-03-09 15:01:54
 */
const { CODE_ERROR, CODE_SUCCESS } = require('../utils/constant')

class BaseModel {
  constructor(data, message = '操作成功', success) {
    this.data = null
    if (arguments.length === 0) {
      this.message = message
      return
    }
    if (arguments.length === 1) {
      this.message = data
      return
    }
    this.data = data
    this.message = message
    this.success = success
  }
}

class SuccessModel extends BaseModel {
  constructor(res) {
    const {data, message, success, code = CODE_SUCCESS} = res
    super(data, message, success)
    this.code = code
    this.success
  }
}

class ErrorModel extends BaseModel {
  constructor(res) {
    console.log('res',res)
    const { message,success, code = CODE_ERROR } = res
    super(null, message, success)
    this.code = code 
  }
}

module.exports = {
  SuccessModel,
  ErrorModel,
}
