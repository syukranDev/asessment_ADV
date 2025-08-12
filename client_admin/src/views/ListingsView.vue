<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-0">
      <!-- Header -->
      <div class="md:flex md:items-center md:justify-between mb-6">
        <div class="flex-1 min-w-0">
          <h2 class="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Listings Management
          </h2>
        </div>
        <div class="mt-4 md:mt-0">
          <button @click="showCreateModal = true" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            + Create Listing
          </button>
        </div>
    <!-- Create Listing Modal -->
    <div v-if="showCreateModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showCreateModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3 text-center">
          <h3 class="text-lg font-medium text-gray-900">Create Listing</h3>
          <form @submit.prevent="submitCreateListing" class="mt-4 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Name</label>
              <input v-model="createForm.name" type="text" placeholder="Write a place name..." required class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Latitude</label>
              <input v-model="createForm.latitude" type="number" placeholder="Latitude of the place..." step="any" required class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Longitude</label>
              <input v-model="createForm.longitude" type="number" placeholder="Longitude of the place..." step="any" required class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Assign To User (optional)</label>
              <select v-model="createForm.user_id" class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                <option value="">-- Not Assigned --</option>
                <option v-for="u in users" :key="u.id" :value="u.id">{{ u.id }} - {{ u.name || 'User '+u.id }}</option>
              </select>
              <p v-if="usersLoading" class="mt-1 text-xs text-gray-500">Loading users...</p>
              <p v-if="usersError" class="mt-1 text-xs text-red-500">{{ usersError }}</p>
            </div>
            <!-- <div>
              <label class="block text-sm font-medium text-gray-700">Description (optional)</label>
              <textarea v-model="createForm.description" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea>
            </div> -->
            <div class="flex justify-end space-x-2 mt-4">
              <button type="button" @click="showCreateModal = false" class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300">Cancel</button>
              <button type="submit" :disabled="createLoading" class="px-4 py-2 bg-indigo-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:opacity-50">{{ createLoading ? 'Creating...' : 'Create' }}</button>
            </div>
            <div v-if="createError" class="text-red-500 text-sm mt-2">{{ createError }}</div>
          </form>
        </div>
      </div>
    </div>
      </div>

      <!-- Search and Filters -->
      <div class="bg-white shadow rounded-lg mb-6">
        <div class="px-4 py-5 sm:p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label for="search" class="block text-sm font-medium text-gray-700">Search</label>
              <input
                type="text"
                id="search"
                v-model="searchQuery"
                @input="handleSearch"
                placeholder="Search listings..."
                class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label for="sort" class="block text-sm font-medium text-gray-700">Sort by</label>
              <select
                id="sort"
                v-model="sortBy"
                @change="handleSort"
                class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="created_at">Date Created</option>
                <option value="name">Name</option>
                <option value="id">ID</option>
              </select>
            </div>
            <div>
              <label for="order" class="block text-sm font-medium text-gray-700">Order</label>
              <select
                id="order"
                v-model="sortOrder"
                @change="handleSort"
                class="text-black mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="listingsStore.loading" class="text-center py-12">
        <div class="inline-flex items-center px-4 py-2 font-semibold leading-6 text-sm shadow rounded-md text-gray-500 bg-white">
          <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="listingsStore.error" class="rounded-md bg-red-50 p-4 mb-6">
        <div class="flex">
          <div class="ml-3">
            <h3 class="text-sm font-medium text-red-800">
              Error: {{ listingsStore.error }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Listings Table -->
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <div v-if="listingsStore.listings.length === 0" class="text-center py-12">
          <p class="text-gray-500">No listings found</p>
        </div>
        
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="listing in listingsStore.listings" :key="listing.id" class="px-6 py-4">
            <div class="flex items-center justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center">
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900 truncate">
                      {{ listing.name }}
                    </p>
                    <p class="text-sm text-gray-500">
                      ID: {{ listing.id }} | Lat: {{ listing.latitude }}, Lng: {{ listing.longitude }} | User ID: {{ listing.user_id }}
                    </p>
                    <!-- <p v-if="listing.description" class="text-sm text-gray-500 mt-1">
                      {{ listing.description.substring(0, 100) }}...
                    </p> -->
                  </div>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <router-link
                  :to="`/listings/${listing.id}/edit`"
                  class="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Edit
                </router-link>
                <button
                  @click="handleDelete(listing.id, listing.name)"
                  class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        </ul>

        <!-- Pagination -->
        <div v-if="listingsStore.listings.length > 0" class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
          <div class="flex items-center justify-between">
            <div class="flex-1 flex justify-between sm:hidden">
              <button
                @click="previousPage"
                :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                @click="nextPage"
                :disabled="!hasNextPage"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Showing
                  <span class="font-medium">{{ startItem }}</span>
                  to
                  <span class="font-medium">{{ endItem }}</span>
                  of
                  <span class="font-medium">{{ listingsStore.pagination.count }}</span>
                  results
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    @click="previousPage"
                    :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    @click="nextPage"
                    :disabled="!hasNextPage"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" @click="showDeleteModal = false">
      <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white" @click.stop>
        <div class="mt-3 text-center">
          <h3 class="text-lg font-medium text-gray-900">Delete Listing</h3>
          <div class="mt-2 px-7 py-3">
            <p class="text-sm text-gray-500">
              Are you sure you want to delete "{{ deleteItem.name }}"? This action cannot be undone.
            </p>
          </div>
          <div class="flex justify-center space-x-4 mt-4">
            <button
              @click="showDeleteModal = false"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              @click="confirmDelete"
              :disabled="deleteLoading"
              class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-300 disabled:opacity-50"
            >
              {{ deleteLoading ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useListingsStore } from '../stores/listings.js'

import { listingsService } from '../services/listings.js'

const listingsStore = useListingsStore()

const showCreateModal = ref(false)
const createForm = ref({ name: '', latitude: '', longitude: '', user_id: '', description: '' })
// Users dropdown state
const users = ref([])
const usersLoading = ref(false)
const usersError = ref('')

const loadUsers = async () => {
  if (users.value.length > 0) return // notedev: cache users if already loaded
  usersLoading.value = true
  usersError.value = ''
  try {
    const response = await listingsService.getUsersList()
    if (response.status === 'success') {
      users.value = response.data
    } else {
      usersError.value = response.errMsg || 'Failed to load users'
    }
  } catch (e) {
    usersError.value = e.errMsg || 'Failed to load users'
  } finally {
    usersLoading.value = false
  }
}

watch(showCreateModal, (val) => {
  if (val) loadUsers()
})
const createLoading = ref(false)
const createError = ref('')

const searchQuery = ref('')
const sortBy = ref('created_at')
const sortOrder = ref('desc')
const currentPage = ref(1)
const itemsPerPage = 10

const showDeleteModal = ref(false)
const deleteItem = ref({ id: null, name: '' })
const deleteLoading = ref(false)

const startItem = computed(() => {
  return ((listingsStore.pagination.page - 1) * listingsStore.pagination.limit) + 1
})

const endItem = computed(() => {
  const page = listingsStore.pagination.page
  const limit = listingsStore.pagination.limit
  const count = listingsStore.pagination.count
  return Math.min(page * limit, count)
})

const hasNextPage = computed(() => {
  const page = listingsStore.pagination.page
  const limit = listingsStore.pagination.limit
  const count = listingsStore.pagination.count
  return page * limit < count
})

const fetchListings = async () => {
  const params = {
    page: currentPage.value,
    limit_rows: itemsPerPage,
    sort_column: sortBy.value,
    sort_by: sortOrder.value,
  }

  if (searchQuery.value.trim()) {
    params.keyword = searchQuery.value.trim()
  }

  await listingsStore.fetchListings(params)
}

const handleSearch = () => {
  currentPage.value = 1
  fetchListings()
}

const handleSort = () => {
  currentPage.value = 1
  fetchListings()
}

const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchListings()
  }
}

