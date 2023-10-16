import { createContext } from "react";
import { Form } from "./form";

export const FormContext = createContext<{
  form: Form;
  onChange: Function | undefined;
  labelHeight?: string;
  labelSize?: string;
  labelColor?: string;
}>({} as any);
