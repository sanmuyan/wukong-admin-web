import i18n from '@/i18n'

export const validatePassword = () => {
  return (rule, value, callback) => {
    if (value.length < 8) {
      callback(new Error(i18n.global.t('msg.login.passwordRule')))
    } else {
      callback()
    }
  }
}

const isNumber = (value) => {
  return /^\d+$/.test(value)
}

export const validateNumber = () => {
  return (rule, value, callback) => {
    if (!isNumber(value)) {
      callback(new Error(i18n.global.t('msg.rules.mustNumber')))
    } else {
      callback()
    }
  }
}
