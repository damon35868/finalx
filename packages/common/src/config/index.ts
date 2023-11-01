import { log as logHandler } from "../log";
import { configTypes, middlewareConfigType, requestConfigType } from "./types";
import { config } from "./instance";
import { wsClient } from "../ws";
export { config } from "./instance";

function requestConfig(reqConfig: requestConfigType | undefined) {
  if (typeof reqConfig !== "object") return;

  Object.assign(config, { request: reqConfig });
  config.log && logHandler.success("[配置请求成功]");
  if (reqConfig.wsUrl) wsClient.init();
}

function middlewareConfig(middleware: middlewareConfigType | undefined) {
  if (typeof middleware !== "object") return;

  Object.assign(config, { middleware });
  config.log && logHandler.success("[配置中间件成功]");
}

export function globalConfig(configVal: configTypes) {
  const { request, middleware, log } = configVal || {};

  Object.assign(config, { log });
  middlewareConfig(middleware);
  requestConfig(request);

  Object.freeze(config);
  config.log && logHandler.success("[全局配置完成，已冻结配置文件]", config);
}
