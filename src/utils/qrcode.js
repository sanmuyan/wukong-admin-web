import QRCode from 'qrcode'

export const generateQrCode = async (text) => {
  const opts = {
  }
  let imageUrl = ''
  await QRCode.toDataURL(text, opts)
    .then((url) => {
      imageUrl = url
    })
  return imageUrl
}
