import type { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";

export const adminInputClass =
  "w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition focus:bg-slate-200/80";

export const adminSelectClass =
  "w-full rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-900 outline-none transition focus:bg-slate-200/80";

export const adminButtonPrimaryClass =
  "rounded-2xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50";

export const adminButtonSecondaryClass =
  "rounded-2xl bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-200";

type AdminInputProps = InputHTMLAttributes<HTMLInputElement>;

export function AdminInput({ className = "", ...props }: AdminInputProps) {
  return <input className={`${adminInputClass} ${className}`} {...props} />;
}

type AdminTextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export function AdminTextarea({ className = "", ...props }: AdminTextareaProps) {
  return <textarea className={`${adminInputClass} resize-y ${className}`} {...props} />;
}

type AdminSelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export function AdminSelect({ className = "", children, ...props }: AdminSelectProps) {
  return (
    <select className={`${adminSelectClass} ${className}`} {...props}>
      {children}
    </select>
  );
}

type AdminCheckboxProps = {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label: string;
};

export function AdminCheckbox({ checked, onChange, label }: AdminCheckboxProps) {
  return (
    <label className="flex cursor-pointer items-center gap-3 rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-0 accent-slate-900"
      />
      {label}
    </label>
  );
}
