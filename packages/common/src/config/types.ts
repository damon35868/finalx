export interface configTypes {
  log?: boolean;
  request?: requestConfigType;
  middleware?: middlewareConfigType;
}

export interface requestConfigType {
  baseUrl?: string;
  header?: any;
  timeout?: number;
  bearerToken?: boolean;
  wsUrl?: string;
  wsPing?: boolean;
  wsAck?: boolean;
  wsCheckUser?: boolean;
  wsHeader?: any;
  wsEventKey?: {
    eventKey?: string;
    dataKey?: string;
  };
  wsOnInitSuccess?: (res?: any) => any;
  wsOnInitFail?: (res?: any) => any;
  wsOnReConnect?: () => any;
  wsOnError?: () => any;
  wsOnClose?: () => any;
  errorRule?: {
    codeHandler?: (code: number) => boolean;
    rejectHandler?: (res: any) => string;
  };
}

export type TFilterKey = string | ({ key: string; rule?: (val: any, key: string) => boolean } | string)[];

export interface middlewareConfigType {
  userAuth?: {
    data?: Object | string;
    filterKey?: TFilterKey;
  };

  roleAuth?: {
    data?: Object | string;
    filterKey?: TFilterKey;
  };
}
