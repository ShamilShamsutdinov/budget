import { Input } from "../../UI/Input"
import { useFormik } from 'formik'
import { Select } from "../../UI/Select"
import { TransactionTypeToggle, type TransactionType } from "../../UI/TransactionTypeToggle"
import { trpc } from '../../../lib/trpc'
// import { withZodSchema } from 'formik-validator-zod'
// import { z } from 'zod' - понадобится для валидации формы

export interface TransactionFormData {
  id: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  comment?: string;
}

interface AddTransactionFormProps {
  onSubmitSuccess?: () => void
}

export const AddTransactionForm = ({onSubmitSuccess} : AddTransactionFormProps) => {
    const utils = trpc.useUtils()

    const createTransaction = trpc.createTransaction.useMutation({
        onSuccess: () => {
            utils.getTransactions.invalidate()
            formik.resetForm()
            onSubmitSuccess?.() 
        }
    })
    const incomeCategories = [
        { value: 'salary', label: 'Зарплата' },
        { value: 'freelance', label: 'Фриланс' },
        { value: 'investment', label: 'Инвестиции' },
        { value: 'other', label: 'Другое' },
    ];

    const expenseCategories = [
        { value: 'food', label: 'Еда' },
        { value: 'transport', label: 'Транспорт' },
        { value: 'entertainment', label: 'Развлечения' },
        { value: 'other', label: 'Другое' },
    ];

    const formik = useFormik({
        initialValues: {
            id: '',
            type: 'income' as TransactionType,
            amount: 0,
            category: '',
            date: '',
            comment: '',
        },
        onSubmit: async (values) => {
            const dataToSend = {
                ...values,
                amount: Number(values.amount), 
            }
            await createTransaction.mutateAsync(dataToSend)
        },
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
            }}
        >
            <div className="modal-header">
                <h2>Добавить транзакцию</h2>
            </div>
            
            <div className="modal-body">
                <TransactionTypeToggle 
                    value={formik.values.type}
                    onChange={(value) => formik.setFieldValue('type', value)}
                />
                
                <div className="form-group">
                    <label htmlFor="amount">Сумма (₽)</label>
                    <Input
                        name="amount"
                        id="amount"
                        type="number"
                        formik={formik}
                        placeholder="0"                    
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="category">Категория</label>
                    <Select
                        id="category" 
                        value={formik.values.category}
                        onChange={(value) => formik.setFieldValue('category', value)}
                        options={formik.values.type === 'income' ? incomeCategories : expenseCategories}
                        placeholder="Выберите категорию"
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="date">Дата</label>
                    <Input
                        name="date"
                        id="date"
                        type="date"
                        formik={formik}
                    />
                </div>
                
                <div className="form-group">
                    <label htmlFor="comment">Комментарий (необязательно)</label>
                    <textarea 
                        id="comment" 
                        className="form-control" 
                        placeholder="Добавьте описание..."
                        value={formik.values.comment}
                        onChange={formik.handleChange} 
                    />
                </div>
            </div>
            
            <div className="modal-footer">
                <button type="button"  className="btn btn-secondary" onClick={() => formik.resetForm()}>Отмена</button>
                <button type="submit" disabled={formik.isSubmitting} className="btn btn-primary">{formik.isSubmitting ? 'Отправляется...' : 'Добавить транзакцию'}</button>
            </div>
        </form>

    )
    
}


