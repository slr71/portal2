const UserContext = React.createContext()
UserContext.displayName = 'User'

function useUser() {
  const context = React.useContext(UserContext)
  if (!context) {
      throw new Error(`useUser must be used within a UserProvider`)
  }
  return context
}

//FIXME
// function withUser(WrappedComponent) {
//   return (
//     <WrappedComponent user={useUser()} {...this.props} />
//   )
// }

function UserProvider(props) {
  return <UserContext.Provider value={props.user} {...props} />
}

export { UserProvider, useUser };