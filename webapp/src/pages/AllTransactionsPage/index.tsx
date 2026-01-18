import { getViewTransactionRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import { Link } from 'react-router-dom'

export const AllTransactionsPage = () => {
  const result = trpc.getTransactions.useQuery()
  
  if (result.isLoading) {
    return <div>Loading...</div>
  }
  
  if (result.isError) {
    return <div>Error: {result.error.message}</div>
  }
  
  if (!result.data) {
    return <div>No data available</div>
  }
  
  return (
    <div>
      <h1 className='text-4xl font-bold text-emerald-600 mb-6'>Все транзакции</h1>
      <p className='text-sm text-gray-400 mb-2'>Всего: {result.data.transactions.length} транзакции</p>
      {result.data.transactions.map((transaction) => (
        <div  key={transaction.id}>
          <Link className='flex justify-between items-center w-full bg-white shadow-lg p-5 rounded-4xl mb-3' to={getViewTransactionRoute({ id: transaction.id })}>
            <h2>{transaction.name}</h2>
              <div className='grid grid-cols-2 gap-2 w-75'>
                <p className='font-medium text-white py-2 px-4 bg-emerald-600 rounded-3xl border-none text-center truncate'>{transaction.transaction}</p>
                <p className='font-medium text-white py-2 px-4 bg-violet-500 rounded-3xl border-none text-center truncate'>{transaction.category}</p>
              </div>
          </Link>
        </div>
      ))}
    </div>
  )
}