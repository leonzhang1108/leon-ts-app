/*
 * @Author: Leon Zhang
 * @Date: 2018-01-02 16:43:15
 * @Last Modified by: LeonZhang
 * @Last Modified time: 2019-07-30 17:43:05
 */

import Axios from 'axios'
import webConfig from '@constant/web-config'

const axiosModel = Axios.create({})
const ajaxMethod = ['get', 'post']
const api = {}

if (process.env.NODE_ENV === 'production') {
  axiosModel.defaults.baseURL = webConfig.web_prod_domain
} else {
  axiosModel.defaults.baseURL = '/'
}

axiosModel.defaults.headers.post['Content-Type'] = 'application/json'

axiosModel.defaults.timeout = 50000

// axiosModel.defaults.responseType = 'json'

axiosModel.defaults.transformRequest = [data => JSON.stringify(data)]

axiosModel.defaults.validateStatus = () => true

axiosModel.interceptors.request.use(config => {
  // 配置config
  config.headers.Accept = 'application/json, text/plain, */*'
  // config.headers.System = 'vue';
  // let token = Vue.localStorage.get('token');
  // if(token){
  //     config.headers.Token = token;
  // }
  return config
})

axiosModel.interceptors.response.use(response => {
  const data = response.data
  return Promise.resolve(data || {})
})

ajaxMethod.forEach(method => {
  // 数组取值的两种方式
  api[method] = (uri, data, config) =>
    new Promise(resolve => {
      let param = {}
      if (method === 'get') {
        param.params = data
      } else {
        param = data
      }
      axiosModel[method](uri, param, config).then(response => {
        /* 根据后台数据进行处理
         * 1 code===200   正常数据+错误数据     code!==200   网络异常等
         * 2 code===200   正常数据     code!==200   错误数据+网络异常等
         * 这里使用的是第一种方式
         * ......
         */
        resolve(response)
      })
    })
})

export default api
