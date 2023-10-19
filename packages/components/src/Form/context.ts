import { createContext } from "react";
import { Form } from "./form";

export const FormContext = createContext<{
  form: Form;
  onChange: Function | undefined;
  itemHeight?: string;
  labelSize?: string;
  labelColor?: string;
  errorColor?: string;
}>({} as any);
