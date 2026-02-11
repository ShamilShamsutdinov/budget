import axios, { type AxiosResponse } from 'axios'
import { env } from './env'

const makeRequestToDashamail = async (
  data: Record<string, any>
): Promise<{
  originalResponse?: AxiosResponse
  loggableResponse: Pick<AxiosResponse, 'status' | 'statusText' | 'data'>
}> => {
  if (!env.DASHA_API_KEY) {
    return {
      loggableResponse: {
        status: 200,
        statusText: 'OK',
        data: { message: 'DASHA_API_KEY is not set' },
      },
    }
  }

  const formData = new URLSearchParams()
  
  // Добавляем все параметры
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      formData.append(key, String(value))
    }
  })
  
  // Добавляем API ключ и формат ответа
  formData.append('api_key', env.DASHA_API_KEY)
  formData.append('format', 'json')
  
  const response = await axios({
    method: 'POST',
    url: 'https://api.dashamail.ru', // или .ru
    data: formData,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  })
  
  return {
    originalResponse: response,
    loggableResponse: {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    },
  }
}

export const sendEmailThroughDashamail = async ({ 
  to, 
  subject, 
  html 
}: { 
  to: string; 
  subject: string; 
  html: string 
}) => {
  return await makeRequestToDashamail({
    method: 'transactional.send',
    to: to,
    from_email: env.FROM_EMAIL_ADDRESS, // Обязательное поле
    from_name: env.FROM_EMAIL_NAME,
    subject: subject,
    message: html, 
  })
}