import React from 'react';

export type TransactionType = 'Доход' | 'Расход';

export interface TransactionTypeToggle {
  value: TransactionType;
  onChange: (type: 'Доход' | 'Расход') => void;
}

export const TransactionTypeToggle: React.FC<TransactionTypeToggle> = ({ value, onChange }) => {
  const handleChange = (type: 'Доход' | 'Расход') => {
    if (value !== type) {
      onChange(type);
    }
  };

  return (
    <div className="transaction-type">
      <div className="type-option income">
        <input
          type="radio"
          id="type-income"
          name="transaction-type"
          checked={value === 'Доход'}
          onChange={() => handleChange('Доход')}
        />
        <label
          htmlFor="type-income"
          className="type-label"
          onClick={() => handleChange('Доход')}
        >
          <i className="fas fa-arrow-down"></i>
          <span>Доход</span>
        </label>
      </div>
      
      <div className="type-option expense">
        <input
          type="radio"
          id="type-expense"
          name="transaction-type"
          checked={value === 'Расход'}
          onChange={() => handleChange('Расход')}
        />
        <label
          htmlFor="type-expense"
          className="type-label"
          onClick={() => handleChange('Расход')}
        >
          <i className="fas fa-arrow-up"></i>
          <span>Расход</span>
        </label>
      </div>
    </div>
  );
};