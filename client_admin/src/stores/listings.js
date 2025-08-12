import { defineStore } from 'pinia'
import { ref } from 'vue'
import { listingsService } from '../services/listings.js'

export const useListingsStore = defineStore('listings', () => {
  const listings = ref([])
  const loading = ref(false)
  const error = ref(null)
  const pagination = ref({
    count: 0,
    limit: 10,
    offset: 0,
    page: 1
  })

  const fetchListings = async (params = {}) => {
    loading.value = true
    error.value = null
    
    if (!params.page) params.page = 1
    if (!params.limit_rows) params.limit_rows = 10
    
    try {
      const response = await listingsService.getListings(params)
      
      if (response.status === 'success') {
        listings.value = response.places_listing.rows
        pagination.value = {
          count: response.places_listing.count,
          limit: response.places_listing.limit,
          offset: response.places_listing.offset,
          page: params.page
        }
      }
    } catch (err) {
      error.value = err.errMsg || 'Failed to fetch listings'
    } finally {
      loading.value = false
    }
  }

  const updateListing = async (id, data) => {
    try {
      const response = await listingsService.updateListing(id, data)
      
      if (response.status === 'success') {
        // notedev: update the listing in the local state
        const index = listings.value.findIndex(listing => listing.id === id)
        if (index !== -1) {
          Object.assign(listings.value[index], data)
        }
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  const deleteListing = async (id) => {
    try {
      const response = await listingsService.deleteListing(id)
      
      if (response.status === 'success') {
        const index = listings.value.findIndex(listing => listing.id === id)
        if (index !== -1) {
          listings.value.splice(index, 1)
        }
      }
      
      return response
    } catch (error) {
      throw error
    }
  }

  const getListing = async (id) => {
    try {
      const response = await listingsService.getListing(id)
      return response.data
    } catch (error) {
      throw error
    }
  }

  return {
    listings,
    loading,
    error,
    pagination,
    fetchListings,
    updateListing,
    deleteListing,
    getListing
  }
})
