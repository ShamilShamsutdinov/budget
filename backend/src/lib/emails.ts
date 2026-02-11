import { promises as fs } from 'fs'
import path from 'path'
import { type User } from '@prisma/client'
import fg from 'fast-glob'
import _ from 'lodash'
import { env } from './env'
import Handlebars from 'handlebars'
import { sendEmailThroughDashamail } from './dasha'

const getHbrTemplates = async () => {
  const baseDir = path.join(process.cwd(), 'src/emails/dist')
  console.log('Looking in:', baseDir)
  
  const files = await fs.readdir(baseDir)
  const htmlFiles = files.filter(f => f.endsWith('.html'))
  console.log('HTML files found:', htmlFiles) 
  
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  
  for (const file of htmlFiles) {
    const templateName = path.basename(file, '.html')
    const filePath = path.join(baseDir, file)
    const htmlTemplate = await fs.readFile(filePath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  
  return hbrTemplates
}

const getEmailHtml = async (templateName: string, templateVariables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates()
  const hbrTemplate = hbrTemplates[templateName]
  const html = hbrTemplate(templateVariables)
  return html
}

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVariables = {},
}: {
  to: string
  subject: string
  templateName: string
  templateVariables?: Record<string, any>
}) => {
  try {
    const fullTemplateVariables = {  // Исправлено: variables, а не varaibles
      ...templateVariables,
      homeUrl: env.WEBAPP_URL,
    }
    const html = await getEmailHtml(templateName, fullTemplateVariables)
    
    const { loggableResponse } = await sendEmailThroughDashamail({ 
      to, 
      subject, 
      html
    })
    
  //   console.info('sendEmail', {
  //     to,
  //     templateName,
  //     templateVariables,
  //     response: loggableResponse,
  //   })
  //   return { ok: true }
  // } catch (error) {
  //   console.error(error)
  //   return { ok: false }
  // }

  console.info('📧 sendEmail RESPONSE:', {
      to,
      subject,
      templateName,
      templateVariables,
      fullResponse: {
        status: loggableResponse.status,
        statusText: loggableResponse.statusText,
        // ⚠️ ВАЖНО: раскрываем data полностью!
        data: loggableResponse.data,
      },
    })
    
    // ✅ ОТДЕЛЬНО ЛОГИРУЕМ ТЕЛО ОТВЕТА
    console.log('🔍 Dashamail API response body:')
    console.dir(loggableResponse.data, { depth: null, colors: true })
    
    return { ok: true }
  } catch (error) {
    console.error('💥 Error in sendEmail:', error)
    return { ok: false }
  }
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Спасибо за регистрацию!',
    templateName: 'welcome',
    templateVariables: {
      userNick: user.nick,
      addIdeaUrl: `${env.WEBAPP_URL}`,
      // addIdeaUrl: getAllTransactionsRoute,
    },
  })
}




