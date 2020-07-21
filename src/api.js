const axios = require('axios')
const config = require('./config.json')
const { Minimize } = require('@material-ui/icons')

// Proxy to backend API -- based on Sonora
// module.exports = function() {
//   const api = express.Router()

//   api.get(
//       "/",
//       //auth.authnTokenMiddleware,
//       async (req, res) => {
//         const response = await axios.get('http://localhost:3022/services/coge')
//         res.send(response.data)
//       }
//   )

//   return api
// }

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

  async service(id) {
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

  async createServiceRequest(serviceId, answers) {
    const res = await axios.put(`${this.baseUrl}/services/${serviceId}/requests`, { answers })
    return res
  }

  async updateServiceRequest(serviceId, status, message) {
    const res = await axios.post(`${this.baseUrl}/services/${serviceId}/requests`, { status, message })
    return res
  }
}

module.exports = new PortalApi()