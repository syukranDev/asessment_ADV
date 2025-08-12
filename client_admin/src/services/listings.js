import api from './api.js'

export const listingsService = {
  async getListings(params = {}) {
    try {
      const response = await api.get('/listing', { params })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getListing(id) {
    try {
      const response = await api.get(`/o/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async updateListing(id, data) {
    try {
      const response = await api.put(`/update/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },


  async createListing(data) {
    try {
      const response = await api.post('/create', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
