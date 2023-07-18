import { clearStorageSync, getStorageSync, removeStorageSync, setStorageSync, reLaunch, showToast, uploadFile, navigateBack } from "@tarojs/taro";
import { LocalStorageKeys } from "./enums";

/**
 * 格式化日期
 * @param date
 * @param fmt
 * @returns
 */
export function formatDate(date: Date = new Date(), fmt: string = "yyyy-MM-dd hh:mm:ss") {
  const o: any = {
    "M+": date.getMonth() + 1, //月份
    "d+": date.getDate(), //日
    "h+": date.getHours(), //小时
    "m+": date.getMinutes(), //分
    "s+": date.getSeconds(), //秒
    "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    S: date.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
    }
  }
  return fmt;
}

/**
 * @description 获取缩放图片
 * @param url 目标图片
 * @param w 宽
 * @param h 高
 */
export function getScaleImageURL(urls: string, w: number, h: number) {
  if (!urls) return "";
  const urlArr = urls?.split(",");
  const url = urlArr[0];
  if (!url) return "";
  return `${url}?imageMogr2/thumbnail/${w}x${h}`;
}

/**
 * @description: 判断是否是今天
 * @param {number} timer 时间戳
 * @return {boolean}
 */
export function isToday(timer: number | string): boolean {
  return new Date(timer).toDateString() === new Date().toDateString();
}

/**
 * @description: 获取路由中的参数
 * @param {string} query
 * @param {string} variable
 * @param {boolean} isExclude
 * @return {*}
 */
export function getQueryVariable(query: string, variable: string, isExclude?: boolean) {
  const vars = query.split("?");

  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split("=");
    if (isExclude) {
      pair[0] == variable && vars.splice(i, 1);
    } else {
      if (pair[0] == variable) return decodeURIComponent(pair[1]);
    }
  }

  if (variable && !isExclude) return undefined;
  return { query: decodeURIComponent(vars.join("&")) };
}

/**
 * @description: 数字转中文数字
 * @param {number} num
 * @return {*}
 */
export const changeNumToHan = (num: number) => {
  let arr1 = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  let arr2 = ["", "十", "百", "千", "万", "十", "百", "千", "亿", "十", "百", "千", "万", "十", "百", "千", "亿"];
  if (!num || isNaN(num)) return "零";
  let english = num.toString().split("");
  let result = "";
  for (let i = 0; i < english.length; i++) {
    let des_i = english.length - 1 - i; // 倒序排列设值
    result = arr2[i] + result;
    let arr1_index = english[des_i];
    result = arr1[arr1_index as unknown as number] + result;
  }
  result = result.replace(/零(千|百|十)/g, "零").replace(/十零/g, "十"); // 将【零千、零百】换成【零】 【十零】换成【十】
  result = result.replace(/零+/g, "零"); // 合并中间多个零为一个零
  result = result.replace(/零亿/g, "亿").replace(/零万/g, "万"); // 将【零亿】换成【亿】【零万】换成【万】
  result = result.replace(/亿万/g, "亿"); // 将【亿万】换成【亿】
  result = result.replace(/零+$/, ""); // 移除末尾的零
  // 将【一十】换成【十】
  result = result.replace(/^一十/g, "十");
  return result;
};

/**
 * @description: 是否为空
 * @param {any} variable
 * @return {*}
 */
export function isEmpty(variable: any) {
  const emptys = ["", undefined, "undefined", null, "null", false, "false", "{}"];
  return typeof variable === "object" && variable !== null ? (Object.values(variable).length ? false : true) : emptys.includes(variable) || false;
}

/**
 * @description: 扁平化数组
 * @param {any} arr 原数组
 * @param {string} key 子集条件key，默认children
 * @param {boolean} deleteVal 是否删除key
 * @return {*}
 */
export function flatArr(arr: any[], key: string = "children", deleteVal: boolean = true) {
  return arr.reduce((prev, curr) => {
    const value = curr[key];
    if (deleteVal) delete curr[key];
    prev.push(curr);
    if (Array.isArray(value) && value.length) {
      prev.push(...flatArr(value));
    }
    return prev;
  }, []);
}

/**
 * @description: 格式化文章内容
 * @param {*} content
 * @return {*}
 */
export const formatContent = (content: string = "") => {
  return content
    .replace(/width=/g, "")
    .replace(/height=/g, "")
    .replace(/<img src=/g, '<img width="100%" style="pointer-events:none;" src=')
    .replace(/class="ql-align-center"/g, 'style="text-align: center" class="ql-align-center"')
    .replace(/<p>/g, '<p style="margin-bottom: 1em">');
};

export function toast(title: string, options?: any) {
  return showToast({ title, ...Object.assign({ icon: "none" }, options) });
}

/**
 * @description: 倒计时 -> 秒
 * @return {*}
 */

let timer: string | number | NodeJS.Timeout | undefined;
export function clearCountDown() {
  timer && clearInterval(timer);
}
export async function countDownBySecond(second: number, cb?: (time: number) => any): Promise<boolean> {
  let secondVal = second;
  clearCountDown();

  return new Promise(resove => {
    timer = setInterval(() => {
      if (secondVal <= 0) {
        clearInterval(timer);
        resove(true);
        cb && cb(0);
        return;
      }

      cb && cb(secondVal);
      secondVal--;
    }, 1000);
  });
}

/**
 * @description: 统一文件上传器
 * @param {string} filePath
 * @return {*}
 */
export const uploader = (url: string, filePath: string) => {
  return new Promise((resove, reject) => {
    uploadFile({
      filePath,
      name: "file",
      url,
      header: {
        authorization: getItem(LocalStorageKeys.token) || null
      },

      success: (res: any) => {
        const data = res.data ? res.data : res;
        resove(typeof data === "string" ? JSON.parse(data) : data);
      },
      fail: (err: any) => reject(err)
    });
  });
};

/**
 * localstorage操作
 */
export function clearStorage() {
  return clearStorageSync();
}

export function removeItem(key: string) {
  return removeStorageSync(key);
}

export function getItem(key: string) {
  return getStorageSync(key);
}

export function setItem(key: string, data: any) {
  return setStorageSync(key, data);
}

/**
 * 路由返回
 */
export function routerBack(opt?: any) {
  navigateBack({
    ...opt,
    fail() {
      reLaunch({ url: "/pages/index/index" });
    }
  });
}

// 生成随机数
const randomNum = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min) + min);
};

export const getRandomColor = (min: number, max: number) => {
  let r = randomNum(min, max);
  let g = randomNum(min, max);
  let b = randomNum(min, max);
  return `rgb(${r}, ${g}, ${b})`;
};

/**
 * @description: 清楚富文本中的图片、空格等
 * @param {string} text
 * @return {*}
 */
export function clearRichText(text: string = "") {
  const text1 = text.replace(/<\/?(img|table)[^>]*>/g, "[图片]"); //去除图片、表格
  // const text2 = text1.replace(/<\/?(p|em|strong)[^>]*>/g, '')
  const text2 = text1.replace(/<\/?.+?>/g, ""); //去除标签包裹
  const text3 = text2.replace(/[ | ]*\n/g, "\n"); //去除行尾空白
  const text4 = text3.replace(/ /g, ""); //去除空格
  return text4;
}
