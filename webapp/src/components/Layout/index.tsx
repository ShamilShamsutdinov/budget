import { Link, Outlet, useLocation } from 'react-router-dom'
import { getAllTransactionsRoute, getSignInRoute, getSignOutRoute, getSignUpRoute } from '../../lib/routes'
import { useMe } from '../../lib/ctx'


export const Layout = () => {
  const me = useMe()
  const location = useLocation() 

  const isActive = (path: string) => {
    return location.pathname === path
  }
  return (
      <div className='container'>
        <aside className='sidebar'>
          <div className='logo'>
              <div className='logo-icon'>SB</div>
              <div className='logo-text'>SmartBudget</div>
          </div>
          <nav className="nav-menu">
            {me ? (
              <>
                <Link className={`nav-item ${isActive(getAllTransactionsRoute()) ? 'active' : ''}`} to={getAllTransactionsRoute()}>
                    <i className="fas fa-list"></i>
                    <span className='text-gray'>Все транзакции</span>
                </Link>
                <Link className='nav-item' to={getSignOutRoute()}>
                  <i className="fas fa-user-plus"></i>
                  <span className='text-gray'>Выйти ({me.nick})</span>
                </Link>
              </>
            ) : (
              <>
               <Link className={`nav-item ${isActive(getSignUpRoute()) ? 'active' : ''}`} to={getSignUpRoute()}>
                  <i className="fas fa-user-plus"></i>
                  <span className='text-gray'>Зарегистрироваться</span>
                </Link>
                <Link className={`nav-item ${isActive(getSignInRoute()) ? 'active' : ''}`} to={getSignInRoute()}>
                  <i className="fas fa-sign-in-alt"></i>
                  <span className='text-gray'>Войти</span>
                </Link>
              </>
            )}
          </nav>
        </aside>
        <div className='main-content'>
          <Outlet />
        </div>
      </div>
  )
}