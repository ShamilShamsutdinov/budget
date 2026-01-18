import { TrpcProvider } from './lib/trpc'
import { AllTransactionsPage } from './pages/AllTransactionsPage'


export const App = () => {
  return (
    <TrpcProvider>
      <AllTransactionsPage />
    </TrpcProvider>
  )
}