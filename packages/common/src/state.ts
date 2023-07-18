import { atom, useAtom, createStore } from "jotai";
import { setItem } from "./utils";
import { log } from "./log";
import { LocalStorageKeys } from "./enums";
import { config } from "./config";

const tokenAtom = atom<null | string>(null);

const userAuthAtom = atom<boolean | undefined>(undefined);

export function useToken() {
  const [token] = useAtom(tokenAtom);
  return { token };
}

export function setUserAuth(auth: boolean | undefined) {
  const store = createStore();
  setItem("userAuth", auth);
  store.set(userAuthAtom, auth);
}

export function useInitToken() {
  const [, setTokenFn] = useAtom(tokenAtom);

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
