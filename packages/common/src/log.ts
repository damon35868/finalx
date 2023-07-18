class Log {
  success(text: string, val: any = "") {
    console.log("\x1b[32m%s\x1b[0m", text, val);
  }

  error(text: string, val: any = "") {
    console.log("\x1b[31m%s\x1b[0m", text, val);
  }
}

export const log = new Log();
