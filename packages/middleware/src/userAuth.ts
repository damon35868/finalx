import { getItem, setUserAuth, config } from "@finalx/common";
import { LocalStorageKeys } from "./enums";

interface UserAuthConfig {
  filterKey?: {
    phone: string;
    info: string;
  };
}

enum permissionsType {
  USER = 1,
  PHONE = 2
}

class UserAuth {
  private filterKey = {
    phone: "mobilePhone",
    info: "name"
  };
  private level = permissionsType.PHONE;
  private lastCb: Function | undefined;
  private userInfo = getItem(LocalStorageKeys.userInfo);

  constructor(config: UserAuthConfig | undefined) {
    const { filterKey } = config || {};
    filterKey && (this.filterKey = filterKey);
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

  // 暂时不需要校验用户信息权限
  getUserPermission() {
    const userInfo = this.userInfo || getItem(LocalStorageKeys.userInfo);
    const info = userInfo[this.filterKey.info];
    return !!info;
  }

  public getPhonePermission(): boolean {
    const userInfo = this.userInfo || getItem(LocalStorageKeys.userInfo);
    const mobilePhone = userInfo[this.filterKey.phone];
    return !!mobilePhone;
  }
}

export const userAuth = new UserAuth(config.middleware?.userAuth);
