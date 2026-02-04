export const Loader = ({ type }: { type: 'page' | 'section' }) => (
  <span className={`loader type-${type}`} />
)