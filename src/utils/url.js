export const urlToParamsObj = (url) => {
  url = url.replace('/#/', '/')
  const urlObj = new URL(url)
  const params = new URLSearchParams(urlObj.search)
  const paramsObj = {}
  params.forEach((value, key) => {
    paramsObj[key] = value
  })
  return paramsObj
}

export const getUrlPath = (url) => {
  url = url.replace('/#/', '/')
  const urlObj = new URL(url)
  return urlObj.pathname
}

export const getUrlFullPath = (url) => {
  url = url.replace('/#/', '/')
  const urlObj = new URL(url)
  return urlObj.pathname + urlObj.search
}
