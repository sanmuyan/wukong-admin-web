import { APP_NAME_LOGO } from '@/constant'

export default {
  login: {
    title: APP_NAME_LOGO + ' 登录',
    loginBtn: '登录系统',
    usernameRule: '用户名为必填项',
    passwordRule: '密码不能少于8位',
    loginSuccess: '登录成功',
    loginFail: '登录失败',
    otherLogin: '其他方式',
    isApproveLogin: '是否允许登录',
    mfaAppCodeDialogTitle: '请输入验证码',
    desc: `
    `
  },
  route: {
    home: '我的主页',
    profileManage: '账号资料',
    securityManage: '账号安全',
    user: '用户管理',
    userManage: '用户管理',
    roleManage: '用户角色',
    resourceManage: '权限资源',
    app: '应用管理',
    oauthManage: 'OAuth 应用',
    settings: '系统设置',
    settingsManage: '系统设置'
  },
  tagsView: {
    refresh: '刷新',
    closeRight: '关闭右侧',
    closeOther: '关闭其他'
  },
  navBar: {
    lang: '国际化',
    home: '首页',
    logout: '退出登录',
    logoutSuccess: '退出成功',
    logoTitle: APP_NAME_LOGO,
    switchLangSuccess: '切换语言成功'
  },
  appMain: {
    success: '成功',
    updateSuccess: '更新成功',
    createSuccess: '创建成功',
    isRequired: '必填项'
  },
  button: {
    cancel: '取消',
    confirm: '确定',
    approve: '批准',
    deny: '拒绝'
  },
  rules: {
    mustNumber: '请输入数字'
  }
}
