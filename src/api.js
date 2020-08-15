const axios = require('axios')
const config = require('./config.json')
const { getUserToken } = require('./auth');

// const APIContext = React.createContext()
// APIContext.displayName = 'API'

// function useAPI() {
//   const context = React.useContext(APIContext)
//   if (!context) {
//       throw new Error(`useAPI must be used within an APIProvider`)
//   }
//   return context
// }

// function withAPI() {
//   return <ComposedComponent api={useAPI()} {...props} />
// }

// function APIProvider(props) {
//   const [api, setAPI] = React.useState()
//   const value = React.useMemo(() => [api, setAPI], [api])
//   return <APIContext.Provider value={value} {...props} />
// }

// export { APIProvider, useAPI, withAPI };

class PortalAPI {
  constructor({ req, token }) {
    if (req)
      this.token = getUserToken(req).token
    else
      this.token = token
  }

  request(options) {
    if (!options.headers)
      options.headers = {}
    options.headers['Content-Type'] = 'application/json'
    if (this.token)
      options.headers['Authorization'] = `Bearer ${this.token}`
    
    options.timeout = 30*1000

    return axios.request(options)
  }
  
  async get(path) {
    const res = await this.request({ method: 'get', url: `${config.apiBaseUrl}${path}` })
    return res.data
  }

  async put(path, data) {
    const res = await this.request({ method: 'put', url: `${config.apiBaseUrl}${path}`, data })
    return res.data
  }

  async post(path, data) {
    const res = await this.request({ method: 'post', url: `${config.apiBaseUrl}${path}`, data })
    return res.data   
  }
  
  async user(id) { // FIXME conflict if username is "mine" -- is it a restricted username?
    if (!id) 
      id = 'mine'
    return await this.get(`/users/${id}`) 
  }

  async services() { return await this.get(`/services`) }

  async service(id) { return await this.get(`/services/${id}`) }

  async userProperties() { return await this.get(`/users/properties`) } // FIXME conflict if username is "properties"

  async restrictedUsernames() { return await this.get(`/users/restricted`) } // FIXME conflict if username is "restricted"

  async serviceRequests() { return await this.get(`/services/requests`) }

  async serviceRequest(id) { return await this.get(`/services/requests/${id}`) }

  async createServiceRequest(id, answers) { return await this.put(`/services/${id}/requests`, { answers })}

  async updateServiceRequest(id, status, message) { return await this.post(`/services/${id}/requests`, { status, message }) }

  async workshops() { return await this.get(`/workshops`) }

  async workshop(id) { return await this.get(`/workshops/${id}`) }

  async createWorkshopRequest(id) { return await this.put(`/workshops/${id}/requests`) }

  async forms() { return await this.get (`/forms`) }

  async form(id) {  return await this.get(`/forms/${id}`) } // id or name

  async formSubmission(id) { return await this.get(`/forms/submissions/${id}`) }
}

module.exports = PortalAPI