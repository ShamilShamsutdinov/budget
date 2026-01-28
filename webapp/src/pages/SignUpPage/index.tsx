import { zSignUpTrpcInput } from '@budget/backend/src/router/signUp/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useState } from 'react'
import { z } from 'zod'
import { Input } from '../../components/UI/Input'
import { trpc } from '../../lib/trpc'

export const SignUpPage = () => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
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
        await signUp.mutateAsync(values)
        formik.resetForm()
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 3000)
      } catch (err: any) {
        setSubmittingError(err.message)
      }
    },
  })

  return (
    <div>
      <form className='form-sign-up' onSubmit={formik.handleSubmit}>
          <Input placeholder="Введите никнейм"  name="nick" formik={formik} />
          <Input placeholder="Введите пароль" name="password" type="password" formik={formik} />
          <Input placeholder="Введите пароль снова" name="passwordAgain" type="password" formik={formik} />
          {!formik.isValid && !!formik.submitCount && (
            <div style={{ color: 'red' }}>Форма не прошла валидацию</div>
          )}
          {submittingError}
          {successMessageVisible && (
            <div style={{ color: 'green' }}>Вы успешно зарегистрированы</div>
          )}
          <button disabled={formik.isSubmitting} className="btn btn-primary">{formik.isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}</button>
      </form>
    </div>
  )
}