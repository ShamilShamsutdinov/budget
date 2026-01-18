import { TrpcProvider } from './lib/trpc'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AllTransactionsPage } from './pages/AllTransactionsPage'
import { ViewTransactionPage } from './pages/ViewTransactionPage'
import { getAllTransactionsRoute, getViewTransactionRoute, viewTransactionRouteParams } from './lib/routes'
import { Layout } from './components/Layout'


export const App = () => {
  return (
    <TrpcProvider>
     <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path={getAllTransactionsRoute()} element={<AllTransactionsPage />} />
            <Route path={getViewTransactionRoute(viewTransactionRouteParams)} element={<ViewTransactionPage />} />
          </Route>
        </Routes>
     </BrowserRouter>
    </TrpcProvider>
  )
}