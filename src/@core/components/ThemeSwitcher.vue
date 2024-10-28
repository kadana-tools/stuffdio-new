<script setup>
import { useConfigStore } from '@core/stores/config'
import { ref, watch } from 'vue'

const props = defineProps({
  themes: {
    type: Array,
    required: true,
  },
})

const configStore = useConfigStore()
const selectedItem = ref([configStore.theme])

// Watch for changes to the theme from other sources
watch(() => configStore.theme, () => {
  selectedItem.value = [configStore.theme]
}, { deep: true })

// Toggle between light and dark themes
const toggleTheme = () => {
  configStore.theme = configStore.theme === 'light' ? 'dark' : 'light'
}
</script>

<template>
  <!-- Button that switches themes when clicked -->
  <IconBtn @click="toggleTheme" color="rgba(var(--v-theme-on-surface), var(--v-high-emphasis-opacity))">
    <!-- Show appropriate icon based on the current theme -->
    <VIcon :icon="configStore.theme === 'light' ? 'tabler-sun-high' : 'tabler-moon-stars'" />

    <VTooltip
      activator="parent"
      open-delay="1000"
      scroll-strategy="close"
    >
      <!-- Display the current theme in the tooltip -->
      <span class="text-capitalize">{{ configStore.theme === 'light' ? 'Light' : 'Dark' }}</span>
    </VTooltip>
  </IconBtn>
</template>
