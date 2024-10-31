<template>
  <!-- Apply layout-background and dynamically switch theme, wallet-connected, and route-specific classes -->
  <div
    :class="[
      'layout-background',
      isDarkTheme ? 'dark-theme' : 'light-theme',
      hasErrorMessage ? 'wallet-not-connected' : (isWalletConnected || isWalletSearched) ? 'wallet-connected' : 'wallet-not-connected',
      routeBackgroundClass // Dynamically apply the class based on the current route
    ]"
  >
    <Component
      v-bind="layoutAttrs"
      :is="configStore.appContentLayoutNav === AppContentLayoutNav.Vertical ? DefaultLayoutWithVerticalNav : DefaultLayoutWithHorizontalNav"
    >
      <AppLoadingIndicator ref="refLoadingIndicator" />

      <RouterView v-slot="{ Component }">
        <Suspense
          :timeout="0"
          @fallback="isFallbackStateActive = true"
          @resolve="isFallbackStateActive = false"
        >
          <Component :is="Component" />
        </Suspense>
      </RouterView>
    </Component>
  </div>
</template>

<script setup>
import { useWalletStore } from '@/store/walletStore'; // Import walletStore
import { useConfigStore } from '@core/stores/config';
import { AppContentLayoutNav } from '@layouts/enums';
import { switchToVerticalNavOnLtOverlayNavBreakpoint } from '@layouts/utils';
import { computed, defineAsyncComponent, ref, watch } from 'vue';
import { useRoute } from 'vue-router'; // Import useRoute to access the current route

const DefaultLayoutWithHorizontalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithHorizontalNav.vue'))
const DefaultLayoutWithVerticalNav = defineAsyncComponent(() => import('./components/DefaultLayoutWithVerticalNav.vue'))

// Access the configStore where the theme is managed
const configStore = useConfigStore()

// Access the wallet store
const walletStore = useWalletStore()

// Detect if the theme is dark based on configStore
const isDarkTheme = computed(() => configStore.theme === 'dark')

// Check if the wallet is connected or searched
const isWalletConnected = computed(() => walletStore.isWalletConnected)
const isWalletSearched = computed(() => walletStore.isWalletSearched)

// Access the error message from the store
const hasErrorMessage = computed(() => walletStore.hasErrorMessage);


// ℹ️ This will switch to vertical nav when the defined breakpoint is reached when in horizontal nav layout
switchToVerticalNavOnLtOverlayNavBreakpoint()

const { layoutAttrs, injectSkinClasses } = useSkins()
injectSkinClasses()

// SECTION: Loading Indicator
const isFallbackStateActive = ref(false)
const refLoadingIndicator = ref(null)

watch([isFallbackStateActive, refLoadingIndicator], () => {
  if (isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.fallbackHandle()
  if (!isFallbackStateActive.value && refLoadingIndicator.value)
    refLoadingIndicator.value.resolveHandle()
}, { immediate: true })

watch(isDarkTheme, (newValue) => {
  if (newValue) {
    document.body.classList.add('dark-mode');
  } else {
    document.body.classList.remove('dark-mode');
  }
}, { immediate: true });
// !SECTION

// Get current route to change the background based on the page
const route = useRoute();

// Compute the class for the background based on the route
const routeBackgroundClass = computed(() => {
  if (route.path === '/rewards') {
    return 'rewards-background';
  } else if (route.path === '/overview') {
    return 'overview-background';
  } else if (route.path === '/project') {
    return 'project-background';
  }
  return ''; // Default or no specific background
});
</script>

<style lang="scss">
// Import layouts styles
@use "@layouts/styles/default-layout";

.layout-background {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 100vh;

  // When the theme is light and the wallet is NOT connected
  &.light-theme:not(.wallet-connected) {
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.0) 20%,
      rgba(255, 255, 255, 0.3) 98%),
    url('../assets/images/illustrations/FeastOfSnails_v2.png');
  }

  // When the theme is dark and the wallet is NOT connected
  &.dark-theme:not(.wallet-connected) {
    background-image: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0.0) 20%,
      rgba(47, 51, 73, 0.5) 98%),  /* Fades to dark */
    url('../assets/images/illustrations/FeastOfSnails_v2.png');
  }

  // When the wallet is connected, show the background image based on the route
  &.wallet-connected {
    background-attachment: fixed; /* Keeps the background fixed in place */
    background-clip: padding-box; /* Clips background only to the padding area */
  }

  // // Custom background for the /my-rewards route
  // &.wallet-connected.rewards-background {
  //   height: 370px; /* Limit the height to 370px */
    // background-image: url('../assets/images/illustrations/NewDerpetonia.png'); /* example: NewDerpetonia.png Add your connected image */
  //   background-size: cover;
  //   background-position: center 110px;  // so changing this actually changes the appearing height on the page. If this is set to 370px, same as the height defined above, there is no img visible
  //   background-repeat: no-repeat;
  // }

  // Custom backgrounds with responsive background-position

  // Custom background for the /my-rewards route
  &.wallet-connected.rewards-background {
    height: 370px;
    background-image: url('../assets/images/illustrations/Pred-Mothership-Full.png');
    background-size: cover;
    background-repeat: no-repeat;
    
    // Default background position for larger screens
    background-position: center 110px;

    // Adjust background position for screens smaller than 600px
    @media (max-width: 600px) {
      background-position: center 133px;
    }
  }

  // Custom background for the /my-overview route
  &.wallet-connected.overview-background {
    height: 370px;
    background-image: url('../assets/images/illustrations/SoMuchFun_v2.png');
    background-size: cover;
    background-repeat: no-repeat;

    // Default background position for larger screens
    background-position: center 110px; // this sets the position of the top side of the background image. It should align with the bottom of the nav bar. Now set manually....

    // Adjust background position for screens smaller than 600px
    @media (max-width: 600px) {
      background-position: center 133px;
    }
  }

  // Custom background for the /project route
  &.wallet-connected.project-background {
    height: 370px;
    background-image: url('../assets/images/illustrations/NewDerpetonia.png');
    background-size: cover;
    background-repeat: no-repeat;

    // Default background position for larger screens
    background-position: center 110px;

    // Adjust background position for screens smaller than 600px
    @media (max-width: 600px) {
      background-position: center 133px;
    }
  }
}

body {
  &.dark-mode {
    background-color: #2F3349; /* Your dark theme background color */
  }
}
</style>


