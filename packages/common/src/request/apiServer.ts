import { request } from "@tarojs/taro";
import { getItem } from "../utils";
import { LocalStorageKeys } from "../enums";
import { config } from "../config";

interface requestProps {
  url?: string;
  data?: any;
  method?: any;
  coverUrl?: string;
}

export function apiServer({ url, data, method = "POST", coverUrl }: requestProps): Promise<{
  code: number | string;
  message?: string;
  data: any;
  msg: string | { code: string; message: string };
}> {
  return new Promise((resolve, reject) => {
    request({
      data,
      method,
      timeout: config.request?.timeout,
      url: coverUrl || config.request?.baseUrl + (url || ""),
      header: {
        authorization: (config.request?.bearerToken ? "Bearer " : "") + getItem(LocalStorageKeys.token) || null,
        ...(config.request?.header || {})
      },
      success: res => {
        const { statusCode } = res;
        if (statusCode === 200) return resolve(res.data);
        reject("网络错误");
      },
      fail: e => {
        reject(e);
      }
    });
  });
}
