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
    console.log('api:user:', id)
    const res = await this.axios.get(`/users/${id}`)
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
    const res = await this.axios.get(`${this.baseUrl}/services/requests`)
    return res.data
  }

  async serviceRequest(id) {
    const res = await this.axios.get(`${this.baseUrl}/services/requests/${id}`)
    return res.data
  }

  async createServiceRequest(id, answers) {
    const res = await this.axios.put(`${this.baseUrl}/services/${id}/requests`, { answers })
    return res
  }

  async updateServiceRequest(id, status, message) {
    const res = await this.axios.post(`${this.baseUrl}/services/${id}/requests`, { status, message })
    return res
  }

  async workshops() {
    const res = await this.axios.get(`${this.baseUrl}/workshops`)
    return res.data
  }

  async workshop(id) { 
    const res = await this.axios.get(`${this.baseUrl}/workshops/${id}`)
    return res.data
  }

  async createWorkshopRequest(id) {
    const res = await this.axios.put(`${this.baseUrl}/workshops/${id}/requests`)
    return res
  }

  async forms() {
    const res = await this.axios.get(`${this.baseUrl}/forms`)
    return res.data
  }

  async form(id) { // id or name
    const res = await this.axios.get(`${this.baseUrl}/forms/${id}`)
    return res.data
  }
}

module.exports.PortalApi = PortalApi