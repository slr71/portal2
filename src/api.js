const axios = require('axios')
const config = require('./config.json')

class PortalApi {
  constructor(params) {
    this.baseUrl = params && params.baseUrl ? params.baseUrl : config.apiBaseUrl
  }

  async user(id) {
    if (!id)
      id = 'mine'
    const res = await axios.get(`${this.baseUrl}/users/${id}`)
    return res.data
  }

  async services() {
    const res = await axios.get(`${this.baseUrl}/services`)
    return res.data
  }

  async service(id) { // id or name
    const res = await axios.get(`${this.baseUrl}/services/${id}`)
    return res.data
  }

  async serviceRequests() {
    const res = await axios.get(`${this.baseUrl}/services/requests`)
    return res.data
  }

  async serviceRequest(id) {
    const res = await axios.get(`${this.baseUrl}/services/requests/${id}`)
    return res.data
  }

  async createServiceRequest(id, answers) {
    const res = await axios.put(`${this.baseUrl}/services/${id}/requests`, { answers })
    return res
  }

  async updateServiceRequest(id, status, message) {
    const res = await axios.post(`${this.baseUrl}/services/${id}/requests`, { status, message })
    return res
  }

  async workshops() {
    const res = await axios.get(`${this.baseUrl}/workshops`)
    return res.data
  }

  async workshop(id) { 
    const res = await axios.get(`${this.baseUrl}/workshops/${id}`)
    return res.data
  }

  async createWorkshopRequest(id) {
    const res = await axios.put(`${this.baseUrl}/workshops/${id}/requests`)
    return res
  }

  async forms() {
    const res = await axios.get(`${this.baseUrl}/forms`)
    return res.data
  }

  async form(id) { // id or name
    const res = await axios.get(`${this.baseUrl}/forms/${id}`)
    return res.data
  }
}

module.exports = new PortalApi()