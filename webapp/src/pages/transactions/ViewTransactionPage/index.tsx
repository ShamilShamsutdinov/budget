import { useParams } from "react-router-dom"
import type { ViewTransactionRouteParams } from "../../../lib/routes"
import { trpc } from "../../../lib/trpc"

export const ViewTransactionPage = () => {
  const { id } = useParams() as ViewTransactionRouteParams

  const { data, error, isLoading, isFetching, isError } = trpc.getTransaction.useQuery({
    id
  })

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }

  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data?.transaction) {
    return <span>Idea not found</span>
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <div className="flex flex-col justify-center items-center w-200 min-h-50 bg-emerald-600 rounded-4xl mb-4">
        <h2 className="text-white text-4xl font-medium mb-6">Оплата</h2>
        <p className="text-white text-2xl font-medium">{data.transaction.amount}</p>
      </div>
      <div className="flex flex-col justify-center items-center w-200 min-h-50 bg-violet-500 rounded-4xl mb-4">
        <h2 className="text-white text-4xl font-medium mb-6">Категория</h2>
        <p className="text-white text-2xl font-medium">{data.transaction.category}</p>
      </div>
        {data.transaction.comment && (
            <div className="flex flex-col justify-center items-center w-200 min-h-50 bg-amber-300 rounded-4xl">
                <h2 className="text-white text-4xl font-medium mb-6">Комментарий</h2>
                <p className="text-white text-2xl font-medium">{data.transaction.comment}</p>
            </div>
        )}
    </div>
  )
}