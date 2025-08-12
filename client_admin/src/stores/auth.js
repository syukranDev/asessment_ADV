import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authService } from '../services/auth.js'

export const useAuthStore = defineStore('auth', () => {
  const isAuthenticated = ref(authService.isAuthenticated())
  const userData = ref(authService.getUserData())

  const login = async (username, password) => {
    try {
      const response = await authService.login(username, password)
      
      if (response.status === '200') {
        authService.setAuthData(response.result.access_token, {
          user_id: response.result.user_id,
          role_type: response.result.role_type,
          expires_at: response.result.expires_at
        })
        
        isAuthenticated.value = true
        userData.value = authService.getUserData()
        
        return response
      } else {
        throw new Error(response.errMsg || 'Login failed')
      }
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    authService.logout()
    isAuthenticated.value = false
    userData.value = null
  }

  const isAdmin = computed(() => {
    return userData.value?.role_type === 'a'
  })

  return {
    isAuthenticated,
    userData,
    isAdmin,
    login,
    logout
  }
})
