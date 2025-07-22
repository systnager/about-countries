<script setup lang="ts">
import type { TableData } from '@/types/Table'

defineProps<{
  tableData: TableData
}>()
</script>
<template>
  <div>
    <table class="w-full">
      <tr class="bg-gray-300 dark:bg-gray-700 text-left">
        <th
          v-for="header in tableData.headers"
          :key="header"
          class="first:whitespace-nowrap first:text-left first:pl-3 last:pr-3 last:whitespace-nowrap last:text-right"
        >
          {{ header }}
        </th>
      </tr>
      <tr
        v-for="{ id, data } in tableData.data"
        :key="id"
        class="odd:bg-gray-100 even:bg-gray-200 dark:odd:bg-gray-800 dark:even:bg-gray-900"
      >
        <td
          v-for="item in data"
          :key="item"
          class="first:whitespace-nowrap first:text-left first:pl-3 last:pr-3 last:whitespace-nowrap last:text-right"
        >
          {{ item }}
        </td>
      </tr>
    </table>
  </div>
</template>
