import { Link, Outlet } from 'react-router-dom'
import { getAllTransactionsRoute } from '../../lib/routes'

export const Layout = () => {
  return (
    <div className=''>
      <p>
        <b>Мой бюджет</b>
      </p>
      <ul>
        <li>
          <Link to={getAllTransactionsRoute()}>Все транзакции</Link>
        </li>
      </ul>
      <hr />
      <div>
        <Outlet />
      </div>
    </div>
  )
}