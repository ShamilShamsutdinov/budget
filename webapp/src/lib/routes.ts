const getRouteParams = <T extends Record<string, boolean>>(object: T) => {
  return Object.keys(object).reduce((acc, key) => ({ ...acc, [key]: `:${key}` }), {}) as Record<keyof T, string>
}

export const getAllTransactionsRoute = () => '/'

export const viewTransactionRouteParams = getRouteParams({ id: true })
export type ViewTransactionRouteParams = typeof viewTransactionRouteParams
export const getViewTransactionRoute = ({ id }: ViewTransactionRouteParams) => `/transactions/${id}`

export const getSignUpRoute = () => '/sign-up'