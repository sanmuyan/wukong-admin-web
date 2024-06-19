export const passKeyDecode = (value) => {
  const stdBase64 = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
  return Uint8Array.from(atob(stdBase64), c => c.charCodeAt(0))
}

export const passKeyEncode = (value) => {
  return btoa(String.fromCharCode.apply(null, value))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}
