/*
 * @Description: 
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-11-14 16:10:26
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-14 16:32:58
 */

const genSqlCondition = (param, separator) => {
  let str = ''
  for(let key in param) {
    str += `${separator}${key}=${param[key]}`
  }
  return str.slice(separator.length)
}