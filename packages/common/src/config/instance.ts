import { configTypes, middlewareConfigType, requestConfigType } from "./types";

class Config implements configTypes {
  log = false;
  middleware: middlewareConfigType = { userAuth: {} };
  request: requestConfigType = {
    wsUrl: "",
    baseUrl: "",
    timeout: 300000,
    wsCheckUser: true
  };
}

export const config = new Config();
