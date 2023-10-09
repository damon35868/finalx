import { ReactElement } from "react";

export class Form {
  private errors: any[] = [];

  private fields: any[] = [];

  initData({
    content,
    initFields = {},
  }: {
    content: ReactElement | ReactElement[];
    initFields?: { [key: string]: any };
  }) {
    if (Array.isArray(content)) {
      content.forEach((element, key) => {
        const name = element.props.name;
        this.fields[key] = { name, value: initFields[name] || "" };
      });
      return;
    }

    this.fields = [
      { name: content.props.name, value: initFields[content.props.name] || "" },
    ];
  }

  /**
   * @description: 获取单个表单错误
   * @param {string} key
   * @return {*}
   */
  public getError(name: string) {
    const err = this.errors.find((item) => item.name === name);
    return err;
  }

  /**
   * @description: 获取全部表单错误
   * @return {*}
   */
  public getErrors() {
    return this.errors;
  }

  /**
   * @description: 清除单个表单错误
   * @param {string} key
   * @return {*}
   */
  public clearError(name: string) {
    const idx = this.errors.findIndex((item) => item.name === name);

    if (idx === -1) return;

    this.errors.splice(idx, 1);
  }

  /**
   * @description: 设置单个表单错误
   * @param {string} key
   * @return {*}
   */

  public setError(key: string, message: string) {
    const err = this.errors.find((item) => item.name === key);

    if (err) return (err.errMsg = message);

    this.errors.push({
      name: key,
      errMsg: message,
    });
  }

  /**
   * @description: 设置全部表单错误
   * @return {*}
   */
  public setErrors() {
    return this.errors || [];
  }

  /**
   * @description: 获取单个表单
   * @param {string} key
   * @return {*}
   */
  public getField(key: string) {
    const field = this.fields.find((item) => item.name === key);
    return field || null;
  }

  /**
   * @description: 获取全部表单
   * @return {*}
   */
  public getFields() {
    return this.fields || [];
  }

  /**
   * @description:  设置单个表单
   * @param {string} key
   * @return {*}
   */
  public setField(key: string, value: any) {
    // const field = this.fields.find((item) => item.name === key);

    // field.value = value;

    const newFields = this.fields.map((item) => {
      if (item.name === key) {
        item.value = value;
      }
      return item;
    });

    this.fields = newFields;
  }

  /**
   * @description:  设置全部表单
   * @return {*}
   */
  public setFields(value: { [key: string]: any }) {
    this.fields = [];

    for (const [key, val] of Object.entries(value)) {
      this.fields.push({ [key]: val });
    }
  }

  /**
   * @description: 校验全部字段
   * @return {*}
   */
  public validate() {}

  /**
   * @description: 校验单个字段
   * @return {*}
   */
  public validateField() {}

  /**
   * @description:重置表单
   * @return {*}
   */
  public resetFields() {}

  /**
   * @description: 重置校验
   * @return {*}
   */

  public clearErrors() {
    this.errors = [];
  }
}

export const form = new Form();
