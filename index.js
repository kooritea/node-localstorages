
const fs = require('fs')
const path = require('path')

class Storage {
  constructor({filePath,sync}) {
    this.filePath = filePath
    this.data = {}
    if(sync){
      this._loadFileDataSync()
    } else {
      this._loadFileData()
    }
  }

  setItem(key,value){
    if(!this.data[key]){
      this.data[key] = {}
    }
    this.data[key].value = value
    if(this.data[key].life){
      // 写入寿命结束时间
      this.data[key].timeout = (new Date()).valueOf() + parseInt(this.data[key].life)
    }
    this._saveFileData()
  }

  setItemLife(key,life){
    if(!this.data[key]){
      this.data[key] = {}
    }
    this.data[key].life = this._format(life)
    this._saveFileData()
  }

  getItem(key){
    if(!this.data[key].timeout || this.data[key].timeout > (new Date()).valueOf()){
      return this.data[key].value
    } else if(this.data[key].timeout){
      // 数据已过期
      this.data[key].value = ''
      return ''
    }
  }

  // 将时间格式化位整数形式
  _format(time){
    let seconds = 0
    while(time){
      let info = time.match(/\d{1,}(d|h|m|s)/)
      let sum = parseInt(info[0].substr(0,info[0].length-1))
      switch(info[1]){
        case('d'):
          seconds += sum*86400000
          break
        case('h'):
          seconds += sum*3600000
          break
        case('m'):
          seconds += sum*60000
          break
        case('s'):
          seconds += sum*1000
          break
      }
      time = time.replace(new RegExp(info[0], "g"),'')
    }
    return seconds
  }

  _saveFileData(){
    fs.writeFile(this.filePath, JSON.stringify(this.data),(err)=>{
      if(err){
        throw err
      }
    })
  }

  _saveFileDataSync(){
    fs.writeFileSync(this.filePath, JSON.stringify(this.data))
  }

  _loadFileData(){
    fs.stat(this.filePath,(err,fileStat) => {
      if(err){
        // not found dir or file
        fs.writeFile(this.filePath,'{}',(err,data) => {
          if(err){
            throw err
          } else {
            this.data = {}
          }
        })
      } else {
        if(fileStat.isDirectory()){
          fs.readFile(this.filePath + '/storage.json',(err,data) => {
            if(err){
              fs.writeFile(this.filePath + '/storage.json','{}',(err,data) => {
                if(err){
                  throw err
                } else {
                  this.data = {}
                }
              })
            } else {
              this.data = JSON.parse(data.toString() || '{}')
            }
            this.filePath = this.filePath + '/storage.json'
          })
        } else if(fileStat.isFile()){
          fs.readFile(this.filePath,(err,data) => {
            if(err){
              throw err
            } else {
              this.data = JSON.parse(data.toString() || '{}')
            }
          })
        }
      }
    })
  }
  _loadFileDataSync(){
    try{
      let fileStat = fs.statSync(this.filePath)
      if(fileStat){
        if(fileStat.isDirectory()){
          try{
            let result = fs.readFileSync(path.join(this.filePath,'/storage.json'))
            this.data = JSON.parse(result.toString() || '{}')
          } catch(e){
            fs.writeFileSync(path.join(this.filePath,'/storage.json'),'{}')
            this.data = {}
          }
          this.filePath = path.join(this.filePath,'/storage.json')
        } else if(fileStat.isFile()){
          try{
            let result = fs.readFileSync(this.filePath)
            this.data = JSON.parse(result.toString() || '{}')
          } catch(e){
            fs.writeFileSync(path.join(this.filePath),'{}')
            this.data = {}
          }
        }
      } else {
        fs.writeFileSync(this.filePath,'{}')
        this.data = {}
      }
    }
    catch(e){
      fs.writeFileSync(this.filePath,'{}')
      this.data = {}
    }
  }
}

module.exports = Storage
