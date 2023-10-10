import React, { FC, ReactElement, Ref, useEffect, useImperativeHandle, useState } from "react";
import { Form as FormObj } from "./form";
import { FormContext } from "./context";

export const Form: FC<{
  formRef?: Ref<FormObj>;
  children: ReactElement | ReactElement[];
  initFields?: { [key: string]: any };
  onChange?: (val: any) => any;
}> = ({ formRef, children, initFields, onChange }) => {
  const [form, setForm] = useState<FormObj>();

  useEffect(() => {
    if (form) return;
    setForm(new FormObj(children, initFields));
  }, []);

  useImperativeHandle(formRef, () => form as FormObj, [form]);

  if (!form) return null;

  return <FormContext.Provider value={{ onChange, form }}>{children}</FormContext.Provider>;
};
