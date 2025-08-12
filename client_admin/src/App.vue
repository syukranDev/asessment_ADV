<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <router-view />
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth.js'

const authStore = useAuthStore()

onMounted(() => {
  // notedev: init auth state from localStorage on app start
  authStore.isAuthenticated = authStore.isAuthenticated
})
</script>

<style scoped>
/* ETA */
</style>
