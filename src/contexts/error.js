const ErrorContext = React.createContext()
ErrorContext.displayName = 'Error'

function useError() {
  const context = React.useContext(ErrorContext)
  if (!context) {
    throw new Error(`useError must be used within a ErrorProvider`)
  }
  return context
}

//FIXME
// function witError(WrappedComponent) {
//   return (
//     <WrappedComponent error={useError()} {...this.props} />
//   )
// }

function ErrorProvider(props) {
  const [error, setError] = React.useState(null);
  const value = React.useMemo(() => [error, setError], [
      error,
  ]);
  return <ErrorContext.Provider value={value} {...props} />;
}

export { ErrorProvider, useError };