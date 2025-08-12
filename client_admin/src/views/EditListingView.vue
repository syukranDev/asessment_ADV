<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Edit Listing
          </h2>
        </div>
        <div class="mt-4 flex md:mt-0 md:ml-4">
          <router-link
            to="/listings"
            class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Listings
          </router-link>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading listing...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="rounded-md bg-red-50 p-4 mb-6">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error: {{ error }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Edit Form -->
      <div v-else class="bg-white shadow rounded-lg">
        <form @submit.prevent="handleSubmit" class="space-y-6 p-6">
          <!-- Name Field -->
          <div>
            <label for="name" class="block text-sm font-medium text-gray-700">
              Name *
            </label>
            <input
              type="text"
              id="name"
              v-model="form.name"
              required
              class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter listing name"
            />
          </div>


          <!-- Latitude Field -->
          <div>
            <label for="latitude" class="block text-sm font-medium text-gray-700">
              Latitude *
            </label>
            <input
              type="number"
              id="latitude"
              v-model="form.latitude"
              step="any"
              required
              class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter latitude"
            />
          </div>

          <!-- Longitude Field -->
          <div>
            <label for="longitude" class="block text-sm font-medium text-gray-700">
              Longitude *
            </label>
            <input
              type="number"
              id="longitude"
              v-model="form.longitude"
              step="any"
              required
              class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter longitude"
            />
          </div>

          <!-- User ID Field -->
          <div>
            <label for="user_id" class="block text-sm font-medium text-gray-700">
              User ID (optional)
            </label>
            <input
              type="number"
              id="user_id"
              v-model="form.user_id"
              min="1"
              class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Enter user ID"
            />
          </div>

          <!-- Description Field (Read-only for display) -->
          <div v-if="originalListing?.description">
            <label for="description" class="block text-sm font-medium text-gray-700">
              Description (Auto-generated)
            </label>
            <textarea
              id="description"
              v-model="originalListing.description"
              rows="4"
              readonly
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-700 sm:text-sm"
            ></textarea>
            <p class="mt-1 text-sm text-gray-500">
              This description is auto-generated and cannot be edited.
            </p>
          </div>

          <!-- Form Error -->
          <div v-if="formError" class="rounded-md bg-red-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-red-800">
                  {{ formError }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Form Success -->
          <div v-if="formSuccess" class="rounded-md bg-green-50 p-4">
            <div class="flex">
              <div class="ml-3">
                <h3 class="text-sm font-medium text-green-800">
                  {{ formSuccess }}
                </h3>
              </div>
            </div>
          </div>

          <!-- Form Actions -->
          <div class="flex justify-end space-x-3">
            <router-link
              to="/listings"
              class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </router-link>
            <button
              type="submit"
              :disabled="saving"
              class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AppLayout from '../components/AppLayout.vue'
import { useListingsStore } from '../stores/listings.js'

const route = useRoute()
const router = useRouter()
const listingsStore = useListingsStore()

const loading = ref(true)
const saving = ref(false)
const error = ref('')
const formError = ref('')
const formSuccess = ref('')
const originalListing = ref(null)

const form = reactive({
  name: '',
  latitude: '',
  longitude: '',
  user_id: ''
})

const loadListing = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const listingData = await listingsStore.getListing(route.params.id)
    originalListing.value = listingData
    
  form.name = listingData.name || ''
  form.latitude = listingData.latitude || ''
  form.longitude = listingData.longitude || ''
  form.user_id = listingData.user_id || ''
  } catch (err) {
    error.value = err.errMsg || 'Failed to load listing'
  } finally {
    loading.value = false
  }
}

const handleSubmit = async () => {
  saving.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    const updateData = {
      name: form.name,
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      user_id: form.user_id ? parseInt(form.user_id) : undefined
    }

    await listingsStore.updateListing(route.params.id, updateData)
    
    formSuccess.value = 'Listing updated successfully!'
    
    setTimeout(() => {
      router.push('/listings')
    }, 1500)
    
  } catch (err) {
    formError.value = err.errMsg || 'Failed to update listing'
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadListing()
})
</script>
