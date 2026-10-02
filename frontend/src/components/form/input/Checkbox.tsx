import React, { FC } from "react";

interface CheckboxProps {
  id?: string;
  name?: string;
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: React.ReactNode;
  disabled?: boolean;
  className?: string;
}

const Checkbox: FC<CheckboxProps> = ({
  id,
  name,
  checked = false,
  onChange,
  label,
  disabled = false,
  className = "",
}) => {
  return (
    <label
      htmlFor={id}
      className={`inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 select-none cursor-pointer ${
        disabled ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="w-4 h-4 rounded border-gray-300 text-brand-500 focus:ring-brand-500/20 cursor-pointer"
      />
      {label && <span>{label}</span>}
    </label>
  );
};

export default Checkbox;
