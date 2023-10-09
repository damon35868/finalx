import { View } from "@tarojs/components";
import { FC, ReactElement, useEffect, useRef, useState } from "react";
import { form as formObj } from "./form";
import { FormContext } from "./context";
import { Observer, Provider } from "mobx-react";

export const Form: FC<{
  children: ReactElement | ReactElement[];
  form?: any;
  initFields?: { [key: string]: any };
  onChange?: (val: any) => any;
}> = ({ form, children, initFields, onChange }) => {
  useEffect(() => {
    formObj.initData({
      content: children,
      initFields,
    });
  }, []);

  return (
    <Provider form={formObj}>
      <FormContext.Provider
        value={{
          form: formObj,
          onChange,
        }}
      >
        <Observer>{() => <View>{children}</View>}</Observer>
      </FormContext.Provider>
    </Provider>
  );
};
