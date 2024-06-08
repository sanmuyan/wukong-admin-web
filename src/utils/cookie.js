export const setCookie = (name, value, days) => {
  let expires = ''
  if (days) {
    const date = new Date()
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000))
    expires = '; expires=' + date.toUTCString()
  }
  document.cookie = name + '=' + (value || '') + expires + '; path=/'
}

export const getCookie = (name) => {
  const nameEQ = name + '='
  const cookieList = document.cookie.split(';')
  for (let i = 0; i < cookieList.length; i++) {
    let cookie = cookieList[i]
    if (cookie[0] === ' ') cookie = cookie.substring(1, cookie.length)
    if (cookie.substring(0, nameEQ.length) === nameEQ) {
      return cookie.substring(nameEQ.length, cookie.length)
    }
  }
  return null
}
