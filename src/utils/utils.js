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

export const insertAfterKeywords = (val, keywords, insert) => {
  let s = val
  const vals = val.split(keywords)
  if (vals.length === 2) {
    s = vals[0] + keywords + insert + vals[1]
  }
  return s
}
