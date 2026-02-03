import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  full?: boolean;
};

export function Button({ variant = "primary", full = false, className, ...props }: ButtonProps) {
  const classes = ["button"];
  if (variant !== "primary") {
    classes.push(variant);
  }
  if (full) {
    classes.push("full");
  }
  if (className) {
    classes.push(className);
  }
  return <button className={classes.join(" ")} {...props} />;
}
