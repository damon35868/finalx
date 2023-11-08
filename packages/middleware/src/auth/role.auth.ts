import { BaseAuth } from "./base.auth";
import { TFilterKey } from "@finalx/common";

/**
 * @description: 角色权限
 * @return {*}
 */
class RoleAuth extends BaseAuth {
  check(cb?: Function, errcb?: Function, filterKey?: TFilterKey): boolean {
    return false;
  }

  getPermission(filterKey: TFilterKey, config?: any): boolean {
    return false;
  }
}

export const roleAuth = new RoleAuth();
