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
      config.headers.Authorization = `Bearer ${store.getters.token}`
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
      message,
      data
    } = response.data
    if (success) {
      return data
    } else {
      ElMessage.error(message)
      if (code === 1401) {
        if (!whiteList.includes(getUrlPath(window.location.href))) {
          store.dispatch('login/logout').catch()
          store.dispatch('permission/setBackRoute', getUrlFullPath(window.location.href)).catch()
        }
      }
      return Promise.reject(new Error(message))
    }
  },
  error => {
    ElMessage.error(error)
    return Promise.reject(error)
  }
)

export default service
