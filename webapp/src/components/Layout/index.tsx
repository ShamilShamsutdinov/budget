import { Link, Outlet } from 'react-router-dom'
import { getAllTransactionsRoute } from '../../lib/routes'

export const Layout = () => {
  return (
    <div className='container'>
      <div className='flex pt-6'>
          <div className='flex flex-col items-center mr-8 w-50 bg-white rounded-3xl p-5 h-200'>
            <div className='w-10 h-10 bg-emerald-600 text-gray-200 rounded-[50%] flex justify-center items-center text-3xl font-bold'>$</div>
            <ul className='mt-6'>
                <li>
                    <Link className='font-medium text-black' to={getAllTransactionsRoute()}>Все транзакции</Link>
                </li>
            </ul>
          </div>
          <div className='p-5 bg-white w-full rounded-3xl'>
            <Outlet />
          </div>
      </div>
    </div>
  )
}