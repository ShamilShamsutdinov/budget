import { zSignInTrpcInput } from '@budget/backend/src/router/auth/signIn/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { Input } from '../../../components/UI/Input'
import { trpc } from '../../../lib/trpc'
import Cookies from 'js-cookie'
import { getAllTransactionsRoute } from '../../../lib/routes'
import { useNavigate } from 'react-router-dom'

export const SignInPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils();
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const signIn = trpc.signIn.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
    },
    validate: withZodSchema(zSignInTrpcInput),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        const {token} = await signIn.mutateAsync(values)
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
      <h1 className='form-title'>Войти</h1>
      <form className='form-auth' onSubmit={formik.handleSubmit}>
          <Input placeholder='Введите логин'  name="nick" formik={formik} />
          <Input placeholder='Введите пароль'  name="password" type="password" formik={formik} />
          {!formik.isValid && !!formik.submitCount && (
            <div style={{ color: 'red' }}>Неверный логин или пароль</div>
          )}
          {submittingError}
          <button disabled={formik.isSubmitting} className="btn btn-primary">{formik.isSubmitting ? 'Вход...' : 'Войти'}</button>
      </form>
    </div>
  )
}