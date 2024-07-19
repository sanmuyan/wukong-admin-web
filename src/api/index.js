import request from '@/utils/request'

export const restFull = (url, method, data, headers) => {
  if (method === 'GET') {
    return request({
      url: url,
      method: method,
      params: data,
      headers: headers
    })
  } else {
    return request({
      url: url,
      method: method,
      data: data,
      headers: headers
    })
  }
}
