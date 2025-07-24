<script setup lang="ts">
import type { TableData } from '@/types/Table'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

defineProps<{
  tableData: TableData
}>()
</script>
<template>
  <div>
    <table class="w-full">
      <tbody>
        <tr class="bg-neutral-300 dark:bg-neutral-700 text-left">
          <th
            v-for="header in tableData.headers"
            :key="header"
            class="first:whitespace-nowrap first:text-left first:pl-3 last:pr-3 last:whitespace-nowrap last:text-right"
          >
            {{ t(header) }}
          </th>
        </tr>
        <tr
          v-for="{ id, data } in tableData.data"
          :key="id"
          class="odd:bg-neutral-100 even:bg-neutral-200 dark:odd:bg-neutral-800 dark:even:bg-neutral-900"
        >
          <td
            v-for="item in data"
            :key="item"
            class="first:whitespace-nowrap first:text-left first:pl-3 last:pr-3 last:whitespace-nowrap last:text-right"
          >
            {{ item }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
