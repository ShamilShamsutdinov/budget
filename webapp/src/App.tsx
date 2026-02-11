import { TrpcProvider } from "./lib/trpc";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AllTransactionsPage } from "./pages/transactions/AllTransactionsPage";
import { ViewTransactionPage } from "./pages/transactions/ViewTransactionPage";
import * as routes from "./lib/routes";
import { Layout } from "./components/Layout";
import { SignUpPage } from "./pages/auth/SignUpPage";
import { SignInPage } from "./pages/auth/SignInPage";
import { SignOutPage } from "./pages/auth/SignOut";
import { AppContextProvider } from "./lib/ctx";
import { NotFoundPage } from "./pages/other/NotFoundPage";

export const App = () => {
  return (
    // <TrpcProvider>
    //   <AppContextProvider>
    //     <BrowserRouter>
    //       <Routes>
    //         <Route path={routes.getSignOutRoute()} element={<SignOutPage />} />
    //         <Route element={<Layout />}>
    //           <Route
    //             path={routes.getAllTransactionsRoute()}
    //             element={<AllTransactionsPage />}
    //           />
    //           <Route
    //             path={routes.getViewTransactionRoute(
    //               routes.viewTransactionRouteParams,
    //             )}
    //             element={<ViewTransactionPage />}
    //           />
    //           <Route path={routes.getSignUpRoute()} element={<SignUpPage />} />
    //           <Route path={routes.getSignInRoute()} element={<SignInPage />} />
    //           <Route path="*" element={<NotFoundPage />} />
    //         </Route>
    //       </Routes>
    //     </BrowserRouter>
    //   </AppContextProvider>
    // </TrpcProvider>
    <TrpcProvider>
      <AppContextProvider>
        <BrowserRouter>
          <Routes>
            <Route path={routes.getSignOutRoute.definition} element={<SignOutPage />} />
            <Route element={<Layout />}>
              <Route path={routes.getAllTransactionsRoute.definition} element={<AllTransactionsPage />} />
              <Route path={routes.getViewTransactionRoute.definition} element={<ViewTransactionPage />} />
              <Route path={routes.getSignUpRoute.definition} element={<SignUpPage />} />
              <Route path={routes.getSignInRoute.definition} element={<SignInPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AppContextProvider>
    </TrpcProvider>
  );
};
