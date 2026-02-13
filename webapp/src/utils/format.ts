export const formatAmount = (amount: number, type: string) => {
    const sign = type === 'Доход' ? '+' : '−';
    const formatter = new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    });
    const formatted = formatter.format(amount).replace(/\s?₽/, '');
    return `${sign} ${formatted} ₽`;
};