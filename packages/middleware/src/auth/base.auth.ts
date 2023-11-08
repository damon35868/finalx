import { TFilterKey } from "@finalx/common";

/**
 * @description: Auth基类，用于被其他类实现
 * @return {*}
 */
export abstract class BaseAuth {
  protected lastCb: Function | undefined;

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
  abstract check(cb?: Function, errcb?: Function, filterKey?: TFilterKey): boolean;

  /**
   * @description: 获取权限
   * @return {*}
   */
  abstract getPermission(filterKey: TFilterKey, config?: any): boolean;
}
