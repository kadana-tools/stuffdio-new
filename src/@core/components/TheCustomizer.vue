<!-- THIS IS A CUSTOM VERSION OF THE CUSTOMIZER, WHERE INSTEAD OF LETTING THE USER TO DEFINE SOME STYLES, THESE STYLES ARE PRECONFIGURED -->

<script setup>
// Import existing dependencies
import { useStorage } from '@vueuse/core'
import { PerfectScrollbar } from 'vue3-perfect-scrollbar'
import { useTheme } from 'vuetify'
import { staticPrimaryColor, staticPrimaryDarkenColor } from '@/plugins/vuetify/theme'
import { Direction, Layout, Skins, Theme } from '@core/enums'
import { useConfigStore } from '@core/stores/config'
import horizontalLight from '@images/customizer-icons/horizontal-light.svg'
import borderSkin from '@images/customizer-icons/border-light.svg'
import { AppContentLayoutNav, ContentWidth } from '@layouts/enums'
import { cookieRef, namespaceConfig } from '@layouts/stores/config'

// State & Setup
const isNavDrawerOpen = ref(false)
const configStore = useConfigStore()
const vuetifyTheme = useTheme()

// Locking down specific customizations
configStore.appContentLayoutNav = AppContentLayoutNav.Horizontal // Lock layout to Horizontal
configStore.theme = Theme.Light // Lock theme to Light mode
configStore.skin = Skins.Bordered // Lock skin to Bordered
configStore.appContentWidth = ContentWidth.Boxed // Lock content width to Compact
configStore.isVerticalNavCollapsed = false // Disable collapsed navigation
configStore.isAppRTL = false // Lock direction to LTR

// Lock primary color to default
const setPrimaryColor = () => {
  vuetifyTheme.themes.value[vuetifyTheme.name.value].colors.primary = staticPrimaryColor
  vuetifyTheme.themes.value[vuetifyTheme.name.value].colors['primary-darken-1'] = staticPrimaryDarkenColor
}

// Predefined options
const layouts = computed(() => [
  {
    bgImage: horizontalLight,
    value: Layout.Horizontal,
    label: 'Horizontal',
    disabled: true, // Lock to Horizontal
  },
])

const themeSkin = computed(() => [
  {
    bgImage: borderSkin,
    value: Skins.Bordered,
    label: 'Bordered',
    disabled: true, // Lock to Bordered skin
  },
])

const contentWidth = computed(() => [
  {
    bgImage: horizontalLight, // Adjust if you have a specific icon for this
    value: ContentWidth.Boxed,
    label: 'Compact',
    disabled: true, // Lock to Compact content width
  },
])

const direction = computed(() => [
  {
    bgImage: horizontalLight, // Adjust if you have a specific icon for this
    value: Direction.Ltr,
    label: 'Left to right',
    disabled: true, // Lock to LTR (Left-to-right)
  },
])

const customPrimaryColor = ref(staticPrimaryColor) // Lock primary color to default
setPrimaryColor() // Call the function to apply the locked color
</script>

<template>
  <div class="d-lg-block d-none">
    <!-- Customizer Drawer -->
    <VNavigationDrawer
      v-model="isNavDrawerOpen"
      temporary
      touchless
      border="none"
      location="end"
      width="400"
      elevation="10"
      :scrim="false"
      class="app-customizer"
    >
      <!-- Header -->
      <div class="customizer-heading d-flex align-center justify-space-between">
        <div>
          <h6 class="text-h6">
            Theme Customizer
          </h6>
          <p class="text-body-2 mb-0">
            Predefined Selections
          </p>
        </div>

        <div class="d-flex align-center gap-1">
          <VBtn icon variant="text" color="medium-emphasis" size="small" @click="isNavDrawerOpen = false">
            <VIcon icon="tabler-x" color="high-emphasis" size="24" />
          </VBtn>
        </div>
      </div>

      <VDivider />

      <!-- Customizer Options -->
      <PerfectScrollbar tag="ul" :options="{ wheelPropagation: false }">
        <!-- Theming -->
        <CustomizerSection title="Theming" :divider="false">
          <div class="d-flex flex-column gap-2">
            <h6 class="text-h6">
              Primary Color (Locked)
            </h6>
            <div class="d-flex app-customizer-primary-colors">
              <div
                class="primary-color-wrapper"
                :style="{ backgroundColor: customPrimaryColor }"
                :class="vuetifyTheme.current.value.colors.primary === customPrimaryColor ? 'active' : ''"
              >
                <div :style="{ backgroundColor: customPrimaryColor }"></div>
              </div>
            </div>
          </div>

          <!-- Skins -->
          <div class="d-flex flex-column gap-2">
            <h6 class="text-h6">Skins (Locked to Bordered)</h6>
            <CustomRadiosWithImage
              v-model:selected-radio="configStore.skin"
              :radio-content="themeSkin"
              disabled
            />
          </div>
        </CustomizerSection>

        <!-- Layout (Locked) -->
        <CustomizerSection title="Layout">
          <div class="d-flex flex-column gap-2">
            <h6 class="text-h6">Layout (Locked to Horizontal)</h6>
            <CustomRadiosWithImage
              v-model:selected-radio="currentLayout"
              :radio-content="layouts"
              disabled
            />
          </div>
        </CustomizerSection>

        <!-- Content Width (Locked) -->
        <CustomizerSection title="Content Width">
          <div class="d-flex flex-column gap-2">
            <h6 class="text-h6">Content Width (Locked to Compact)</h6>
            <CustomRadiosWithImage
              v-model:selected-radio="configStore.appContentWidth"
              :radio-content="contentWidth"
              disabled
            />
          </div>
        </CustomizerSection>

        <!-- Direction (Locked) -->
        <CustomizerSection title="Direction">
          <div class="d-flex flex-column gap-2">
            <h6 class="text-h6">Direction (Locked to LTR)</h6>
            <CustomRadiosWithImage
              v-model:selected-radio="currentDir"
              :radio-content="direction"
              disabled
            />
          </div>
        </CustomizerSection>
      </PerfectScrollbar>
    </VNavigationDrawer>
  </div>
</template>

<style>
/* Your existing styles here */
</style>
