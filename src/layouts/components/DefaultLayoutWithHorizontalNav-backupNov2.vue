<script setup>
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import navItems from '@/navigation/horizontal/index.js'
import { useWalletStore } from '@/store/walletStore'
import WalletModal from '@/views/my-overview/WalletModal.vue'
import { useConfigStore } from '@core/stores/config'; // Import configStore for theme
import HorizontalNavLayout from '@layouts/components/HorizontalNavLayout.vue'
import { computed } from 'vue'

// Get the wallet store
const walletStore = useWalletStore()

// Get the config store to check the theme
const configStore = useConfigStore()

// Check if the current theme is dark
const isDarkTheme = computed(() => configStore.theme === 'dark')

// Import logos
import stuffdLogoSmall from '@/assets/images/illustrations/Play-button-as-a-D-v2.png'; // New logo for small screens
import stuffdLogoLight from '@/assets/images/illustrations/STUFFD-transp-v2-dark.webp'; // New logo for light theme
import stuffdLogoDark from '@/assets/images/illustrations/STUFFD-transp-v2.webp'; // Current logo for dark theme

// Reactive state for screen size
const isSmallScreen = ref(window.innerWidth <= 600)

// Update isSmallScreen on window resize
const updateScreenSize = () => {
  isSmallScreen.value = window.innerWidth <= 600
}

// Add event listeners for screen resize
onMounted(() => {
  window.addEventListener('resize', updateScreenSize)
})
onUnmounted(() => {
  window.removeEventListener('resize', updateScreenSize)
})


// Function to handle wallet connection
const handleWalletConnected = (connected) => {
  walletStore.setWalletConnected(connected) // Update Pinia state
}

// Dynamically choose the logo based on the theme and screen size
const stuffdLogo = computed(() => {
  if (isSmallScreen.value) {
    return stuffdLogoSmall // Use small logo for screens below 600px
  }
  return isDarkTheme.value ? stuffdLogoDark : stuffdLogoLight
})

// Dynamically set logo height based on screen size
const logoHeight = computed(() => (isSmallScreen.value ? '50px' : '60px'))


// console.log('Imported HorizontalNavLayout:', HorizontalNavLayout);
// console.log('Imported navItems:', navItems);

</script>


<template>
  <div class="layout-background">
    <HorizontalNavLayout :nav-items="navItems">
      <!-- 👉 navbar -->
      <template #navbar>
        <RouterLink to="/" class="app-logo d-flex align-center gap-x-3 logo">
          <!-- Bind the logo based on the theme and screen size -->
          <img :src="stuffdLogo" alt="STUFFD Logo" class="app-logo-image" :style="{ height: logoHeight }" />
       </RouterLink>

        <VSpacer />

        <NavbarThemeSwitcher />
        
        <WalletModal @wallet-connected="handleWalletConnected" class="Wallet-Connect"/>
      </template>

      <!-- 👉 Pages -->
      <slot />

      <!-- 👉 Footer -->
      <template #footer>
        <Footer />
      </template>

      <!-- 👉 Customizer -->
      <TheCustomizer />
    </HorizontalNavLayout>
  </div>
</template>


<style lang="scss">

.logo {
  margin-left: -100px;
}

.Wallet-Connect {
  margin-left: 25px; // to create some space between the themeselection toggle and the wallet connect button
  margin-right: -100px;
}

.logo {

  @media (min-width: 600px) {
    margin-left: -100px;
  }
}

.Wallet-Connect {
  margin-left: 25x; // to create some space between the themeselection toggle and the wallet connect button
  margin-right: 0px;

  @media (min-width: 600px) {
    margin-right: -100px;
  }
}
</style>
