import { getItem, setUserAuth, config, isEmpty } from "@finalx/common";
import { LocalStorageKeys } from "./enums";

// interface UserAuthConfig {
//   filterKey?: {
//     phone: string;
//     info: string;
//   };
// }

export enum permissionsType {
  ALL = 0,
  USER = 1,
  PHONE = 2
}

class UserAuth {
  private level = permissionsType.ALL;
  private lastCb: Function | undefined;

  get userInfo() {
    return getItem(LocalStorageKeys.userInfo);
  }

  get filterKey() {
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
  checkUserAuth(cb?: Function, errcb?: Function, lv?: permissionsType): boolean {
    cb && this.setLastCb(cb);
    const level = lv || this.level;
    const hasAuth = this.getUserPermissions(level);

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

  setLastCb(cb: Function) {
    this.lastCb = () => {
      cb();
      this.lastCb = undefined;
    };
    return true;
  }

  getUserPermissions(lv?: permissionsType) {
    const level = lv || this.level;

    switch (level) {
      case permissionsType.ALL: {
        return this.getUserPermission() && this.getPhonePermission();
      }
      case permissionsType.USER: {
        return this.getUserPermission();
      }
      case permissionsType.PHONE: {
        return this.getPhonePermission();
      }

      default:
        return false;
    }
  }

  getUserPermission() {
    const info = this.userInfo[this.filterKey.info];
    return !!info;
  }

  public getPhonePermission(): boolean {
    const mobilePhone = this.userInfo[this.filterKey.phone];
    return !!mobilePhone;
  }
}

export const userAuth = new UserAuth();
