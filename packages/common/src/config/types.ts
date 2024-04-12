export interface configTypes {
  log?: boolean;
  request?: requestConfigType;
  middleware?: middlewareConfigType;
}

export interface requestConfigType {
  baseUrl?: string;
  wsUrl?: string;
  header?: any;
  timeout?: number;
  wsCheckUser?: boolean;
  bearerToken?: boolean;
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
