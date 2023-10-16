import React, { FC, ReactElement, cloneElement, useContext, useEffect, useState } from "react";
import { Label, View } from "@tarojs/components";
import { FormItemType } from "./types";
import { FormContext } from "../context";
export * from "./types";

export const FormItem: FC<FormItemType> = ({ label, itemHeight, labelSize, labelColor, name, children, required, rules }) => {
  const [value, setValue] = useState("");
  const [actionName, setAction] = useState("");
  const {
    form,
    onChange,
    itemHeight: formItemHeight = "128rpx",
    labelSize: formLabelSize = "32rpx",
    labelColor: formLabelColor = "#333"
  } = useContext(FormContext);
  const [errMsg, setErrMsg] = useState<string>("");

  // init
  useEffect(() => {
    form.initFn(name, { errMsg, setErrMsg, value, setValue });
  }, [value, name, setErrMsg]);

  useEffect(() => {
    let fnName = "onChange";
    const inputMap = ["input", "textarea"];
    const otherMap = ["switch", "radio", "radio-group", "picker", "checkbox"];

    inputMap.includes(children.type as string) && (fnName = "onInput");
    otherMap.includes(children.type as string) && (fnName = "onChange");

    actionName !== fnName && setAction(fnName);
  }, [children]);

  const actionFn = (e: any) => {
    const val = e.detail.value;

    setValue(val);
    value && setValue(val);
    form.setField(name, val);

    onChange && onChange(form.getFields());

    form.validateField(name);
  };

  const itemEl = cloneElement(children as ReactElement, {
    value,
    ...children.props,
    [actionName]: actionFn,
    ...(children.type === "picker" ? { children: value || `请选择${label}` } : {})
  });

  return (
    <View className='form-item' style={{ height: itemHeight || formItemHeight }}>
      <Label style={{ fontSize: labelSize || formLabelSize, color: labelColor || formLabelColor }} className='form-item-label'>
        {label}
        {(required || !!rules) && <View className='required-icon'>*</View>}
      </Label>
      <View className='form-item-content'>{itemEl}</View>

      <View className='form-item-error'>{errMsg}</View>
    </View>
  );
};
