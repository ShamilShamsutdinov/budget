import { useState } from 'react'
import { Modal } from '../../components/UI/Modal'
import { getViewTransactionRoute } from '../../lib/routes'
import { Link } from 'react-router-dom'
import { AddTransactionForm, type TransactionFormData } from '../../components/Forms/AddTransactionForm'
import { trpc } from '../../lib/trpc'
import { getCategoryLabel, getTypeLabel } from '../../utils/translate';
import {format} from 'date-fns/format' ;
import { formatDateForInput } from '../../utils/date'
import type { TrpcRouterOutput } from '../../../../backend/src/router/index'
import { useMe } from '../../lib/ctx'

export const AllTransactionsPage = () => {
  const me = useMe()

  const result = trpc.getTransactions.useQuery(undefined, {
    enabled: !!me,
  })

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<TransactionFormData | null>(null)

  type TransactionFromAPI = TrpcRouterOutput['getTransactions']['transactions'][0]

  const handleEditClick = (transaction: TransactionFromAPI) => {
    setEditingTransaction({
      id: transaction.id,
      type: transaction.type as 'income' | 'expense',
      amount: transaction.amount,
      category: transaction.category,
      date: formatDateForInput(transaction.date),
      comment: transaction.comment || '',
    })
    setIsEditModalOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditModalOpen(false)
    setEditingTransaction(null)
  }

  const handleAddSuccess = () => {
    setIsAddModalOpen(false)
  }

  if (result.isLoading) {
    return <div>Loading...</div>
  }
  
  if (result.isError) {
    return <div>Error: {result.error.message}</div>
  }
  
  if (!result.data) {
    return <div>No data available</div>
  }

  if (!me) {
    return (
      <div>
        <h1>Все транзакции</h1>
        <p>Пожалуйста, авторизуйтесь, чтобы видеть свои транзакции.</p>
      </div>
    )
  }
  
  return (
    <>
      <header className="header">
          <div>
              <h1>Все транзакции</h1>
              <div className="transactions-count">Всего {result.data.transactions.length} транзакции</div>
          </div>
          <button disabled={!me?.id} className={`add-btn ${!me?.id ? 'disabled' : ''}`} onClick={() => setIsAddModalOpen(true)}>
              <i className="fas fa-plus"></i> 
              <span>Добавить транзакцию</span>
          </button>
      </header>
      <div className="stats-cards">
          <div className="stat-card income-stat">
              <div className="stat-icon">
                  <i className="fas fa-arrow-down"></i>
              </div>
              <div className="stat-info">
                  <h3>Общий доход</h3>
                  <div className="stat-amount">85,430 ₽</div>
                  <div className="stat-change">+12% с прошлого месяца</div>
              </div>
          </div>
          
          <div className="stat-card expense-stat">
              <div className="stat-icon">
                  <i className="fas fa-arrow-up"></i>
              </div>
              <div className="stat-info">
                  <h3>Общий расход</h3>
                  <div className="stat-amount">42,150 ₽</div>
                  <div className="stat-change">+5% с прошлого месяца</div>
              </div>
          </div>
          
          <div className="stat-card">
              <div className="stat-icon">
                  <i className="fas fa-wallet"></i>
              </div>
              <div className="stat-info">
                  <h3>Баланс</h3>
                  <div className="stat-amount">43,280 ₽</div>
                  <div className="stat-change">Текущий месяц</div>
              </div>
          </div>
      </div> 
      <div className="transactions-container">
            <div className="transactions-header">
                <h2>Последние транзакции</h2>
                <div className="filters">
                    <button className="filter-btn active">Все</button>
                    <button className="filter-btn">Доходы</button>
                    <button className="filter-btn">Расходы</button>
                </div>
            </div>
            {result.data.transactions.map((transaction) => (
                <div className='transactions-list' key={transaction.id}>
                    <Link className={`transaction-item ${transaction.type === 'income' ? 'income-item' : 'expense-item'}`} to={getViewTransactionRoute({ id: transaction.id })}>
                        <div className="transaction-icon">
                            <i className="fas fa-money-bill-wave"></i>
                        </div>
                        <div className="transaction-info">
                            <h4>{getCategoryLabel(transaction.category, transaction.type)}</h4>
                            <p>{getTypeLabel(transaction.type)}</p>
                        </div>
                        <div className="transaction-date">
                            {format(transaction.date, 'yyyy-MM-dd')}
                        </div>
                        <div className="transaction-amount">{transaction.amount}</div>
                        <div className="transaction-actions">
                            <button 
                               className="action-btn edit" 
                               title="Редактировать"
                               onClick={(e) => {
                                    e.preventDefault()
                                    e.stopPropagation()
                                    handleEditClick(transaction)
                               }}
                            >
                                <i className="fas fa-edit"></i>
                            </button>
                            <button className="action-btn delete" title="Удалить">
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </Link>
                </div>
            ))}
      </div>
      
      {/* <div className="transactions-container">
            <div className="transactions-header">
                <h2>Последние транзакции</h2>
                <div className="filters">
                    <button className="filter-btn active">Все</button>
                    <button className="filter-btn">Доходы</button>
                    <button className="filter-btn">Расходы</button>
                </div>
            </div>
            
            <div className="transactions-list">
                <div className="transaction-item income-item">
                    <div className="transaction-icon">
                        <i className="fas fa-money-bill-wave"></i>
                    </div>
                    <div className="transaction-info">
                        <h4>Зарплата</h4>
                        <p>Основной доход</p>
                    </div>
                    <div className="transaction-date">
                        Пн, 15 мая
                    </div>
                    <div className="transaction-amount">+45,000 ₽</div>
                    <div className="transaction-actions">
                        <button className="action-btn edit" title="Редактировать">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" title="Удалить">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div className="transaction-item expense-item">
                    <div className="transaction-icon">
                        <i className="fas fa-shopping-cart"></i>
                    </div>
                    <div className="transaction-info">
                        <h4>Продукты</h4>
                        <p>Супермаркет</p>
                    </div>
                    <div className="transaction-date">
                        Вт, 16 мая
                    </div>
                    <div className="transaction-amount">-3,850 ₽</div>
                    <div className="transaction-actions">
                        <button className="action-btn edit" title="Редактировать">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete" title="Удалить">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <div className="transaction-item expense-item">
                    <div className="transaction-icon">
                        <i className="fas fa-film"></i>
                    </div>
                    <div className="transaction-info">
                        <h4>Кино</h4>
                        <p>Развлечения</p>
                    </div>
                    <div className="transaction-date">
                        Ср, 17 мая
                    </div>
                    <div className="transaction-amount">-1,200 ₽</div>
                    <div className="transaction-actions">
                        <button className="action-btn edit">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                
                <div className="transaction-item income-item">
                    <div className="transaction-icon">
                        <i className="fas fa-freelance"></i>
                    </div>
                    <div className="transaction-info">
                        <h4>Фриланс</h4>
                        <p>Дополнительный доход</p>
                    </div>
                    <div className="transaction-date">
                        Чт, 18 мая
                    </div>
                    <div className="transaction-amount">+12,500 ₽</div>
                    <div className="transaction-actions">
                        <button className="action-btn edit">
                            <i className="fas fa-edit"></i>
                        </button>
                        <button className="action-btn delete">
                            <i className="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>

           
      </div> */}

        <div className="chart-container">
            <div className="chart-header">
                <h2>Статистика доходов и расходов</h2>
                <div className="chart-period">
                    <button className="period-btn active">Неделя</button>
                    <button className="period-btn">Месяц</button>
                    <button className="period-btn">Год</button>
                </div>
            </div>
            <div className="chart-placeholder">
                <div>
                    <i className="fas fa-chart-line"></i>
                    <div>Здесь будет график доходов и расходов</div>
                </div>
            </div>
        </div>

        <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
            <AddTransactionForm onSubmitSuccess={handleAddSuccess}/>
        </Modal>

        <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)}>
            {editingTransaction && (
            <AddTransactionForm 
                initialData={editingTransaction}
                onSubmitSuccess={handleEditSuccess}
            />
            )}
        </Modal>
    </>
  )
}