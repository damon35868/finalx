/**
 * @description: auth基类，用于被其他类实现
 * @return {*}
 */
export abstract class BaseAuth {
  protected level: any;
  protected lastCb: Function | undefined;

  constructor(level?: any) {
    this.level = level;
  }

  protected setLastCb(cb: Function) {
    this.lastCb = () => {
      cb();
      this.lastCb = undefined;
    };
    return true;
  }

  /**
   * @description: 监测用户是否具有相关权限
   * @return {*}
   */
  abstract check(cb?: Function, errcb?: Function, lv?: any): boolean;

  /**
   * @description: 获取权限
   * @return {*}
   */
  abstract getPermission(lv?: any): boolean;
}
