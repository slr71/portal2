const axios = require('axios')

class PortalAPI {
  constructor(params) {
      this.baseUrl = params ? params.baseUrl : '/api'
      this.token = params ? params.token : null
  }

  request(options) {
    if (!options.headers)
      options.headers = {}
    options.headers['Content-Type'] = 'application/json'
    if (this.token)
      options.headers['Authorization'] = `Bearer ${this.token}`
    
    options.timeout = 30*1000

    console.log(`axios request: token ${this.token != null}, ${options.method} ${options.url}`)
    return axios.request(options)
  }
  
  async get(path, params) { // params can contain optional "offset" & "limit" properties
    const res = await this.request({ method: 'get', url: `${this.baseUrl}${path}`, params })
    return res.data
  }

  async put(path, data) {
    const res = await this.request({ method: 'put', url: `${this.baseUrl}${path}`, data })
    return res.data
  }

  async post(path, data) {
    const res = await this.request({ method: 'post', url: `${this.baseUrl}${path}`, data })
    return res.data   
  }
  
  async user(id) { // FIXME conflict if username is "mine" -- is it a restricted username?
    if (!id) 
      id = 'mine'
    return await this.get(`/users/${id}`) 
  }

  async users(params) { return await this.get(`/users`, params) }

  async updateUser(id, params) { return await this.post(`/users/${id}`, params ) }

  async services(params) { return await this.get(`/services`, params) }

  async service(id) { return await this.get(`/services/${id}`) }

  async userProperties() { return await this.get(`/users/properties`) } // FIXME conflict if username is "properties"

  async restrictedUsernames() { return await this.get(`/users/restricted`) } // FIXME conflict if username is "restricted"

  async serviceRequests(params) { return await this.get(`/services/requests`, params) }

  async serviceRequest(id) { return await this.get(`/services/requests/${id}`) }

  async createServiceRequest(id, answers) { return await this.put(`/services/${id}/requests`, { answers })}

  async updateServiceRequest(id, status, message) { return await this.post(`/services/${id}/requests`, { status, message }) }

  async workshops() { return await this.get(`/workshops`) }

  async workshop(id) { return await this.get(`/workshops/${id}`) }

  async createWorkshopRequest(id) { return await this.put(`/workshops/${id}/requests`) }

  async forms() { return await this.get (`/forms`) }

  async form(id) {  return await this.get(`/forms/${id}`) } // id or name

  async submitForm(id, submission) { return await this.put(`/forms/${id}/submissions`, submission) }

  async formSubmissions(params) { return await this.get(`/forms/submissions`, params) }

  async formSubmission(id) { return await this.get(`/forms/submissions/${id}`) }
}

module.exports = PortalAPI