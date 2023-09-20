import { getItem, setUserAuth, config, isEmpty } from "@finalx/common";
import { LocalStorageKeys } from "../enums";
import { BaseAuth } from "./base.auth";

export enum permissionsType {
  ALL = 0,
  USER = 1,
  PHONE = 2
}

class UserAuth extends BaseAuth {
  constructor() {
    super(permissionsType.ALL);
  }

  private get userInfo() {
    return getItem(LocalStorageKeys.userInfo);
  }

  private get filterKey() {
    const newFilterKey = !isEmpty(config.middleware?.userAuth.filterKey)
      ? config.middleware?.userAuth.filterKey
      : {
          phone: "mobilePhone",
          info: "name"
        };

    return Object.assign(
      {
        phone: "mobilePhone",
        info: "name"
      },
      newFilterKey
    );
  }

  /**
   * @description: 查看授权
   * @return {*}
   */
  public check(cb?: Function, errcb?: Function, lv?: permissionsType): boolean {
    cb && this.setLastCb(cb);
    const level = lv || this.level;
    const hasAuth = this.getPermission(level);

    setUserAuth(!hasAuth);

    if (hasAuth) {
      if (this.lastCb) {
        this.lastCb();
        return true;
      }

      cb && cb();
      return true;
    }

    errcb && errcb();
    return false;
  }

  public getPermission(lv?: permissionsType) {
    const level = lv || this.level;

    switch (level) {
      case permissionsType.ALL: {
        return this.getInfoPermission() && this.getPhonePermission();
      }
      case permissionsType.USER: {
        return this.getInfoPermission();
      }
      case permissionsType.PHONE: {
        return this.getPhonePermission();
      }

      default:
        return false;
    }
  }

  private getInfoPermission() {
    const info = this.userInfo[this.filterKey.info];
    return !!info;
  }

  private getPhonePermission(): boolean {
    const mobilePhone = this.userInfo[this.filterKey.phone];
    return !!mobilePhone;
  }
}

export const userAuth = new UserAuth();
