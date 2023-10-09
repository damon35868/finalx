import { ReactElement } from "react";

export interface FormItemType {
  label?: string;
  name: string;
  labelSize?: string;
  labelColor?: string;
  required?: boolean;
  rules?: RuleType | RuleType[];
  layout?: "normal" | "between";
  children: ReactElement;
}

export interface RuleType {
  type?: "email" | "phone";
  message?: string;
  custom?: (val: any) => boolean;
}
