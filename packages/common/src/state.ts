import { atom, useAtom, createStore } from "jotai";
import { setItem } from "./utils";
import { log } from "./log";
import { LocalStorageKeys } from "./enums";
import { config } from "./config";
import { writeAtom } from "jotai-nexus";

const tokenAtom = atom<null | string>(null);

const userAuthAtom = atom<boolean>(false);
const store = createStore();

export function useToken() {
  const [token] = useAtom<null | string>(tokenAtom);
  return { token };
}

export function setUserAuth(auth: boolean | undefined) {
  setItem("userAuth", auth);
  writeAtom(userAuthAtom, auth);
}

export function useUserAuthModal() {
  const [userAuthModalStatus, setFn] = useAtom(userAuthAtom);

  const setUserAuthModalStatus = (auth: boolean) => {
    setItem("userAuth", auth);
    setFn(auth);
  };

  return {
    userAuthModalStatus,
    setUserAuthModalStatus
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
