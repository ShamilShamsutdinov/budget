export const formatDateForInput = (date: string | Date): string => {
  if (!date) return new Date().toISOString().split('T')[0]
  
  try {
    let dateObj: Date
    
    if (typeof date === 'string') {
      if (date.includes('T')) {
        // ISO строка
        dateObj = new Date(date)
      } else if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        // Уже в формате YYYY-MM-DD
        return date
      } else {
        // Неизвестный формат
        dateObj = new Date(date)
      }
    } else {
      dateObj = date
    }
    
    if (isNaN(dateObj.getTime())) {
      return new Date().toISOString().split('T')[0]
    }
    
    const year = dateObj.getFullYear()
    const month = String(dateObj.getMonth() + 1).padStart(2, '0')
    const day = String(dateObj.getDate()).padStart(2, '0')
    
    return `${year}-${month}-${day}`
  } catch {
    return new Date().toISOString().split('T')[0]
  }
}