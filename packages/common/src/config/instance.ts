import { configTypes, middlewareConfigType, requestConfigType } from "./types";

class Config implements configTypes {
  public log: boolean = false;
  public middleware: middlewareConfigType = { userAuth: {} };
  public request: requestConfigType = {
    wsUrl: "",
    baseUrl: "",
    timeout: 300000,
    wsCheckUser: true
  };
}

export const config: Config = new Config();
