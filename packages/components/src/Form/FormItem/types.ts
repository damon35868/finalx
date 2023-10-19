import { ReactElement } from "react";

export interface FormItemType {
  label?: string;
  name: string;
  itemHeight?: string;
  labelSize?: string;
  labelColor?: string;
  errorColor?: string;
  required?: boolean;
  rules?: RuleType | RuleType[];
  children: ReactElement;
}

export interface RuleType {
  type?: "email" | "phone" | "idCard";
  message?: string;
  custom?: (val: any) => boolean;
}
