/*
 * @Description:
 * @version: 1.0.0
 * @Author: 曹双双
 * @Date: 2022-10-09 18:19:34
 * @LastEditors: 曹双双
 * @LastEditTime: 2022-11-14 16:18:52
 */
const mysql = require('mysql')
const { MysqlConf } = require('../conf/db')

//创建连接池
const conPool = mysql.createPool(MysqlConf)

//执行sql语句
function exec(sql) {
  return new Promise((resolve, rejext) => {
    conPool.getConnection((err, connection) => {
      if(err) {
        return rejext(err)
      }
      connection.query(sql, (err, result) => {
        connection.release() //释放链接
        if (err) {
          return rejext(err)
        }
        resolve(result)
      })
    })
  })
}

// 执行sql语句
function execWithParam(sql, param) {
  return new Promise((resolve, reject) => {
    conPool.getConnection((err, connection) => {
      if(err) {
        return reject(err)
      }
      connection.query(
        {
          sql: sql,
          values: [param],
        },
        function (err, results, fields) {
          connection.release() //释放链接
          if (err) {
           return reject(err)
          }
          resolve(results)
        }
      )
    })
  })
}

// 事务
function execTransaction(sqlArr, paramArr) {
  return new Promise((resolve, reject) => {
    if(sqlArr.length!==paramArr.length) {
      return reject('sql语句与传值不匹配')
    }
    // 获取连接
    conPool.getConnection((err, connection) => {
      if(err) {
        return reject(err)
      }
      // 创建事务
      connection.beginTransaction((err) => {
        if(err) {
          return reject('创建事务失败：',err)
        }
        let promiseArr = sqlArr.map((sql,index) => {
          return new Promise((sqlResolve, sqlReject) => {
            const data = paramArr[index]
            connection.query(sql, [data], (sqlErr, result) => {
              if(sqlErr) {
                return sqlReject(sqlErr)
              }
              sqlResolve(result)
            })
          })
        })

        Promise.all(promiseArr).then(resultArr=>{
          // 提交事务
          connection.commit((commitErr) => {
            if(commitErr) {
              console.log('提交事务失败：',commitErr)
              connection.rollback((rollErr) => {
                if(rollErr) {
                  console.log('回滚失败：', rollErr)
                }
              })
              // 释放连接
              connection.release()
              return reject(commitErr)
            }
            connection.release()
            return resolve(resultArr)
          })
        }).catch((err) => {
          // 失败回滚
          connection.rollback(() => {
            console.log('sql运行失败：',err)
            connection.release()
            reject(error)
          })
        })
      })
    })
  })
}

module.exports = {
  exec,
  execWithParam,
  escape: mysql.escape,
  execTransaction
}
