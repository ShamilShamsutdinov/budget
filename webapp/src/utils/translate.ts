import { TransactionTypeToggle, type TransactionType } from "../components/UI/TransactionTypeToggle"

export const getCategoryLabel = (value: string, type: string): string => {
  // Внутри проверяем type
  const isIncome = type === 'income';
  
  const incomeCategories: Record<string, string> = {
    salary: 'Зарплата',
    freelance: 'Фриланс',
    investment: 'Инвестиции',
    other: 'Другое',
  };
  
  const expenseCategories: Record<string, string> = {
    food: 'Еда',
    transport: 'Транспорт',
    entertainment: 'Развлечения',
    other: 'Другое',
  };
  
  return isIncome 
    ? incomeCategories[value] || value
    : expenseCategories[value] || value;
};

export const getTypeLabel = (type: string): string => {
  return type === 'income' ? 'Доход' : 'Расход';
};