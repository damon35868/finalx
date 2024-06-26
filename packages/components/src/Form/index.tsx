import React, { FC, ReactElement, CSSProperties, Ref, useEffect, useImperativeHandle, useState, isValidElement } from "react";
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
  errorAligin?: "left" | "right";
  hiddenRequiredIcon?: boolean;
  requiredIconStyle?: CSSProperties;
}> = ({
  layout = "between",
  formRef,
  children: childrenVal,
  initFields,
  itemHeight,
  labelSize,
  labelColor,
  disabled,
  errorColor,
  onChange,
  errorAligin,
  hiddenRequiredIcon = false,
  requiredIconStyle = {}
}) => {
  const [form, setForm] = useState<FormObj>();

  const children: ReactElement | ReactElement[] = Array.isArray(childrenVal)
    ? childrenVal.filter(item => isValidElement(item))
    : isValidElement(childrenVal)
    ? childrenVal
    : ((<></>) as any);

  useEffect(() => {
    if (form) return form.initData({ children, initFields });
    setForm(new FormObj(children, initFields));
  }, [children]);

  useImperativeHandle(formRef, () => form as FormObj, [form]);

  if (!form) return null;

  return (
    <FormContext.Provider
      value={{ onChange, form, itemHeight, labelSize, labelColor, errorColor, disabled, requiredIconStyle, hiddenRequiredIcon, errorAligin }}
    >
      <View className={`form form-${layout}`}>{children}</View>
    </FormContext.Provider>
  );
};
