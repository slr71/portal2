const getUserToken = (req) => {
  const keycloakToken = (req && req.kauth && req.kauth.grant && req.kauth.grant.access_token ? req.kauth.grant.access_token : null) //req?.kauth?.grant?.access_token;
  // const sessionToken = (req && req.session && req.session['keycloak-token'] ? req.session['keycloak-token'] : null)

  // console.log('keycloak token:', keycloakToken != null)
  // console.log('session token:', sessionToken != null)

  if (keycloakToken) 
    return keycloakToken
  // if (sessionToken) // not necessary, keycloak middleware fetches session token automatically
  //   return sessionToken
}

const getUserID = (req) => {
  const accessToken = getUserToken(req)
  //console.log('accessToken:', accessToken)
  return (accessToken && accessToken.content ? accessToken.content.preferred_username : null) //req?.kauth?.grant?.access_token?.content?.preferred_username
}

// const getUserProfile = (req) => {
//   const accessToken = getUserToken(req)
//   if (accessToken) {
//     return {
//         id: accessToken.content.preferred_username,
//         attributes: {
//             email: accessToken.content.email,
//             entitlement: accessToken.content.entitlement,
//             firstName: accessToken.content.given_name,
//             lastName: accessToken.content.family_name,
//             name: accessToken.content.name,
//         }
//     }
//   } 
// }

const isAdmin = (req) => req && req.user && req.user.is_staff

const requireAdmin = async (req, res, next) => {
  if (!req.user || !req.user.is_staff)
    res.send('User not authorized').status(403);
  else
    next()
}

module.exports= {
  getUserToken,
  getUserID,
  // getUserProfile,
  isAdmin,
  requireAdmin
}