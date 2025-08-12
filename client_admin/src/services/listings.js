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
      const response = await api.get(`/listing/o/${id}`)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async updateListing(id, data) {
    try {
      const response = await api.put(`/listing/update/${id}`, data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },


  async createListing(data) {
    try {
      const response = await api.post('/listing/create', data)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async getUsersList() {
    try {
      const response = await api.get('/user/listings')
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  }
}
