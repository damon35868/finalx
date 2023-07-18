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
    rule?: () => boolean;
  }) {
    try {
      const res = await apiFn();

      if (rule) {
        if (!rule()) throw new Error(res.msg && typeof res.msg === "object" ? res.msg.message : `${text}失败`);
      } else {
        const { code, message } = res || {};
        if (code === ErrorCode.error) throw new Error(message);
        if (code === -1) {
          throw new Error(res.msg && typeof res.msg === "object" ? res.msg.message : `${text}失败`);
        }
      }

      callback && callback(res);
      showToast && text && toast(`${text}成功`);
    } catch (e) {
      onError && onError(e);
      showToast && toast(errorText || e.message);
    }
  }
}

export const helper = new Helper();
