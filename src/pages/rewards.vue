<script setup>
import { useWalletStore } from '@/store/walletStore';
import SearchOrConnect from '@/views/my-overview/SearchOrConnect.vue';
import OutpostData from '@/views/my-rewards/OutpostData.vue';
import WalletRewards from '@/views/my-rewards/WalletRewards.vue';

// Access wallet store
const walletStore = useWalletStore();

// Track the state of wallet connection and backend data availability
const isWalletConnected = computed(() => walletStore.isWalletConnected);
const isBackendDataAvailable = computed(() => walletStore.backendDataRetrieved);

// Handle the wallet-connected event
const handleWalletConnected = (connected) => {
  if (walletStore.backendDataRetrieved) {
    walletStore.setWalletConnected(connected);
  }
};
</script>

<template>
  <!-- Show SearchOrConnect if backend data is not available, otherwise show WalletRewards -->
  <VRow class="my-custom-margin" v-if="!isBackendDataAvailable">
    <VCol
      cols="12"
      md="8"
    >
      <SearchOrConnect class="transparent-card" @wallet-connected="handleWalletConnected" />
    </VCol>
  </VRow>

  <VRow v-else>
    <VCol
      cols="12"
    >
      <WalletRewards class="my-dashboard-margin" :Rewards_Data="walletStore.backendData[2]" />
    </VCol>

    <VCol 
      cols="12"
    >
      <!-- Pass a slice of walletStore.backendData from index 3 onwards -->
      <OutpostData :Outpost_Data="walletStore.backendData.slice(3)"/>    </VCol>
    
  </VRow>
</template>

<style lang="scss">
.my-dashboard-margin {
  margin-top: 80px;
}

.transparent-card {
  opacity: 0.9; /* Slight transparency */
  transition: opacity 0.3s ease-in-out; /* Smooth transition effect */
}
.my-custom-margin {
  margin-top: 250px;
  margin-left: 0;

  @media (min-width: 600px) {
    margin-top: 250px;
    margin-left: -100px;
  }
}
</style>
