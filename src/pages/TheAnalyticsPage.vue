<template>
  <div class="text-gray dark:text-white">
    <div>
      <div class="w-full border-collapse px-10 py-5">
        <h3 class="text-xl mb-5 font-bold text-center">Top 10 countries</h3>
        <table class="w-full text-center rounded-md overflow-hidden">
          <tr class="bg-gray-300 dark:bg-gray-700">
            <th>#</th>
            <th>Name</th>
            <th>Value</th>
          </tr>
          <tr
            v-for="i in 10"
            :key="i"
            class="odd:bg-gray-100 even:bg-gray-200 dark:odd:bg-gray-800 dark:even:bg-gray-900"
          >
            <td>1</td>
            <td>Some country</td>
            <td>10 000</td>
          </tr>
        </table>
      </div>
    </div>
  </div>
</template>
