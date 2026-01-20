import React from 'react';

type SelectProps = {
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
  id?: string; 
};

export const Select: React.FC<SelectProps> = ({
  options,
  value = '',
  onChange,
  placeholder = 'Выберите опцию',
  id,
  className = '',
}) => {
  return (
    <select
      id={id}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      className={`form-control ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map(({ value, label }) => (
        <option key={value} value={value}>
          {label}
        </option>
      ))}
    </select>
  );
};