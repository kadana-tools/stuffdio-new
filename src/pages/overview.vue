<script setup>
import { useWalletStore } from '@/store/walletStore';
import SearchOrConnect from '@/views/my-overview/SearchOrConnect.vue';
import SizesAndFortification from '@/views/my-overview/SizesAndFortification.vue';
import WalletPivottable from '@/views/my-overview/WalletPivottable.vue';
// import backgroundImage from '../assets/images/illustrations/SoMuchFun.png';



// Get the wallet store
const walletStore = useWalletStore()

// Track the wallet connection state using Pinia
const isWalletConnected = computed(() => walletStore.isWalletConnected)
const isBackendDataAvailable = computed(() => walletStore.backendDataRetrieved);


// Get the error message status from the store
const hasErrorMessage = computed(() => walletStore.hasErrorMessage);

// Handle the wallet-connected event
const handleWalletConnected = (connected) => {
  // Only set wallet connected if backendDataRetrieved is true and no error exists
  if (walletStore.backendDataRetrieved && !hasErrorMessage.value) {
    walletStore.setWalletConnected(connected);
  }
}
</script>

<template>
  <!-- Only show background when wallet is not connected or if there's an error -->
  <div :class="{ 'my-overview-background': !isBackendDataAvailable || hasErrorMessage }">
    <VRow class="my-custom-margin" v-if="!isBackendDataAvailable || hasErrorMessage">
      <VCol
        cols="12"
        md="8"
      >
        <!-- Show the search/connect component, even if there's an error -->
        <SearchOrConnect class="transparent-card" @wallet-connected="handleWalletConnected" />
      </VCol>
    </VRow>

    <!-- Wallet pivot table and additional info if wallet is connected and no error exists -->
    <VRow class="match-height" v-else>
      <VCol cols="12" md="9" sm="6">
        <div class="scroll-container">
          <WalletPivottable class="my-dashboard-margin" :Pivottable_Data="walletStore.backendData[1]" />
        </div>
      </VCol>   
      <VCol cols="12" md="3" sm="6">
        <SizesAndFortification class="my-dashboard-margin" :Overview_Data="walletStore.backendData[3]" />
      </VCol>
    </VRow>
  </div>
</template>


<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";

.scroll-container {
  width: 100%;
  overflow-x: auto;
}

.my-dashboard-margin {
  margin-top: 80px;
}

.transparent-card {
  opacity: 0.9; /* Slight transparency */
  transition: opacity 0.3s ease-in-out; /* Smooth transition effect */
}

.my-custom-margin {
  margin-top: 120px;
  margin-left: 0;

  @media (min-width: 600px) {
    margin-top: 250px;
    margin-left: -100px;
  }
}
.error-message {
  color: red; /* Example color for error messages */
  margin-top: 10px;
  font-size: 14px;
}
</style>
