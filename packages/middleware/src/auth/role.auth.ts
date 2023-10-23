import { BaseAuth } from "./base.auth";

export enum roleAuthPermissionsType {
  ADMIN = 0,
  USER = 1
}

/**
 * @description: 角色权限
 * @return {*}
 */
class RoleAuth extends BaseAuth {
  constructor() {
    super(roleAuthPermissionsType.ADMIN);
  }

  check(cb?: Function, errcb?: Function, lv?: roleAuthPermissionsType): boolean {
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
