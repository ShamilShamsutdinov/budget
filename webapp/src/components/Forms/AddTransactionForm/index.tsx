import { Input } from "../../UI/Input"
import { useFormik } from 'formik'
import { Select } from "../../UI/Select"
import { TransactionTypeToggle, type TransactionType } from "../../UI/TransactionTypeToggle"
import { trpc } from '../../../lib/trpc'

export interface TransactionFormData {
  id?: string;
  type: TransactionType;
  amount: number;
  category: string;
  date: string;
  comment?: string;
}

interface AddTransactionFormProps {
  initialData?: TransactionFormData;
  onSubmitSuccess?: () => void
}

export const AddTransactionForm = ({ initialData, onSubmitSuccess }: AddTransactionFormProps) => {
    const utils = trpc.useUtils()
    const isEditMode = !!initialData

    const createTransaction = trpc.createTransaction.useMutation({
        onSuccess: () => {
            utils.getTransactions.invalidate()
            utils.getTransaction.invalidate({ id: initialData?.id })
            utils.getPeriodComparison.invalidate()
            utils.getTransactionCategoryStats.invalidate()
            utils.getTransactionsYears.invalidate();
            formik.resetForm()
            onSubmitSuccess?.() 
        }
    })

    const updateTransaction = trpc.updateTransaction.useMutation({
        onSuccess: () => {
            utils.getTransactions.invalidate()
            utils.getTransaction.invalidate({ id: initialData?.id })
            utils.getPeriodComparison.invalidate()
            utils.getTransactionCategoryStats.invalidate()
            utils.getTransactionsYears.invalidate();
            formik.resetForm()
            onSubmitSuccess?.()
        }
    })

    const incomeCategories = [
        { value: 'Зарплата', label: 'Зарплата' },
        { value: 'Фриланс', label: 'Фриланс' },
        { value: 'Инвестиции', label: 'Инвестиции' },
        { value: 'Перевод', label: 'Перевод' },
        { value: 'Другое', label: 'Другое' },
    ];

    const expenseCategories = [
        { value: 'Еда', label: 'Еда' },
        { value: 'Транспорт', label: 'Транспорт' },
        { value: 'Развлечения', label: 'Развлечения' },
        { value: 'Перевод', label: 'Перевод' },
        { value: 'Отпуск', label: 'Отпуск' },
        { value: 'Здоровье', label: 'Здоровье' },
        { value: 'Фаст-фуд', label: 'Фаст-фуд' },
        { value: 'Авто', label: 'Авто' },
        { value: 'Кредит', label: 'Кредит' },
        { value: 'ЖКХ', label: 'ЖКХ' },
        { value: 'Другое', label: 'Другое' },
    ];

    const formik = useFormik({
        initialValues: {
            id: initialData?.id || '',
            type: initialData?.type || 'Доход' as TransactionType,
            amount: initialData?.amount || 0,
            category: initialData?.category || '',
            date: initialData?.date || '',
            comment: initialData?.comment || '',
        },
        onSubmit: async (values) => {
            const dataToSend = {
                ...values,
                amount: Number(values.amount),
            }

            if (isEditMode && values.id) {
                await updateTransaction.mutateAsync({
                    transactionId: values.id,
                    ...dataToSend,
                })
            } else {
                await createTransaction.mutateAsync(dataToSend)
            }
        },
        enableReinitialize: true, // автоматически обновит форму при изменении initialData
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                formik.handleSubmit()
            }}
        >
            <div className="modal-header">
                <h2>{isEditMode ? 'Редактировать транзакцию' : 'Добавить транзакцию'}</h2>
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
                        options={formik.values.type === 'Доход' ? incomeCategories : expenseCategories}
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
                        name="comment"
                    />
                </div>
            </div>
            
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => {
                    formik.resetForm()
                    onSubmitSuccess?.()
                }}>
                    Отмена
                </button>
                <button 
                    type="submit" 
                    disabled={formik.isSubmitting || createTransaction.isLoading || updateTransaction.isLoading} 
                    className="btn btn-primary"
                >
                    {formik.isSubmitting || createTransaction.isLoading || updateTransaction.isLoading 
                        ? 'Сохраняется...' 
                        : isEditMode ? 'Сохранить изменения' : 'Добавить транзакцию'}
                </button>
            </div>
        </form>
    )
}

