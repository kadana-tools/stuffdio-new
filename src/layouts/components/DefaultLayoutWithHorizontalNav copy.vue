<script setup>
import navItems from '@/navigation/horizontal'
import { themeConfig } from '@themeConfig'
import Footer from '@/layouts/components/Footer.vue'
import NavBarNotifications from '@/layouts/components/NavBarNotifications.vue'
import NavSearchBar from '@/layouts/components/NavSearchBar.vue'
import NavbarShortcuts from '@/layouts/components/NavbarShortcuts.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'
import { HorizontalNavLayout } from '@layouts'
import WalletModal from '@/views/my-overview/WalletModal.vue'
import { useWalletStore } from '@/store/walletStore'
import { ref, computed } from 'vue'
import { useConfigStore } from '@core/stores/config' // Import configStore for theme

// Get the wallet store
const walletStore = useWalletStore()

// Get the config store to check the theme
const configStore = useConfigStore()

// Check if the current theme is dark
const isDarkTheme = computed(() => configStore.theme === 'dark')

// Import logos
import stuffdLogoDark from '@/assets/images/illustrations/STUFFD-transp-v2.webp' // Current logo for dark theme
import stuffdLogoLight from '@/assets/images/illustrations/STUFFD-transp-v2-dark.webp' // New logo for light theme

// Function to handle wallet connection
const handleWalletConnected = (connected) => {
  walletStore.setWalletConnected(connected) // Update Pinia state
}

// Dynamically choose the logo based on the theme
const stuffdLogo = computed(() => (isDarkTheme.value ? stuffdLogoDark : stuffdLogoLight))
</script>


<template>
  <div class="layout-background">
    <HorizontalNavLayout :nav-items="navItems">
      <!-- 👉 navbar -->
      <template #navbar>
        <RouterLink to="/" class="app-logo d-flex align-center gap-x-3 logo">
          <!-- Bind the logo based on the theme -->
          <img :src="stuffdLogo" alt="STUFFD Logo" class="app-logo-image" style="height: 60px;" />
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

// .logo {
//   margin-left: -100px;
// }

// .Wallet-Connect {
//   margin-left: 25px; // to create some space between the themeselection toggle and the wallet connect button
//   margin-right: -100px;
// }

.logo {
  margin-left: -30px;

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