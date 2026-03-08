<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AuthLayout from '@/layouts/AuthLayout.vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { useIdleTimer } from '@/composables/useIdleTimer'

const route = useRoute()
const layout = computed(() => (route.meta.layout === 'auth' ? AuthLayout : DashboardLayout))

useIdleTimer()
</script>
