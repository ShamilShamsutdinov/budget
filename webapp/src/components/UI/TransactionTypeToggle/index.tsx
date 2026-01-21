import React from 'react';

export type TransactionType = 'income' | 'expense';

export interface TransactionTypeToggle {
  value: TransactionType;
  onChange: (type: 'income' | 'expense') => void;
}

export const TransactionTypeToggle: React.FC<TransactionTypeToggle> = ({ value, onChange }) => {
  const handleChange = (type: 'income' | 'expense') => {
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
          checked={value === 'income'}
          onChange={() => handleChange('income')}
        />
        <label
          htmlFor="type-income"
          className="type-label"
          onClick={() => handleChange('income')}
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
          checked={value === 'expense'}
          onChange={() => handleChange('expense')}
        />
        <label
          htmlFor="type-expense"
          className="type-label"
          onClick={() => handleChange('expense')}
        >
          <i className="fas fa-arrow-up"></i>
          <span>Расход</span>
        </label>
      </div>
    </div>
  );
};