import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zh from 'element-plus/lib/locale/lang/zh-cn'
import en from 'element-plus/lib/locale/lang/en'
import store from '@/store'

export default (app) => {
  app.use(ElementPlus, {
    locale: store.getters.language === 'en' ? en : zh
  })
}
