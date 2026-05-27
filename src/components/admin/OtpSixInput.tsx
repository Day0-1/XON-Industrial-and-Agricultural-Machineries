"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";

type OtpSixInputProps = {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
};

const LENGTH = 6;

export function OtpSixInput({ value, onChange, disabled }: OtpSixInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const digits = Array.from({ length: LENGTH }, (_, i) => value[i] ?? "");

  function updateDigit(index: number, char: string) {
    const next = digits.slice();
    next[index] = char;
    onChange(next.join("").slice(0, LENGTH));
  }

  function focusIndex(index: number) {
    const el = inputsRef.current[index];
    el?.focus();
    el?.select();
  }

  function handleChange(index: number, raw: string) {
    const cleaned = raw.replace(/\D/g, "");
    if (!cleaned) {
      updateDigit(index, "");
      return;
    }

    if (cleaned.length > 1) {
      const merged = (digits.join("") + cleaned).replace(/\D/g, "").slice(0, LENGTH);
      onChange(merged);
      focusIndex(Math.min(merged.length, LENGTH - 1));
      return;
    }

    updateDigit(index, cleaned[0]!);
    if (index < LENGTH - 1) focusIndex(index + 1);
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusIndex(index - 1);
    }
    if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      focusIndex(index - 1);
    }
    if (e.key === "ArrowRight" && index < LENGTH - 1) {
      e.preventDefault();
      focusIndex(index + 1);
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, LENGTH);
    if (pasted) {
      onChange(pasted);
      focusIndex(Math.min(pasted.length, LENGTH - 1));
    }
  }

  return (
    <div
      className="flex justify-center gap-2 sm:gap-3"
      role="group"
      aria-label="6-digit verification code"
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputsRef.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? "one-time-code" : "off"}
          maxLength={6}
          disabled={disabled}
          value={digit}
          aria-label={`Digit ${index + 1} of ${LENGTH}`}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className="h-12 w-11 rounded-2xl border-0 bg-slate-100 text-center text-lg font-bold text-slate-900 outline-none ring-1 ring-slate-200/80 transition focus:bg-white focus:ring-2 focus:ring-slate-900/15 sm:h-14 sm:w-12 sm:text-xl"
        />
      ))}
    </div>
  );
}
