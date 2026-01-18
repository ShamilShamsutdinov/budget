import { TrpcProvider } from './lib/trpc'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AllTransactionsPage } from './pages/AllTransactionsPage'
import { ViewTransactionPage } from './pages/ViewTransactionPage'
import { getAllTransactionsRoute, getViewTransactionRoute, viewTransactionRouteParams } from './lib/routes'


export const App = () => {
  return (
    <TrpcProvider>
     <BrowserRouter>
        <Routes>
          <Route path={getAllTransactionsRoute()} element={<AllTransactionsPage />} />
          <Route path={getViewTransactionRoute(viewTransactionRouteParams)} element={<ViewTransactionPage />} />
        </Routes>
     </BrowserRouter>
    </TrpcProvider>
  )
}