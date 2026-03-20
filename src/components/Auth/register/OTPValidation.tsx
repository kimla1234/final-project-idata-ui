'use client'
import React, { useRef } from "react";

type OTPValidationProps ={
  length: number; // Number of OTP inputs (default is 6)
  onComplete: (otp: string) => void; // Callback when OTP is fully entered
}

function OTPValidation({ length = 6, onComplete }: OTPValidationProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (value.length === 1 && index < length - 1) {
      // Move to the next input
      inputsRef.current[index + 1]?.focus();
    }
    if (value.match(/\D/)) {
      e.target.value = ""; // Clear non-numeric input
    }

    // Check if all inputs are filled
    const otp = inputsRef.current.map((input) => input?.value ?? "").join("");
    if (otp.length === length) {
      onComplete(otp);
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const clipboardData = e.clipboardData.getData("Text").slice(0, length); // Limit to the required length
    clipboardData.split("").forEach((char, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index]!.value = char;
      }
    });

    // Trigger onComplete after pasting
    const otp = inputsRef.current.map((input) => input?.value ?? "").join("");
    if (otp.length === length) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace" && !inputsRef.current[index]?.value && index > 0) {
      // Move to the previous input
      inputsRef.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-4 sm:gap-6">
      {Array.from({ length }).map((_, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          ref={(el) => {
            inputsRef.current[index] = el; // Store reference in the array
          }}
          className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
          onChange={(e) => handleInputChange(e, index)}
          onPaste={handlePaste}
          onKeyDown={(e) => handleKeyDown(e, index)}
        />
      ))}
    </div>
  );
}

export default OTPValidation;
