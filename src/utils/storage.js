/*
 * @Author: Leon Zhang
 * @Date: 2018-07-25 15:23:09
 * @Last Modified by: LeonZhang
 * @Last Modified time: 2019-07-30 17:44:38
 */
class Storage {
  storage = window.localStorage
  ms

  constructor(ms = 'test') {
    this.ms = ms
  }

  set = (key, value) => {
    let mydata = this.storage.getItem(this.ms)
    if (!mydata) {
      this.init()
      mydata = this.storage.getItem(this.ms)
    }
    mydata = JSON.parse(mydata)
    mydata.data[key] = value
    this.storage.setItem(this.ms, JSON.stringify(mydata))
    return mydata.data
  }

  get = key => {
    let mydata = this.storage.getItem(this.ms)
    if (!mydata) {
      return false
    }
    mydata = JSON.parse(mydata)
    return mydata.data[key]
  }

  remove = key => {
    let mydata = this.storage.getItem(this.ms)
    if (!mydata) {
      return false
    }
    mydata = JSON.parse(mydata)
    delete mydata.data[key]
    this.storage.setItem(this.ms, JSON.stringify(mydata))
    return mydata.data
  }

  clear = () => this.storage.removeItem(this.ms)

  init = () => this.storage.setItem(this.ms, '{"data":{}}')
}

export default Storage
