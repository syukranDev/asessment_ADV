import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/auth.js'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ListingsView from '../views/ListingsView.vue'
import EditListingView from '../views/EditListingView.vue'

const routes = [
  {
    path: '/',
    redirect: '/dashboard'
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { requiresAuth: false }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: DashboardView,
    meta: { requiresAuth: true }
  },
  {
    path: '/listings',
    name: 'Listings',
    component: ListingsView,
    meta: { requiresAuth: true }
  },
  {
    path: '/listings/:id/edit',
    name: 'EditListing',
    component: EditListingView,
    meta: { requiresAuth: true },
    props: true
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.name === 'Login' && isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
