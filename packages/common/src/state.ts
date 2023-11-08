import { setItem } from "./utils";
import { log } from "./log";
import { LocalStorageKeys } from "./enums";
import { config } from "./config";
import { create } from "zustand";

interface initStateType {
  token: string | null;
  userInfo: any | null;
  middlewareData: any | null;
  setter: (val: { token?: string; userInfo?: any }) => any;
}

export const initStore = create<initStateType>(set => ({
  token: null,
  userInfo: null,
  middlewareData: null,
  setter: ({ token, userInfo, middlewareData }: { token?: string; userInfo?: any; middlewareData?: any }) => {
    if (token !== undefined) {
      set({ token });
      setItem(LocalStorageKeys.token, token);
    }

    if (userInfo !== undefined) {
      set({ userInfo });
      setItem(LocalStorageKeys.userInfo, userInfo);
    }

    if (middlewareData !== undefined) {
      set({ middlewareData });
      setItem(LocalStorageKeys.middlewareData, middlewareData);
    }

    token && userInfo && config.log && log.success("[初始化State成功]");
  }
}));

export function getMiddlewareData(key: string) {
  const { middlewareData } = initStore.getState() || {};
  return (middlewareData || {})[key];
}

export const authStore = create(set => ({
  state: false,
  setter: (auth: boolean) => set({ state: auth })
}));

export function setUserAuth(auth: boolean | undefined) {
  authStore.setState({ state: auth });
}

export interface systemInfoStateType {
  windowHeight: number;
  statusBarHeight: number;
  screenHeight: number;
  inputHeight?: number;
  windowWidth: number;
  screenWidth: number;
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
  setter: (val: systemInfoStateType) => set({ state: val })
}));

interface platformType {
  state: string | null;
  setter: (val: string) => any;
}
export const platformStore = create<platformType>((set: any) => ({
  state: null,
  setter: (val: string) => set({ state: val })
}));
