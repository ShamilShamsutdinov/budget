import { zSignUpTrpcInput } from '@budget/backend/src/router/auth/signUp/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import Cookies from 'js-cookie'
import { z } from 'zod'
import { Input } from '../../../components/UI/Input'
import { trpc } from '../../../lib/trpc'
import { useNavigate } from 'react-router-dom'
import { getAllTransactionsRoute } from '../../../lib/routes'

export const SignUpPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils();
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const signUp = trpc.signUp.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
      passwordAgain: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
        .extend({
          passwordAgain: z.string().min(1),
        })
        .superRefine((val, ctx) => {
          if (val.password !== val.passwordAgain) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: 'Пароли не совпадают',
              path: ['passwordAgain'],
            })
          }
        })
    ),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        const {token} = await signUp.mutateAsync(values)
        Cookies.set('token', token, { expires: 99999 })
        void trpcUtils.invalidate()
        navigate(getAllTransactionsRoute())
      } catch (err: any) {
        setSubmittingError(err.message)
      }
    },
  })

  return (
    <div>
      <h1 className='form-title'>Зарегистрироваться</h1>
      <form className='form-auth' onSubmit={formik.handleSubmit}>
          <Input placeholder="Введите никнейм"  name="nick" formik={formik} />
          <Input placeholder="Введите пароль" name="password" type="password" formik={formik} />
          <Input placeholder="Введите пароль снова" name="passwordAgain" type="password" formik={formik} />
          {!formik.isValid && !!formik.submitCount && (
            <div style={{ color: 'red' }}>Форма не прошла валидацию</div>
          )}
          {submittingError}
          <button disabled={formik.isSubmitting} className="btn btn-primary">{formik.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}</button>
      </form>
    </div>
  )
}