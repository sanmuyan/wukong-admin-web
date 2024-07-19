export const setCookie = (name, value, days) => {
  if (typeof value === 'object') {
    value = JSON.stringify(value)
  }
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export const removeCookie = (name) => {
  const date = new Date()
  date.setTime(date.getTime() - 1000)
  const expires = '; expires=' + date.toUTCString()
  document.cookie = name + '=' + expires + '; path=/'
}

export const removeAllCookie = () => {
  const keys = document.cookie.match(/[^ =;]+(?==)/g)
  const date = new Date()
  date.setTime(date.getTime() - 1000)
  const expires = '; expires=' + date.toUTCString()
  if (keys) {
    for (let i = keys.length; i--;) {
      document.cookie = keys[i] + '=' + expires + '; path=/'
    }
  }
}

export const getCookie = (name) => {
  let val = null
  const nameEQ = name + '='
  const cookieList = document.cookie.split(';')
  for (let i = 0; i < cookieList.length; i++) {
    let cookie = cookieList[i]
    if (cookie[0] === ' ') cookie = cookie.substring(1, cookie.length)
    if (cookie.substring(0, nameEQ.length) === nameEQ) {
      val = cookie.substring(nameEQ.length, cookie.length)
      break
    }
  }
  try {
    return JSON.parse(val)
  } catch (e) {
    return val
  }
}
