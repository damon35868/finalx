import {
  FC,
  ReactElement,
  cloneElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { Button, Label, View } from "@tarojs/components";
import "./index.scss";
import { FormItemType } from "./types";
import { FormContext } from "../context";

export const FormItem: FC<FormItemType> = ({
  label,
  labelSize = "32rpx",
  labelColor = "#fff",
  name,
  children,
  required,
  layout = "between",
  rules,
}) => {
  const tagType = children.type;
  const [value, setValue] = useState("");
  const [actionName, setAction] = useState("");
  const { form, onChange } = useContext(FormContext);

  // useEffect(() => {
  //   const field = form.getField(name);
  //   if (field.value) setValue(field.value);
  // }, []);

  const error = form.getError(name);
  const { errMsg } = error || {};

  useEffect(() => {
    let fnName = "onChange";

    switch (tagType) {
      case "input":
      case "textarea":
        fnName = "onInput";
        break;
      case "switch":
      case "radio":
      case "picker":
      case "checkbox":
        fnName = "onChange";
        break;
      default:
    }
    actionName !== fnName && setAction(fnName);
  }, [children]);

  const actionFn =
    // useCallback(
    (e: any) => {
      const val = e.detail.value;

      setValue(val);
      value && setValue(val);
      form.setField(name, val);

      onChange && onChange(form.getFields());

      checkError(val);
    };
  // , []);

  const checkError = (val: any) => {
    if (!required) return;
    form.clearError(name);
    if (!val) {
      form.setError(name, `请输入${label}`);
      return;
    }

    if (!rules) return;
    if (Array.isArray(rules)) {
      for (let i = 0; i < rules.length; i++) {
        const msg = typeValidate(rules[i], val);
        form.clearError(name);
        msg && form.setError(name, msg);
      }
      return;
    }

    const msg = typeValidate(rules, val);
    form.clearError(name);
    msg && form.setError(name, msg);
  };

  const customValidate = (val: any, customFn: Function) => {
    return customFn(val);
  };

  const typeValidate = (rule, val) => {
    const { type, message, custom } = rule || {};
    if (custom) {
      if (!customValidate(val, custom))
        return message || "不满足自定义校验条件";
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
    }
  };

  const itemEl = cloneElement(children as ReactElement, {
    // value,
    ...children.props,
    [actionName]: actionFn,
  });

  return (
    <View className={`form-item ${layout}`}>
      <Label
        style={{ fontSize: labelSize, color: labelColor }}
        className="form-item-label"
      >
        {label}
        {(required || !!rules) && <View className="required-icon">*</View>}
      </Label>
      <View className="form-item-content">{itemEl}</View>

      <View className="form-item-error">{errMsg}</View>
      <Button
        onClick={() => {
          form.clearErrors();
          console.log(form.getErrors());
        }}
      >
        清理
      </Button>
    </View>
  );
};
