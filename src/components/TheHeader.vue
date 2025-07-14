<script setup lang="ts">
import { ref } from 'vue'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleDark } = useTheme()

const choicedLang = ref('ukr')
</script>

<template>
  <nav class="flex items-center justify-between p-5 bg-gray-200 dark:bg-gray-600 dark:text-white">
    <RouterLink
      class="text-xl px-5 py-2 font-bold w-64 cursor-pointer transition hover:scale-110 active:scale-90"
      to="/"
      >About Countries</RouterLink
    >
    <div class="flex items-center justify-center gap-5 flex-1">
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/"
        >Main</RouterLink
      >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/analytics"
        >Analytics</RouterLink
      >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/favorites"
        >Favorites</RouterLink
      >
    </div>
    <div class="flex items-center justify-center gap-5 w-64">
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="choicedLang === 'ukr' ? '/select-ukraine.png' : '/unselect-ukraine.png'"
        alt="Choice Ukrainian"
        @click="choicedLang = 'ukr'"
      />
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="choicedLang === 'eng' ? '/select-en.png' : '/unselect-en.png'"
        alt="Choice English"
        @click="choicedLang = 'eng'"
      />
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="isDark ? '/dark-theme.png' : '/light-theme.png'"
        alt="change theme"
        @click="toggleDark()"
      />
    </div>
  </nav>
</template>
