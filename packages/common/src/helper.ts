import { ErrorCode } from "./enums";
import { toast } from "./utils";

/**
 * @description: 全局帮助类
 * @return {*}
 */
class Helper {
  /**
   * @description: 统一请求执行，包含错误处理
   * @return {*}
   */
  async run({
    apiFn,
    text,
    errorText,
    callback,
    showToast = true,
    onError,
    rule
  }: {
    apiFn: () => Promise<any>;
    text?: string;
    errorText?: string;
    callback?: (res: any) => any;
    onError?: (err: any) => any;
    showToast?: boolean;
    rule?: (val?: any) => boolean;
  }): Promise<any> {
    return new Promise(async (resove, reject) => {
      try {
        const res = await apiFn();

        if (rule) {
          if (!rule(res)) throw new Error(res.msg && typeof res.msg === "object" ? res.msg.message : `${text}失败`);
        } else {
          const { code, message } = res || {};
          if (code === ErrorCode.error) throw new Error(message);
          if (code === ErrorCode.server) {
            let message = "";
            if (res.msg) {
              typeof res.msg === "object" && (message = res.msg.message);
              if (typeof res.msg === "string") {
                try {
                  message = JSON.parse(res.msg).message;
                } catch (e) {
                  message = "网络错误";
                }
              }
            }

            throw new Error(message);
          }
        }

        resove(res);
        callback && callback(res);
        showToast && text && toast(`${text}成功`);
      } catch (e: any) {
        reject(e);
        onError && onError(e);
        showToast && toast(errorText || e.message);
      }
    });
  }
}

export const helper = new Helper();
