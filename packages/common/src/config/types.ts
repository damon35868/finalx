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
  bearerToken?: boolean;
}

export interface middlewareConfigType {
  userAuth: {
    filterKey?: {
      phone?: string;
      info?: string;
    };
  };
}
