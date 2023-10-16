import React, { FC, ReactElement, Ref, useEffect, useImperativeHandle, useState } from "react";
import { Form as FormObj } from "./form";
import { FormContext } from "./context";
import { View } from "@tarojs/components";
import "./index.scss";
export * from "./form";

export const Form: FC<{
  formRef?: Ref<FormObj>;
  children: ReactElement | ReactElement[];
  initFields?: { [key: string]: any };
  itemHeight?: string;
  labelSize?: string;
  labelColor?: string;
  layout?: "normal" | "between";
  onChange?: (val: any) => any;
}> = ({ layout = "between", formRef, children, initFields, itemHeight, labelSize, labelColor, onChange }) => {
  const [form, setForm] = useState<FormObj>();

  useEffect(() => {
    if (form) return;
    setForm(new FormObj(children, initFields));
  }, []);

  useImperativeHandle(formRef, () => form as FormObj, [form]);

  if (!form) return null;

  return (
    <FormContext.Provider value={{ onChange, form, itemHeight, labelSize, labelColor }}>
      <View className={`form form-${layout}`}>{children}</View>
    </FormContext.Provider>
  );
};
