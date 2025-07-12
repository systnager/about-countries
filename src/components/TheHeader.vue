<script setup lang="ts">
import { ref } from 'vue'

const isLightTheme = ref(true)
</script>

<template>
  <nav class="flex items-center justify-between p-5 bg-gray-100">
    <div class="flex items-center justify-center gap-5 flex-1">
      <RouterLink class="text-xl px-5 py-2 hover:shadow-xl rounded-lg transition" to="/"
        >Main</RouterLink
      >
      <RouterLink class="text-xl px-5 py-2 hover:shadow-xl rounded-lg transition" to="/analytics"
        >Analytics</RouterLink
      >
      <RouterLink class="text-xl px-5 py-2 hover:shadow-xl rounded-lg transition" to="/favorites"
        >Favorites</RouterLink
      >
    </div>
    <div>
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="isLightTheme ? '/light-theme.png' : '/dark-theme.png'"
        alt="change theme"
        @click="isLightTheme = !isLightTheme"
      />
    </div>
  </nav>
</template>
