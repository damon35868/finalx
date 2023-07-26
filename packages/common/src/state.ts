import { setItem } from "./utils";
import { log } from "./log";
import { LocalStorageKeys } from "./enums";
import { config } from "./config";
import { create } from "zustand";

const useTokenStore = create(set => ({
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

const userAuthStore = create(set => ({ state: false }));

export function setUserAuth(auth: boolean | undefined) {
  userAuthStore.setState({ state: auth });
}

export function useUserAuthModal() {
  const userAuthModalStatus = userAuthStore((state: any) => state.state);

  return {
    userAuthModalStatus,
    setUserAuthModalStatus: userAuthStore.setState
  };
}

export function useToken() {
  const token = useTokenStore((state: any) => state.state);
  const setToken = useTokenStore((state: any) => state.setter);
  return { token, setToken };
}
