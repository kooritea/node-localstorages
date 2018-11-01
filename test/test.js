const Storage = require('../index.js')
const path = require('path')

const storage = new Storage({filePath:path.join(__dirname, './data.json'),sync:true})
storage.setItem('time',new Date())
console.log(storage.getItem('time'))
