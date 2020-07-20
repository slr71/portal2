const axios = require('axios')
const config = require('./config.json')

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

  async user() {
    const res = await axios.get(`${this.baseUrl}/users/mine`)
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

  async createServiceRequest(serviceId, answers) {
    const res = await axios.put(`${this.baseUrl}/services/${serviceId}/requests`)
    return res
  }
}

module.exports = new PortalApi()