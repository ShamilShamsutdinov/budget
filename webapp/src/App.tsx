import { TrpcProvider } from './lib/trpc'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AllTransactionsPage } from './pages/AllTransactionsPage'
import { ViewTransactionPage } from './pages/ViewTransactionPage'
import * as routes from './lib/routes'
import { Layout } from './components/Layout'
import { SignUpPage } from './pages/SignUpPage'


export const App = () => {
  return (
    <TrpcProvider>
     <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={routes.getAllTransactionsRoute()} element={<AllTransactionsPage />} />
            <Route path={routes.getViewTransactionRoute(routes.viewTransactionRouteParams)} element={<ViewTransactionPage />} />
            <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
          </Route>
        </Routes>
     </BrowserRouter>
    </TrpcProvider>
  )
}