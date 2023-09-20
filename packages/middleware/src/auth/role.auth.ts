import { BaseAuth } from "./base.auth";

export enum permissionsType {
  ADMIN = 0,
  USER = 1
}

/**
 * @description: 角色权限
 * @return {*}
 */
class RoleAuth extends BaseAuth {
  check(cb?: Function, errcb?: Function, lv?: permissionsType): boolean {
    const level = lv || this.level;

    switch (level) {
    }

    return false;
  }

  getPermission(lv?: any): boolean {
    return false;
  }
}

export const roleAuth = new RoleAuth();
