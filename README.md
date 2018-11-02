# node-storages

在node 环境下简易的数据存储

[![npm](https://img.shields.io/npm/v/node-storages.svg?style=flat)](https://www.npmjs.com/package/node-storages)

### 为什么不使用现有的 node-storage ?

因为我希望storage有一个可选的超时机制

```bash
npm install node-storages --save
```

```javascript
const storages = require('node-storages')
const path = require('path')

const storage = new Storage({filePath:path.join(__dirname, './data.json'),sync:true})
// 马上调用setItem需要sync设为true
// 否则需要等待storage对象读取文件结束后才能够使用 可根据实际情况设置
storage.setItem('time',new Date())
console.log(storage.getItem('time'))
```
