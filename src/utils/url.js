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
