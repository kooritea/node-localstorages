const Storage = require('../index.js')
const path = require('path')

const storage = new Storage({filePath:path.join(__dirname, './data.json'),sync:true})
storage.setItemLife('time','5s')
storage.setItem('time',new Date())
// 从setItem开始计算生存时间 每次setItem后重置
// 过期后会返回空串，并写入文件

var test = setInterval(() => {
  let value = storage.getItem('time')
  console.log(value)
  if(!value){
    console.log('数据已过期')
    clearInterval(test)
  }
},1000)
