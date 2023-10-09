import { createContext } from "react";
import { Form } from "./form";

export const FormContext = createContext<{
  form: Form;
  onChange: Function | undefined;
}>({} as any);
