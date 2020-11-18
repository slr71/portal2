const models = require('../models');
const User = models.account_user;
const config = require('../../config.json')

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

const getUser = async (req, _, next) => {
  const userId = config.debugUser || getUserID(req)
  if (userId) {
      const user = await User.findOne({ where: { username: userId } })
      req.user = JSON.parse(JSON.stringify(user.get({ plain: true })))
  }
  if (next) next()
}

const isAdmin = (req) => req && req.user && req.user.is_staff

const requireAdmin = async (req, res, next) => {
  if (!req.user)
    await getUser(req)
  if (!req.user || !req.user.is_staff)
    res.send('User not authorized').status(403);
  else if (next)
    next()
}

// Handle promise exceptions in Express.  Not really auth related but used all over the place.
// From https://zellwk.com/blog/async-await-express/
const asyncHandler = fn => (req, res, next) => {
  return Promise
      .resolve(fn(req, res, next))
      .catch(next)
}

module.exports= {
  getUserToken,
  getUserID,
  getUser,
  isAdmin,
  requireAdmin,
  asyncHandler
}