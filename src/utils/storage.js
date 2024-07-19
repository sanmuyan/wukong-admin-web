export const setLocalItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.localStorage.setItem(key, value)
}

export const getLocalItem = key => {
  const data = window.localStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const removeLocalItem = key => {
  window.localStorage.removeItem(key)
}

export const removeAllLocalItem = () => {
  window.localStorage.clear()
}

export const setSessionItem = (key, value) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  window.sessionStorage.setItem(key, value)
}

export const getSessionItem = key => {
  const data = window.sessionStorage.getItem(key)
  try {
    return JSON.parse(data)
  } catch (err) {
    return data
  }
}

export const removeSessionItem = key => {
  window.localStorage.removeItem(key)
}

export const removeAllSessionItem = () => {
  window.sessionStorage.clear()
}
