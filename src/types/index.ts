export * from "./database.types";
export * from "./player";
export * from "./tournament";
export * from "./match";

export interface NavItem {
  title: string;
  href: string;
  icon?: string;
  disabled?: boolean;
  external?: boolean;
  badge?: string | number;
}