const nextPage = () => {
  if (hasNextPage.value) {
    currentPage.value++
    fetchListings()
  }
}

const handleDelete = (id, name) => {
  deleteItem.value = { id, name }
  showDeleteModal.value = true
}

const confirmDelete = async () => {
  deleteLoading.value = true
  try {
    await listingsStore.deleteListing(deleteItem.value.id)
    showDeleteModal.value = false
    await fetchListings()
  } catch (error) {
    console.error('Delete failed:', error)
  } finally {
    deleteLoading.value = false
  }
}

const submitCreateListing = async () => {
  createLoading.value = true
  createError.value = ''
  try {
    const payload = {
      name: createForm.value.name,
      latitude: createForm.value.latitude,
      longitude: createForm.value.longitude,
      // description: createForm.value.description
    }
    if (createForm.value.user_id) {
      payload.assignedTo = createForm.value.user_id
    }
    const response = await listingsService.createListing(payload)
    if (response.status === 'success') {
      showCreateModal.value = false
      createForm.value = { name: '', latitude: '', longitude: '', description: '' }
      await fetchListings()
    } else {
      createError.value = response.errMsg || 'Failed to create listing.'
    }
  } catch (error) {
    createError.value = error.errMsg || 'Failed to create listing.'
  } finally {
    createLoading.value = false
  }
}

onMounted(() => {
  fetchListings()
})
</script>
