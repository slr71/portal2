

const getUserToken = (req) => {
  const keycloakToken = (req && req.kauth && req.kauth.grant && req.kauth.grant.access_token ? req.kauth.grant.access_token : null) //req?.kauth?.grant?.access_token;
  // const sessionToken = (req && req.session && req.session['keycloak-token'] ? req.session['keycloak-token'] : null)

  // console.log('keycloak token:', keycloakToken != null)
  // console.log('session token:', sessionToken != null)

  if (keycloakToken) 
    return keycloakToken
  // if (sessionToken) // not sure this is encessary, keycloak middleware may use session token automatically
  //   return sessionToken
  
  return null
}

const getUserID = (req) => {
  const accessToken = getUserToken(req)
  return (accessToken && accessToken.content ? accessToken.content.preferred_username : null) //req?.kauth?.grant?.access_token?.content?.preferred_username
}

const getUserProfile = (req) => {
  const accessToken = getUserToken(req)
  console.log('getUserProfile', accessToken)
  if (accessToken) {
    return {
        id: accessToken.content.preferred_username,
        attributes: {
            email: accessToken.content.email,
            entitlement: accessToken.content.entitlement,
            firstName: accessToken.content.given_name,
            lastName: accessToken.content.family_name,
            name: accessToken.content.name,
        }
    }
  } 
}

/**
 * Adds the access token to the Authorization header if it's present in the request.
 */
// const authTokenMiddleware = (req, res, next) => {
//   const token = getUserToken(req)
//   if (token) 
//     req.headers["Authorization"] = `Bearer ${token}`
//   next()
// }

/**
 * Returns the session store instance for the application.
 *
 * @returns {Object}
 */
// const getSessionStore = () => {
//   if (!sessionStore) {
//     sessionStore = new pgSession({
//       conString: config.dbURI,
//       tableName: "session",
//       ttl: config.sessionTTL,
//     });
//   }
//   return sessionStore
// }


module.exports= {
  getUserToken,
  getUserID,
  getUserProfile,
  // authnTokenMiddleware
}