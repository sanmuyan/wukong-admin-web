import { createStore } from 'vuex'
import login from '@/store/modules/login'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import security from '@/store/modules/security'

export default createStore({
  getters,
  modules: {
    login,
    app,
    permission,
    security
  }
})
