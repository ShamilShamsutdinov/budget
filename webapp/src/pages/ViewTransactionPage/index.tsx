import { useParams } from "react-router-dom"
import type { ViewTransactionRouteParams } from "../../lib/routes"
import { trpc } from "../../lib/trpc"

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
    <div>
      <p>{data.transaction.transaction}</p>
      <p>{data.transaction.category}</p>
      <p>{data.transaction.comment}</p>
    </div>
  )
}