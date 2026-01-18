import { trpc } from '../../lib/trpc'

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
      <h1 className='text-6xl font-bold text-red-600'>All Transactions</h1>
      <p>Total: {result.data.transactions.length} transactions</p>
      {result.data.transactions.map((transaction) => (
        <div key={transaction.id}>
          <h2>{transaction.name}</h2>
          <p>{transaction.transactions}</p>
          <p>{transaction.category}</p>
        </div>
      ))}
    </div>
  )
}