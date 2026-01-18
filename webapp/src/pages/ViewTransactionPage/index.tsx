import { useParams } from "react-router-dom"
import type { ViewTransactionRouteParams } from "../../lib/routes"

export const ViewTransactionPage = () => {
  const { id } = useParams() as ViewTransactionRouteParams
  return (
    <div>
      <h1>{id}</h1>
      <p>15 000р</p>
      <p>Развлечения</p>
      <p>Сходили в ресторан</p>
    </div>
  )
}