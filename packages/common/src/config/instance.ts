import { configTypes, middlewareConfigType, requestConfigType } from "./types";

class Config implements configTypes {
  public log: boolean = false;
  public middleware: middlewareConfigType = {
    userAuth: {},
    roleAuth: {}
  };
  public request: requestConfigType = {
    wsUrl: "",
    baseUrl: "",
    timeout: 300000,
    wsCheckUser: true,
    wsPing: true,
    wsAck: true,
    wsEventKey: {
      eventKey: "EventName",
      dataKey: "Data"
    }
  };
}

export const config: Config = new Config();
