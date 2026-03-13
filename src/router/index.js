import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue'),
      meta: { guestOnly: true, layout: 'auth' },
    },
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/categories',
      name: 'categories',
      component: () => import('@/views/CategoriesView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/income',
      name: 'income',
      component: () => import('@/views/IncomeView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/expense',
      name: 'expense',
      component: () => import('@/views/ExpenseView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/reports',
      name: 'reports',
      component: () => import('@/views/ReportsView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/activity-logs',
      name: 'activity-logs',
      component: () => import('@/views/ActivityLogView.vue'),
      meta: { requiresAuth: true, title: 'Log Aktivitas' },
    },
  ],
})

router.beforeEach((to) => {
  const authStore = useAuthStore()

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    return { name: 'login' }
  }

  if (to.meta.guestOnly && authStore.isLoggedIn) {
    return { name: 'dashboard' }
  }
})

export default router
