<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useTheme } from '@/composables/useTheme'
const { t, locale } = useI18n()

const { isDark, toggleDark } = useTheme()
</script>

<template>
  <nav class="flex items-center justify-between p-5 bg-gray-200 dark:bg-gray-600 dark:text-white">
    <RouterLink
      class="text-xl px-5 py-2 font-bold w-64 cursor-pointer transition hover:scale-110 active:scale-90"
      to="/"
      >{{ t('message.title') }}</RouterLink
    >
    <div class="flex items-center justify-center gap-5 flex-1">
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/"
        >{{ t('message.main') }}</RouterLink
      >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/analytics"
        >{{ t('message.analytics') }}</RouterLink
      >
      <RouterLink
        class="text-xl px-5 py-2 cursor-pointer transition hover:scale-110 active:scale-90"
        to="/favorites"
        >{{ t('message.favorites') }}</RouterLink
      >
    </div>
    <div class="flex items-center justify-center gap-5 w-64">
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="locale === 'ukr' ? '/select-ukraine.png' : '/unselect-ukraine.png'"
        :alt="t('message.choice ukr')"
        @click="locale = 'ukr'"
      />
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="locale === 'eng' ? '/select-en.png' : '/unselect-en.png'"
        :alt="t('message.choice eng')"
        @click="locale = 'eng'"
      />
      <img
        class="w-10 h-10 cursor-pointer transition hover:scale-110 active:scale-90"
        :src="isDark ? '/dark-theme.png' : '/light-theme.png'"
        :alt="t('message.change theme')"
        @click="toggleDark()"
      />
    </div>
  </nav>
</template>
