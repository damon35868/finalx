import { ReactElement, CSSProperties } from "react";

export interface FormItemType {
  label?: string;
  name: string;
  itemHeight?: string;
  labelSize?: string;
  labelColor?: string;
  errorColor?: string;
  required?: boolean;
  disabled?: boolean;
  rules?: RuleType | RuleType[];
  children: ReactElement;
  errorAligin?: "left" | "right";
  hiddenRequiredIcon?: boolean;
  requiredIconStyle?: CSSProperties;
}

export interface RuleType {
  type?: "email" | "phone" | "idCard";
  message?: string;
  custom?: (val: any) => boolean;
}
