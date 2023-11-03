import { ReactElement } from "react";

interface subKeyType {
  setErrMsg: Function;
  errMsg: string;
  value: string;
  setValue: Function;
}

interface IField {
  [key: string]: any;
}

export class Form {
  private formItemObj: { [key: string]: subKeyType } = {};

  private fields: any[] = [];

  private errors: any[] = [];

  constructor(private children: ReactElement | ReactElement[], private initFields: { [key: string]: any } = {}) {
    this.initForm();
  }

  /**
   * @description:重置表单
   * @return {*}
   */
  private initForm() {
    this.errors = [];

    if (Array.isArray(this.children)) {
      this.children.forEach((item, key) => {
        const name = item.props.name;

        const { value: fieldValue } = this.getField(name) || {};
        const value = fieldValue || this.initFields[name] || "";
        this.fields[key] = { name, value };
      });
      return;
    }

    const { value: fieldValue } = this.getField(this.children.props.name) || {};
    this.fields = [
      {
        name: this.children.props.name,
        value: fieldValue || this.initFields[this.children.props.name] || ""
      }
    ];
  }

  public resetForm() {
    this.errors = [];
    this.fields = [];

    if (Array.isArray(this.children)) {
      this.children.forEach((item, key) => {
        const name = item.props.name;

        const value = this.initFields[name] || "";
        this.fields[key] = { name, value };

        this.formItemObj[name].setErrMsg("");
        this.formItemObj[name].setValue(value);
      });
      return;
    }

    this.formItemObj[this.children.props.name].setErrMsg("");
    this.formItemObj[this.children.props.name].setValue(this.initFields[this.children.props.name] || "");
  }

  /**
   * @description: 初始化基础数据
   * @return {*}
   */
  public initData({ children, initFields }: { children?: ReactElement | ReactElement[]; initFields?: { [key: string]: any } }) {
    children && (this.children = children);
    initFields && (this.initFields = initFields);

    if (!children && !initFields) return;
    this.initForm();
  }

  /**
   * @description: 初始化form item操作state
   * @return {*}
   */
  public initFn(name: string, formItemObj: subKeyType) {
    this.formItemObj[name] = formItemObj;

    const field = this.getField(name);
    if (!field) return;
    if (field.value) formItemObj.setValue(field.value);
  }

  /**
   * @description: 获取单个表单错误
   * @param {string} key
   * @return {*}
   */
  public getError(name: string) {
    const err = this.errors.find(item => item.name === name);
    return err;
  }

  /**
   * @description: 获取全部表单错误
   * @return {*}
   */
  public getErrors() {
    return this.errors || [];
  }

  /**
   * @description: 重置校验
   * @return {*}
   */
  public clearErrors() {
    this.errors = [];
    Object.values(this.formItemObj).forEach(item => item.setErrMsg(""));
  }

  /**
   * @description: 清除单个表单错误
   * @param {string} key
   * @return {*}
   */
  public clearError(name: string) {
    const idx = this.errors.findIndex(item => item.name === name);

    if (idx === -1) return;

    this.errors.splice(idx, 1);
    this.formItemObj[name].setErrMsg("");
  }

  /**
   * @description: 设置单个表单错误
   * @param {string} key
   * @return {*}
   */
  public setError(name: string, message: string) {
    const err = this.errors.find(item => item.name === name);

    if (err) {
      err.errMsg = message;
    } else {
      this.errors.push({
        name,
        errMsg: message
      });
    }

    this.formItemObj[name].setErrMsg(message);
    // if (message) throw new Error(message);
  }

  /**
   * @description: 获取单个表单
   * @param {string} key
   * @return {*}
   */
  public getField(key: string): IField {
    const field = this.fields.find(item => item.name === key);
    return field || null;
  }

  /**
   * @description: 获取全部表单
   * @return {*}
   */
  public getFields(): IField {
    return this.fields || [];
  }

  /**
   * @description:  设置单个表单
   * @param {string} name
   * @return {*}
   */
  public setField(name: string, value: any) {
    const field = this.fields.find(item => item.name === name) || {};
    field.value = value;
    this.formItemObj[name].setValue(value);
  }

  /**
   * @description:  设置全部表单
   * @return {*}
   */
  public setFields(val: { [key: string]: any }) {
    this.fields = [];

    for (const [name, value] of Object.entries(val)) {
      this.fields.push({ name, value });
      this.formItemObj[name].setValue(value);
    }
  }

  /**
   * @description: 校验全部字段
   * @return {*}
   */
  public async validateFields<T>(): Promise<T> {
    const fieldsObj: T = {} as T;
    return new Promise(async (resove, reject) => {
      try {
        if (Array.isArray(this.children)) {
          const errorPromise = this.children.map(none => this.checkError(none.props));

          await Promise.all(errorPromise);
          this.fields.forEach(item => (fieldsObj[item.name] = item.value));
          resove(fieldsObj);
          return;
        }

        await this.checkError(this.children.props);
        this.fields.forEach(item => (fieldsObj[item.name] = item.value));
        resove(fieldsObj);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * @description: 校验单个字段
   * @return {*}
   */
  public validateField<T>(name: string): Promise<T> {
    const fieldsObj: T = {} as T;
    return new Promise(async (resove, reject) => {
      try {
        const childNodes: ReactElement[] = Array.isArray(this.children) ? this.children : [this.children];

        const childNode = childNodes.find(item => item.props.name === name);
        await this.checkError(childNode?.props);

        const field = this.fields.find(item => item.name === name);
        fieldsObj[field.name] = field.value;

        resove(fieldsObj);
      } catch (e) {
        reject(e);
      }
    });
  }

  private checkError(props: any) {
    return new Promise((resove, reject) => {
      if (!props) return resove(true);

      const { label, name, required, rules } = props || {};
      if (!required && !rules) return resove(true);

      let msg = "";
      this.clearError(name);
      const val = (this.fields.find(item => item.name === name) || {}).value;

      if (required && !val) {
        msg = `请输入${label}`;
      } else if (rules) {
        if (Array.isArray(rules)) {
          // 多条
          for (let i = 0; i < rules.length; i++) {
            msg = this.typeValidate(rules[i], val);
            if (msg) break;
          }
        } else {
          //单条
          msg = this.typeValidate(rules, val);
        }
      }

      if (msg) {
        reject(msg);
        this.setError(name, msg);
        return;
      }

      resove(true);
    });
  }

  private typeValidate(rule, val) {
    const { type, message, custom } = rule || {};
    if (custom) {
      if (!custom(val)) return message || "不满足自定义校验条件";
      return "";
    }

    switch (type) {
      case "email": {
        const emailReg = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!emailReg.test(val)) return message || "请输入正确的邮箱地址";
        return "";
      }
      case "phone": {
        const phoneReg = /^[1]([3-9])[0-9\s]{9}$/;
        if (!phoneReg.test(val)) return message || "请输入正确的手机号码";
        return "";
      }
      case "idCard": {
        const idCardReg = /^(^\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$/;
        if (!idCardReg.test(val)) return message || "请输入正确的身份证号码";
        return "";
      }
    }
  }
}
