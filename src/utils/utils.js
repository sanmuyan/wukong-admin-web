export const resetObjValue = (obj) => {
  Object.keys(obj).forEach(key => {
    obj[key] = ''
  })
}

export const cloneObj = (obj) => {
  return JSON.parse(JSON.stringify(obj))
}

export const fillObjValue = (srcObj = {}, targetObj = {}) => {
  Object.keys(srcObj).forEach(key => {
    targetObj[key] = srcObj[key]
  })
}
