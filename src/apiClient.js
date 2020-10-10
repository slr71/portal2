const axios = require('axios')
const qs = require('qs');

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

    // Add custom parameter serializer to encode spaces with %20 instead of '+' 
    options.paramsSerializer = (params) => qs.stringify(params)

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

  async delete(path) {
    const res = await this.request({ method: 'delete', url: `${this.baseUrl}${path}` })
    return res.data   
  }
  
  async user(id) { return await this.get(`/users/${id || 'mine'}`) } // FIXME conflict if username is "mine" -- is it a restricted username?

  async users(params) { return await this.get(`/users`, params) }

  async checkUsername(username) { return await this.post(`/exists`, { username }) }

  async checkEmail(email) { return await this.post(`/exists`, { email }) }

  async createUser(username, params) { return await this.put(`/users/${username}`, params) }

  async updateUser(id, params) { return await this.post(`/users/${id}`, params) }

  async updateMailingListSubscription(params) { return await this.post(`/mailing_lists/subscriptions`, params) }

  async updatePassword(params) { return await this.post(`/users/password`, params) } // FIXME conflict if username is "password"

  async resetPassword(params) { return await this.post(`/users/reset_password`, params) } // FIXME conflict if username is "reset_password"

  async createEmailAddress(params) { return await this.put(`/mailing_lists/email_addresses`, params) }

  async deleteEmailAddress(id) { return await this.delete(`/mailing_lists/email_addresses/${id}`) }

  async confirmEmailAddress(hmac) { return await this.post(`/confirm_email`, { hmac }) }

  async services(params) { return await this.get(`/services`, params) }

  async service(id) { return await this.get(`/services/${id}`) }

  async userProperties() { return await this.get(`/users/properties`) } // FIXME conflict if username is "properties"

  async restrictedUsernames() { return await this.get(`/users/restricted`) } // FIXME conflict if username is "restricted"

  async createRestrictedUsername(username) { return await this.put(`/users/restricted/${username}`) }

  async deleteRestrictedUsername(id) { return await this.delete(`/users/restricted/${id}`) }

  async serviceRequests(params) { return await this.get(`/services/requests`, params) }

  async serviceRequest(id) { return await this.get(`/services/requests/${id}`) }

  async createServiceRequest(id, answers) { return await this.put(`/services/${id}/requests`, { answers })}

  async updateServiceRequest(id, status, message) { return await this.post(`/services/${id}/requests`, { status, message }) }

  async workshops() { return await this.get(`/workshops`) }

  async workshop(id) { return await this.get(`/workshops/${id}`) }

  async workshopParticipants(id) { return await this.get(`/workshops/${id}/participants`) }

  async workshopRequests(id) { return await this.get(`/workshops/${id}/requests`) }

  async updateWorkshop(id, workshop) { return await this.post(`/workshops/${id}`, workshop) }

  async createWorkshopRequest(id) { return await this.put(`/workshops/${id}/requests`) }

  async createWorkshopOrganizer(workshopId, userId) { return await this.put(`/workshops/${workshopId}/organizers`, { userId }) }

  async deleteWorkshopOrganizer(workshopId, userId) { return await this.delete(`/workshops/${workshopId}/organizers/${userId}`) }

  async createWorkshopContact(workshopId, params) { return await this.put(`/workshops/${workshopId}/contacts`, params) }

  async deleteWorkshopContact(workshopId, contactId) { return await this.delete(`/workshops/${workshopId}/contacts/${contactId}`) }

  async createWorkshopService(workshopId, serviceId) { return await this.put(`/workshops/${workshopId}/services`, { serviceId }) }

  async deleteWorkshopService(workshopId, serviceId) { return await this.delete(`/workshops/${workshopId}/services/${serviceId}`) }

  async forms() { return await this.get (`/forms`) }

  async form(id) {  return await this.get(`/forms/${id}`) } // id or name

  async updateForm(id, form) { return await this.post(`/forms/${id}`, form) }

  async submitForm(id, submission) { return await this.put(`/forms/${id}/submissions`, submission) }

  async formSubmissions(params) { return await this.get(`/forms/submissions`, params) }

  async formSubmission(id) { return await this.get(`/forms/submissions/${id}`) }

  async createFormSection(section) { return await this.put(`/forms/sections`, section) }

  async updateFormSection(id, section) { return await this.post(`/forms/sections/${id}`, section) }

  async deleteFormSection(id) { return await this.delete(`/forms/sections/${id}`) }

  async createFormField(field) { return await this.put(`/forms/fields`, field) }

  async updateFormField(id, field) { return await this.post(`/forms/fields/${id}`, field) }

  async deleteFormField(id) { return await this.delete(`/forms/fields/${id}`) }
}

module.exports = PortalAPI