import { Link, Outlet } from 'react-router-dom'
import { getAllTransactionsRoute } from '../../lib/routes'

export const Layout = () => {
  // const [isOpenIncome, setIsOpenIncome] = useState(false)
  // const [isOpenExpense, setIsOpenExpense] = useState(false)
  return (
      <div className='container'>
        <aside className='sidebar'>
          <div className='logo'>
              <div className='logo-icon'>SB</div>
              <div className='logo-text'>SmartBudget</div>
          </div>
          <nav className="nav-menu">
              <Link className='nav-item active' to={getAllTransactionsRoute()}>
                <i className="fas fa-list"></i>
                <span className='text-gray'>Все транзакции</span>
              </Link>
              <button className='nav-item income'>
                <i className="fas fa-plus-circle"></i>
                <span>Добавить доход</span>
              </button>
              <button className='nav-item expense'>
                <i className="fas fa-minus-circle"></i>
                <span>Добавить расход</span>
              </button>
          </nav>
        </aside>
        <div className='main-content'>
          <Outlet />
        </div>

        {/* <Modal isOpen={isOpenExpense} onClose={() => setIsOpenExpense(false)}>
          Расход
        </Modal> */}
      </div>
  )
}