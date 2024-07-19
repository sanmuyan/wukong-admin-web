import { LANG, TAGS_VIEW } from '@/constant'
import { getLocalItem, setLocalItem } from '@/utils/storage'

export default {
  namespaced: true,
  state: () => ({
    sidebarOpened: true,
    language: getLocalItem(LANG) || 'zh',
    tagsViewList: getLocalItem(TAGS_VIEW) || []
  }),
  mutations: {
    triggerSidebarOpened (state) {
      state.sidebarOpened = !state.sidebarOpened
    },
    setLanguage (state, lang) {
      setLocalItem(LANG, lang)
      state.language = lang
    },
    /**
     * 添加 tags
     */
    addTagsViewList (state, tag) {
      const isFind = state.tagsViewList.find(item => {
        return item.path === tag.path
      })
      // 处理重复
      if (!isFind) {
        state.tagsViewList.push(tag)
        setLocalItem(TAGS_VIEW, state.tagsViewList)
      }
    },
    /**
     * 为指定的 tag 修改 title
     */
    changeTagsView (state, {
      index,
      tag
    }) {
      state.tagsViewList[index] = tag
      setLocalItem(TAGS_VIEW, state.tagsViewList)
    },
    /**
     * 删除 tag
     * @param {type: 'other'||'right'||'index', index: index} payload
     */
    removeTagsView (state, payload) {
      if (payload.type === 'index') {
        state.tagsViewList.splice(payload.index, 1)
      } else if (payload.type === 'other') {
        state.tagsViewList.splice(
          payload.index + 1,
          state.tagsViewList.length - payload.index + 1
        )
        state.tagsViewList.splice(0, payload.index)
      } else if (payload.type === 'right') {
        state.tagsViewList.splice(
          payload.index + 1,
          state.tagsViewList.length - payload.index + 1
        )
      }
      setLocalItem(TAGS_VIEW, state.tagsViewList)
    }
  }
}
