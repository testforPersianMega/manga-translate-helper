import type { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  error?: string;
};

export function Input({ label, error, ...props }: InputProps) {
  return (
    <label>
      <span className="label">{label}</span>
      <input className="input" {...props} />
      {error ? <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{error}</span> : null}
    </label>
  );
}
