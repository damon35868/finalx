import { config } from "./config";
import { ErrorCode } from "./enums";
import { toast } from "./utils";

/**
 * @description: 全局帮助类
 * @return {*}
 */
class Helper {
  // 重试次数
  private timeoutCount: number = 0;
  // 重试最大次数
  private maxCount: number = 100;

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
          const { errorRule } = config.request || {};
          const { codeHandler, rejectHandler } = errorRule || {};
          const rejectMessage = (rejectHandler ? rejectHandler(res) : message) || "网络错误";

          if (codeHandler) {
            const status = codeHandler(code);
            if (status) throw new Error(rejectMessage);
          }

          if (code !== 0 && code !== 200) throw new Error(rejectMessage);
          if (code === ErrorCode.error) throw new Error(rejectMessage);
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

            throw new Error(message || rejectMessage);
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

  /**
   * @description: 接口重试方法
   * @return {*}
   */
  retry({
    rule,
    callback,
    maxCount = this.maxCount
  }: {
    maxCount?: number;
    callback: (val?: any) => Promise<any>;
    rule?: (val?: any) => boolean;
  }): Promise<any> {
    this.timeoutCount = 0;
    return new Promise(async (resove, reject) => {
      do {
        try {
          const data = await this.run({
            showToast: false,
            apiFn: () => callback()
          });

          const status = rule ? rule(data) : true;
          if (!status) throw new Error("返回值不符合要求");

          this.timeoutCount = maxCount + 1;
          resove({ msg: "重试成功", data });
        } catch (e) {
          this.timeoutCount++;
          console.log(`[--重试第${this.timeoutCount}次--]`);
          if (this.timeoutCount >= maxCount) reject(new Error("重试次数达到上限"));
        }
      } while (this.timeoutCount <= maxCount);
    });
  }
}

export const helper = new Helper();
