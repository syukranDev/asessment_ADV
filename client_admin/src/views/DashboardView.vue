<template>
  <AppLayout>
    <div class="px-4 py-6 sm:px-0">
      <div class="border-4 border-dashed border-gray-200 rounded-lg p-8">
        <div class="text-center">
          <h1 class="text-3xl font-bold text-gray-900 mb-4">Welcome to Admin Dashboard</h1>
          <p class="text-lg text-gray-600 mb-8">Manage your listings and system data</p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            <!-- Total Listings Card -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Total Listings
                      </dt>
                      <dd class="text-lg font-medium text-gray-900">
                        {{ totalListings }}
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Actions -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        Quick Actions
                      </dt>
                      <dd class="mt-2">
                        <router-link
                          to="/listings"
                          class="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Manage Listings
                        </router-link>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>

            <!-- System Status -->
            <div class="bg-white overflow-hidden shadow rounded-lg">
              <div class="p-5">
                <div class="flex items-center">
                  <div class="flex-shrink-0">
                    <svg class="h-6 w-6 text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div class="ml-5 w-0 flex-1">
                    <dl>
                      <dt class="text-sm font-medium text-gray-500 truncate">
                        System Status
                      </dt>
                      <dd class="text-lg font-medium text-green-600">
                        Online
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="mt-8">
            <div class="bg-white shadow rounded-lg">
              <div class="px-4 py-5 sm:p-6">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">
                  Recent Listings
                </h3>
                <div v-if="recentListings.length > 0" class="overflow-hidden">
                  <ul class="divide-y divide-gray-200">
                    <li v-for="listing in recentListings" :key="listing.id" class="py-4">
                      <div class="flex items-center space-x-4">
                        <div class="flex-1 min-w-0">
                          <p class="text-sm font-medium text-gray-900 truncate">
                            {{ listing.name }}
                          </p>
                          <p class="text-sm text-gray-500">
                            Lat: {{ listing.latitude }}, Lng: {{ listing.longitude }}
                          </p>
                        </div>
                        <div class="inline-flex items-center text-sm text-gray-500">
                          ID: {{ listing.id }}
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
                <div v-else class="text-center py-8">
                  <p class="text-gray-500">No listings available</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AppLayout from '../components/AppLayout.vue'
import { useListingsStore } from '../stores/listings.js'

const listingsStore = useListingsStore()

const totalListings = computed(() => listingsStore.pagination.count)
const recentListings = computed(() => listingsStore.listings.slice(0, 5))

onMounted(async () => {
  await listingsStore.fetchListings({ limit_rows: 10 })
})
</script>
