import variables from '@/styles/variables.module.scss'

const getters = {
  token: state => state.login.token,
  accountProfile: state => state.login.accountProfile,
  hasAccountProfile: state => {
    return JSON.stringify(state.login.accountProfile) !== '{}'
  },
  cssVar: state => variables,
  sidebarOpened: state => state.app.sidebarOpened,
  language: state => state.app.language,
  tagsViewList: state => state.app.tagsViewList,
  backRoute: state => state.permission.backRoute,
  clientEncryptPublicKey: state => state.security.clientEncryptPublicKey,
  rememberLogin: state => state.login.rememberLogin
}

export default getters
