import variables from '@/styles/variables.module.scss'

const getters = {
  token: state => state.user.token,
  userProfile: state => state.user.userProfile,
  hasUserProfile: state => {
    return JSON.stringify(state.user.userProfile) !== '{}'
  },
  cssVar: state => variables,
  sidebarOpened: state => state.app.sidebarOpened,
  language: state => state.app.language,
  tagsViewList: state => state.app.tagsViewList
}

export default getters
