import { globalConfig } from '@finalx/common'

/**
 * @description: 全局初始化配置
 **/

  globalConfig({
    log: true,
    request: {
      // 请求头
      // header:{}
      wsCheckUser: false,
      // ENV -> 如需调试，可手动覆盖环境，上线前记得改回自动模式
      baseUrl: 'https://api.com',
      wsUrl: 'wss://api.com',
    },
    middleware: {
      userAuth: {
        filterKey: {
          info: 'nickName',
          phone: 'mobilePhone',
        },
      },
    },
  })
