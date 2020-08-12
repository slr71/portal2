const axios = require('axios')

class PortalApi {
  constructor(params) {
    if (!params || !params.baseUrl) {
      console.error('PortalApi: baseUrl param is missing')
      return
    }

    this.axios = axios.create({
      baseURL: params.baseUrl,
      timeout: 10*1000,
      headers: params && params.token ? { 'Authorization': `Bearer ${params.token}` } : null
    })
  }

  async user(id) {
    if (!id)
      id = 'mine'
    const res = await this.axios.get(`/users/${id}`) // FIXME conflict if username is "mine"
    return res.data
  }

  async userProperties() {
    const res = await this.axios.get(`/users/properties`) // FIXME conflict if username is "properties"
    return res.data
  }

  async restrictedUsernames() {
    const res = await this.axios.get(`/users/restricted`) // FIXME conflict if username is "properties"
    return res.data
  }

  async services() {
    const res = await this.axios.get(`/services`)
    return res.data
  }

  async service(id) { // id or name
    const res = await this.axios.get(`/services/${id}`)
    return res.data
  }

  async serviceRequests() {
    const res = await this.axios.get(`/services/requests`)
    return res.data
  }

  async serviceRequest(id) {
    const res = await this.axios.get(`/services/requests/${id}`)
    return res.data
  }

  async createServiceRequest(id, answers) {
    const res = await this.axios.put(`/services/${id}/requests`, { answers })
    return res
  }

  async updateServiceRequest(id, status, message) {
    const res = await this.axios.post(`/services/${id}/requests`, { status, message })
    return res
  }

  async workshops() {
    const res = await this.axios.get(`/workshops`)
    return res.data
  }

  async workshop(id) { 
    const res = await this.axios.get(`/workshops/${id}`)
    return res.data
  }

  async createWorkshopRequest(id) {
    const res = await this.axios.put(`/workshops/${id}/requests`)
    return res
  }

  async forms() {
    const res = await this.axios.get(`/forms`)
    return res.data
  }

  async form(id) { // id or name
    const res = await this.axios.get(`/forms/${id}`)
    return res.data
  }

  async formSubmission(id) {
    const res = await this.axios.get(`/forms/submissions/${id}`)
    return res.data
  }
}

module.exports.PortalApi = PortalApi