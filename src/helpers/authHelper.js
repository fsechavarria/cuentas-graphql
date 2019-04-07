export const allowAdmin = auth => {
  if (process.env.NODE_ENV === 'development') return true
  return auth && auth.role == 'admin'
}
