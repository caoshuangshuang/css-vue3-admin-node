/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-11-12 14:30:08
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-12 15:33:32
 */
const verifyRoleAuths = (arr) => {
  if(Object.prototype.toString.call(arr)!=='[object Array]'){
    return false
  } 
  for(let item of arr) {
    const {applicationId, menuId, operationId} = item
    if(!applicationId||!menuId||!operationId){
      return false
    }
  }
  return true
}

module.exports = {
  verifyRoleAuths
}