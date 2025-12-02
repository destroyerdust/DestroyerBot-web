<template>
  <div id="app">
    <router-view />
    <NotificationToast />
  </div>
</template>

<script setup>
import NotificationToast from '@/components/ui/NotificationToast.vue'
</script>
