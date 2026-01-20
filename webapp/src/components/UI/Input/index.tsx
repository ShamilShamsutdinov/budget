import React from 'react';
import { type FormikProps } from 'formik'

type InputProps = {
  type?: 'text' | 'number' | 'date';
  name: string;
  formik: FormikProps<any>
  placeholder?: string;
  className?: string;
  id?: string;
};

export const Input: React.FC<InputProps> = ({
  type = 'text',
  name,
  formik,
  placeholder = '',
  className = '',
  id,
}) => {
  return (
    <input
      type={type}
      id={id}
      name={name}
      value={formik.values[name] || ''} 
      onChange={(e) => {
        formik.setFieldValue(name, e.target.value);
      }}
      placeholder={placeholder}
      className={`form-control ${className}`}
    />
  );
};

