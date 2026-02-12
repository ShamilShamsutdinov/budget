import React, { useState, useRef, useEffect } from 'react';

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
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const handleBlur = () => {
      setIsOpen(false);
    };

    const select = selectRef.current;
    if (select) {
      select.addEventListener('blur', handleBlur);
    }

    return () => {
      if (select) {
        select.removeEventListener('blur', handleBlur);
      }
    };
  }, []);

  const handleSelectClick = () => {
    setIsOpen(prev => !prev);
  };

  return (
    <div className="select-wrapper">
      <select
        ref={selectRef}
        id={id}
        value={value}
        onClick={handleSelectClick}
        onChange={(e) => {
          onChange?.(e.target.value);
          setIsOpen(false);
        }}
        className={`form-control ${className}`}
      >
        <option value="" hidden>{placeholder}</option>
        {options.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <svg 
        className={`select-icon ${isOpen ? 'open' : ''}`}
        width="18" 
        height="18" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </div>
  );
};