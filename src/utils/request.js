import axios from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'
import { getUrlFullPath, getUrlPath } from '@/utils/url'
import { whiteList } from '@/router'

const service = axios.create({
  baseURL: '/api',
  timeout: 5000
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers.Authorization = store.getters.token
    }
    return config
  },
  error => {
    ElMessage.error(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    const {
      success,
      code,
      message
    } = response.data
    if (success) {
      return response.data
    } else {
      ElMessage.error(message)
      if (code === 1401) {
        if (!whiteList.includes(getUrlPath(window.location.href))) {
          store.dispatch('login/logout').catch()
          store.commit('permission/setBackRoute', getUrlFullPath(window.location.href))
        }
      }
      return Promise.reject(response.data)
    }
  },
  error => {
    ElMessage.error(error)
    return Promise.reject(error)
  }
)

export default service
