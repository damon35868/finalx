import React, { FC, ReactElement, Ref, useEffect, useImperativeHandle, useState, isValidElement } from "react";
import { Form as FormObj } from "./form";
import { FormContext } from "./context";
import { View } from "@tarojs/components";
import "./index.scss";
export { Form as FormType } from "./form";

export const Form: FC<{
  formRef?: Ref<FormObj>;
  children: ReactElement | ReactElement[] | boolean | (boolean | ReactElement)[];
  initFields?: { [key: string]: any };
  itemHeight?: string;
  labelSize?: string;
  labelColor?: string;
  errorColor?: string;
  disabled?: boolean;
  layout?: "normal" | "between";
  onChange?: (val: any) => any;
}> = ({ layout = "between", formRef, children: childrenVal, initFields, itemHeight, labelSize, labelColor, disabled, errorColor, onChange }) => {
  const [form, setForm] = useState<FormObj>();

  const children = Array.isArray(childrenVal) ? childrenVal.filter(item => isValidElement(item)) : isValidElement(childrenVal) ? childrenVal : <></>;

  useEffect(() => {
    if (form) return;
    setForm(new FormObj(children, initFields));
  }, []);

  useImperativeHandle(formRef, () => form as FormObj, [form]);

  if (!form) return null;

  return (
    <FormContext.Provider value={{ onChange, form, itemHeight, labelSize, labelColor, errorColor, disabled }}>
      <View className={`form form-${layout}`}>{children}</View>
    </FormContext.Provider>
  );
};
