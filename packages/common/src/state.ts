import { atom, useAtom, createStore } from "jotai";
import { setItem } from "./utils";
import { log } from "./log";
import { LocalStorageKeys } from "./enums";
import { config } from "./config";

const tokenAtom = atom<null | string>(null);

export const userAuthAtom = atom<boolean>(false);
export const store = createStore();

export function useToken() {
  const [token] = useAtom<null | string>(tokenAtom);
  return { token };
}

export function setUserAuth(auth: boolean | undefined) {
  store.set(userAuthAtom, auth);
}

function getUserAuth() {
  return store.get(userAuthAtom);
}

export function useUserAuthModal() {
  return {
    userAuthModalStatus: getUserAuth(),
    setUserAuthModalStatus: setUserAuth
  };
}

export function useInitToken() {
  const [, setTokenFn]: [string | null, any] = useAtom<null | string>(tokenAtom);

  const setToken = (token: string) => {
    if (!token) {
      config.log && log.error("[缺少token]");
      return;
    }
    setItem(LocalStorageKeys.token, token);
    setTokenFn(token);
    config.log && log.success("[配置TOKEN成功]");
  };

  return setToken;
}
