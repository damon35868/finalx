/**
 * @description: 全局配置
 **/

export default {
  request: {
    // 【覆盖模式，慎用！！！！ 上线前记得置空】--- 网络环境默认会自动获取当前环境设置 开发/生产模式， 如果手动输入该值优先级最高，将覆盖自动获取模式
    baseUrl: '',
    wsUrl: '',
  },
  user: {
    // 数据相关
    mockId: null, //模拟用户id
  },
}
