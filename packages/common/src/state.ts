import { setItem } from "./utils";
import { log } from "./log";
import { LocalStorageKeys } from "./enums";
import { config } from "./config";
import { create } from "zustand";

export const tokenStore = create(set => ({
  state: null,
  setter: (token: string) => {
    if (!token) {
      config.log && log.error("[缺少token]");
      return;
    }
    set(token);
    setItem(LocalStorageKeys.token, token);
    config.log && log.success("[配置TOKEN成功]");
  }
}));

export const authStore = create(set => ({
  state: false,
  setter: (auth: boolean) => set(auth)
}));

export function setUserAuth(auth: boolean | undefined) {
  authStore.setState({ state: auth });
}

export interface systemInfoStateType {
  windowHeight?: number;
  statusBarHeight?: number;
  screenHeight?: number;
  inputHeight?: number;
  windowWidth?: number;
  screenWidth?: number;
}
interface systemInfoType {
  state: systemInfoStateType;
  setter: (val: systemInfoStateType) => any;
}

// 系统高度
export const systemInfoStore = create<systemInfoType>((set: any) => ({
  state: {
    windowHeight: 670,
    statusBarHeight: 20,
    screenHeight: 736,
    inputHeight: 0,
    windowWidth: 414,
    screenWidth: 414
  },
  setter: (val: systemInfoStateType) => set(val)
}));

interface platformType {
  state: string | null;
  setter: (val: string) => any;
}
export const platformStore = create<platformType>((set: any) => ({
  state: null,
  setter: (val: string) => set(val)
}));
