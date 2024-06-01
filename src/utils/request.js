import axios from 'axios'
import store from '@/store'
import { ElMessage } from 'element-plus'

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
        store.dispatch('user/logout').catch()
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
