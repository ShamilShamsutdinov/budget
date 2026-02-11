// const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
//   return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
// }

// // export const getAllTransactionsRoute = () => '/'

// export const viewTransactionRouteParams = getRouteParams({ id: true })
// export type ViewTransactionRouteParams = typeof viewTransactionRouteParams
// export const getViewTransactionRoute = ({ id }: ViewTransactionRouteParams) => `/transactions/${id}`

// export const getSignUpRoute = () => '/sign-up'

// export const getSignInRoute = () => '/sign-in'

// export const getSignOutRoute = () => '/sign-out'


import { pgr } from '../utils/pumpGetRoutes'



export const getSignUpRoute = pgr(() => '/sign-up')

export const getSignInRoute = pgr(() => '/sign-in')

export const getSignOutRoute = pgr(() => '/sign-out')

export const getAllTransactionsRoute= pgr(() => '/')

export const getViewTransactionRoute = pgr({ id: true }, ({ id }) => `/transactions/${id}`)