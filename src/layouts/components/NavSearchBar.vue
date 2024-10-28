<script setup>
import { ref } from 'vue'

// This will hold the search query text
const searchQuery = ref('')

// Function to handle the search
const onSearch = () => {
  // You can add your search logic or emit an event here
}
</script>

<template>
  <div class="nav-search-bar">
    <AppTextField
      v-model="searchQuery"
      placeholder="Submit $handle or wallet address"
      @keydown.enter="onSearch" 
      style="max-inline-size: 300px;min-inline-size: 300px;"
    />
  </div>
</template>

<style scoped>
/* You can add styling here to match the look of your nav search bar */
.nav-search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>