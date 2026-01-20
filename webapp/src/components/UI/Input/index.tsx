import React from 'react';

type InputProps = {
  type?: 'text' | 'number' | 'date';
  value?: string | number;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  className?: string;
  id?: string;
};

export const Input: React.FC<InputProps> = ({
  type = 'text',
  value = '',
  onChange,
  placeholder = '',
  className = '',
  id,
}) => {
  return (
    <input
      type={type}
      id={id}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      className={`form-control ${className}`}
    />
  );
};