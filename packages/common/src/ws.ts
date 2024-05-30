import mitt from "mitt";
import { SocketTask, connectSocket, closeSocket } from "@tarojs/taro";
import { getItem } from "./utils";
import { config } from "./config";

export interface Ws {
  connect(): void;
  close(): void;
  onMessage(): void;
  onError(): void;
  onOpen(): void;
  subscribe(channel: string, data: any, userId: number | null): void;
  listen(): void;
  onClose(): void;
  reConnect(): void;
}

export interface Event {
  EventName: string;
  From: string;
  To: string;
  Data: string;
}

export type WsEventFunc = (event: Event) => void;

export interface WsConnectOptions {
  header: { [key: string]: string };
}

export interface SubscribeEvent {
  // EventName: string;
  // Data: any;
  [key: string]: any;
}

export interface WsHandler {
  [key: string]: (data: any) => void;
}

class WS implements Ws {
  public client: SocketTask;
  public inited: boolean | undefined;
  private subscribeEvents: { [key: string]: SubscribeEvent } = {};
  private wsurl: string | undefined;
  private handlers: any = {};
  private timer: any = null;
  private options: any;
  public emitter: any;
  private lastPongTIme: number = 0;
  private initTimer: any;

  public get userId() {
    const userInfo = getItem("userInfo") || {};
    const { id } = userInfo || {};
    return id;
  }

  constructor() {
    this.init();
  }

  init() {
    if (this.client) return;

    this.initTimer && clearInterval(this.initTimer);
    this.initTimer = setInterval(() => {
      if (getItem("token")) {
        if (config.request.wsUrl) {
          console.log("[初始化WS]");
          const wsUrl = config.request.wsUrl + "?authorization=user$$" + getItem("token");

          this.wsurl = wsUrl;
          this.emitter = mitt();

          this.connect().then(() => {
            this.listen();
          });
          clearInterval(this.initTimer);
        } else clearInterval(this.initTimer);
      }
    }, 10);
  }

  setOptions(options: WsConnectOptions) {
    this.options = options;
  }

  async connect(): Promise<void> {
    console.log("[WS连接中]");

    if (this.client && this.client.readyState === 1) {
      closeSocket();
    }

    this.client = null;
    this.client = await connectSocket({
      url: this.wsurl,
      header: config.request.wsHeader
        ? config.request.wsHeader
        : {
            authorization: getItem("token")
          },
      fail: res => {
        console.log("[WS连接失败]", res);
      },
      success: res => {
        console.log("[WS连接成功]", res);
        this.inited = true;
      },
      ...this.options
    });
  }

  //0 - 表示连接尚未建立，1 - 表示连接已建立，可以进行通信，2 - 表示连接正在进行关闭，3 - 表示连接已经关闭或者连接不能打开
  liveProbe(): boolean {
    if (this.client.readyState === 1) {
      clearInterval(this.timer);
      this.timer = null;
      this.reSubscribe();
      this.lastPongTIme = this.now();
      return true;
    }
    return false;
  }

  async reConnect() {
    if (this.timer) return;
    this.timer = setInterval(async () => {
      if (this.liveProbe()) return;
      console.log("WS重连中");
      await this.connect();
    }, 3000);
  }

  onError(): void {
    this.client.onError((err: any) => {
      console.log("WS onError", err);
      this.reConnect();
    });
  }

  onOpen(): void {
    this.client.onOpen((_: any) => {
      clearInterval(this.timer);
      this.lastPongTIme = this.now();
    });
  }

  addHandler(key: string, fun: WsHandler) {
    this.handlers[key] = fun;
  }

  onMessage(): void {
    this.client.onMessage(res => {
      const messages = res.data.split("\n");
      // console.log("来消息", messages);
      for (const message of messages) {
        const event = JSON.parse(message);

        // 如果事件名称为 'pong' 代表目前是与后端持续连接中,不需要做任何逻辑判断
        if (event[config.request.wsEventKey.eventKey] === "pong") {
          this.lastPongTIme = this.now();
          continue;
        }

        const { userId } = JSON.parse(event[config.request.wsEventKey.dataKey] || "{}");

        if (config.request.wsCheckUser) {
          if (this.userId === userId) this.emitter.emit(event[config.request.wsEventKey.eventKey], event);
        } else {
          this.emitter.emit(event[config.request.wsEventKey.eventKey], event);
        }

        if (config.request.wsAck) {
          // 告知后端已经收到消息,不需要继续发送当前事件的消息
          this.client.send({
            data: JSON.stringify({ [config.request.wsEventKey.eventKey]: "ack", [config.request.wsEventKey.dataKey]: message })
          });
        }
      }
    });
  }

  on(eventName: string, wsEventFunc: WsEventFunc) {
    if (!this.emitter) return;

    this.emitter.on(eventName, wsEventFunc);
  }

  off(eventName: string, wsEventFunc: WsEventFunc) {
    if (!this.emitter) return;

    this.emitter.off(eventName, wsEventFunc);
  }

  onClose(): void {
    this.client.onClose(_ => {
      this.client.close({
        code: 3001,
        fail: res => console.log("WS close fail", res),
        success: res => console.log("WS close success", res)
      });
      this.reConnect();
    });
  }

  reSubscribe() {
    this.listen();
    for (const key in this.subscribeEvents) {
      const event = this.subscribeEvents[key];
      this.client.send({ data: JSON.stringify(event) });
    }
  }

  subscribe(channel: string, data: any): void {
    let timer: any;
    timer = setInterval(() => {
      if (!this.client || this.client.readyState !== 1) {
        return;
      }

      const event = {
        [config.request.wsEventKey.eventKey]: channel,
        [config.request.wsEventKey.dataKey]: JSON.stringify(data)
      } as SubscribeEvent;
      this.subscribeEvents[channel] = event;
      this.client.send({
        data: JSON.stringify(event)
      });
      clearInterval(timer);
    }, 1000);
  }

  now(): number {
    return Date.now();
  }

  public close() {
    this.client.close({
      code: 3001,
      fail: res => console.log("WS close fail", res),
      success: res => console.log("WS close success", res)
    });
  }

  ping() {
    const event = {
      [config.request.wsEventKey.eventKey]: "ping"
    } as SubscribeEvent;

    setInterval(() => {
      if (this.now() - this.lastPongTIme >= 6000) {
        if (this.timer) return;
        this.client.close({
          code: 3001,
          fail: res => console.log("WS close fail", res),
          success: res => console.log("WS close success", res)
        });
        this.reConnect();
      } else {
        this.client.send({
          data: JSON.stringify(event)
        });
      }
    }, 3000);
  }

  async listen() {
    this.onMessage();
    this.onError();
    this.onOpen();
    this.onClose();
    config.request.wsPing && this.ping();
  }
}

export const wsClient = new WS();
