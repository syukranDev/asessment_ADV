import api from './api.js'

export const authService = {
  async login(username, password) {
    try {
      const response = await api.post('/a/login', {
        username,
        password
      })
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  async register(userData) {
    try {
      const response = await api.post('/a/register', userData)
      return response.data
    } catch (error) {
      throw error.response?.data || error.message
    }
  },

  logout() {
    localStorage.removeItem('access_token')
    localStorage.removeItem('user_data')
  },

  isAuthenticated() {
    return !!localStorage.getItem('access_token')
  },

  getToken() {
    return localStorage.getItem('access_token')
  },

  getUserData() {
    const userData = localStorage.getItem('user_data')
    return userData ? JSON.parse(userData) : null
  },

  setAuthData(token, userData) {
    localStorage.setItem('access_token', token)
    localStorage.setItem('user_data', JSON.stringify(userData))
  }
}
