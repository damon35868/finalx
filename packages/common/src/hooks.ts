import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDidShow, getSystemInfo, useReachBottom as useOriginReachBottom, getMenuButtonBoundingClientRect } from "@tarojs/taro";
import { atom, useAtom } from "jotai";
import { WsEventFunc, wsClient } from "./ws";

/**
 * 页面触底无限滚动
 * @param model useRequest 返回的数据模型
 * @param pageKey 分页页码的 storeKey(在搜索，切换tab场景中需将页码置为1)
 * @param varFn 变量函数
 */
export function useLoadMore(model: any, page: number, varFn?: Function) {
  const { data, run, mutate, loading } = model;
  const { hasNextPage } = data || {};
  page = page === 1 ? 2 : page || 1;

  // 页面或组件销毁时将页码置为1
  useEffect(() => {
    return () => {
      page = 1;
    };
  }, []);

  async function refetchData() {
    if (loading || !hasNextPage) return;
    await run(varFn ? varFn(page) : { page });

    mutate((newData: any) => {
      return {
        ...newData,
        items: [...data.items, ...newData.items]
      };
    });
    page += 1;
  }
  useOriginReachBottom(refetchData);

  return { refetchData };
}

/**
 * 页面显示刷新数据（该 hook 不可用到条件渲染的子组件中，比如 if 切换或者 map 渲染）
 * @param model useRequest 返回的对象
 * @param variables 刷新数据的变量
 */
export function useShowFetch(model: any, opt = {}, cb?: () => any) {
  const { refresh } = model;
  useDidShow(() => {
    if (!refresh) return;
    refresh(opt);
    cb && cb();
  });
}

// 系统高度
const systemInfoAtom = atom({
  windowHeight: 670,
  statusBarHeight: 20,
  screenHeight: 736,
  inputHeight: 0,
  windowWidth: 414,
  screenWidth: 414
});
interface systemInfoType {
  windowHeight: number;
  statusBarHeight: number;
  screenHeight: number;
  inputHeight: number;
  windowWidth: number;
  screenWidth: number;
}
export function useSystemSize() {
  const [size, setSystemSize]: [systemInfoType, any] = useAtom<systemInfoType>(systemInfoAtom);

  let { windowHeight, screenHeight } = size;
  return { ...size, customNavHeight: screenHeight - windowHeight, setSystemSize };
}

const systemAtom = atom(null);
export function useSystem() {
  const [system, setSystem]: [string | null, any] = useAtom<string | null>(systemAtom);
  return { system, setSystem };
}

/**
 * 系统尺寸
 */
let tryGetDeviceInfoCount = 3;
export function useSystemInfo() {
  const { setSystem } = useSystem();
  const { setSystemSize } = useSystemSize();

  useEffect(() => {
    getSystemInfo({
      success(systemInfo: any): any {
        setSystemSize(systemInfo);
        setSystem(systemInfo.platform);

        let { statusBarHeight, windowHeight, screenHeight, windowWidth, screenWidth } = systemInfo;
        try {
          const { top, bottom } = getMenuButtonBoundingClientRect();
          if (top === bottom || top === 0 || bottom === 0 || statusBarHeight === 0) {
            tryGetDeviceInfoCount = tryGetDeviceInfoCount - 1;
            if (tryGetDeviceInfoCount < 0) throw new Error();
            return getSystemInfo();
          }
          const paddingTop = top - statusBarHeight;
          windowHeight = screenHeight - bottom - paddingTop;
        } catch (e) {
          windowHeight = screenHeight - 68;
        }

        setSystemSize({
          windowHeight,
          statusBarHeight,
          screenHeight,
          windowWidth,
          screenWidth
        });
      }
    });
  }, []);
}

export function useEventListener(evenName: string, eventAction: WsEventFunc) {
  const timer = useRef<any>();
  const fnRef = useRef<WsEventFunc>(eventAction);
  const [isRegistered, setIsRegistered] = useState(false);

  useLayoutEffect(() => {
    fnRef.current = eventAction;
  });

  const eventHandler = (e: any) => {
    fnRef.current(e);
  };

  useEffect(() => {
    if (isRegistered) return timer.current && clearInterval(timer.current);

    timer.current = setInterval(() => {
      if (!wsClient.inited || !fnRef.current) return;

      setIsRegistered(true);
      wsClient.on(evenName, eventHandler);

      timer.current && clearInterval(timer.current);
    }, 100);
  }, []);

  useEffect(
    () => () => {
      wsClient.off(evenName, eventHandler);
    },
    []
  );
}
