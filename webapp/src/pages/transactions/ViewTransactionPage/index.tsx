import { trpc } from "../../../lib/trpc"
import { Loader } from "../../../components/UI/Loader"
import { getViewTransactionRoute } from "../../../lib/routes"
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { Link } from 'react-router-dom'
import { getAllTransactionsRoute } from '../../../lib/routes'
import { formatAmount } from "../../../utils/format"


export const ViewTransactionPage = () => {
  // const { id } = useParams() as ViewTransactionRouteParams
  const { id } = getViewTransactionRoute.useParams()

  const { data, error, isLoading, isFetching, isError } = trpc.getTransaction.useQuery({
    id
  })


  if (isLoading || isFetching) {
    return <Loader type="page"/>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data?.transaction) {
    return <span>Траназкция не найдена</span>
  }

  return (
    <>
      <ul className="breadcrumbs">
        <li className="breadcrumb-item">
          <Link to={getAllTransactionsRoute()}>Все транзакции</Link>
        </li>
        <i className="fas fa-chevron-right"></i>
        <li className="breadcrumb-item active">Детали транзакции</li>
      </ul>

      <div className="transction-detail">
          <div className="transaction-detail-content">
            <span className={`transaction-detail-amount ${data.transaction.type === 'Доход' ? 'income' : 'expense'}`}>
              {formatAmount(data.transaction.amount, data.transaction.type)}
            </span>
            <span className={`transaction-detail-category ${data.transaction.type === 'Доход' ? 'income' : 'expense'}`}>{data.transaction.category}</span>
            <div className="transaction-detail-date-block">
              <i className="far fa-calendar-alt"></i>
              <span className="transaction-detail-date">{format(new Date(data.transaction.date), 'EEEE, d MMMM yyyy', { locale: ru })}</span>
            </div>
          </div>
          {data.transaction.comment && (
            <div className="transaction-detail-content">
                <h2 className="transaction-detail-comment-title">Комментарий</h2>
                <p className="transaction-detail-comment-title-text">{data.transaction.comment}</p>
            </div>
          )}
      </div>
    </>
  )
}