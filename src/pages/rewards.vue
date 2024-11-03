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

  @media (min-width: 600px) and (min-height: 800px){
    margin-top: 30vh; /* Minimum margin with responsive adjustment */
    margin-left: -5.5vw;
  }

  // @media (max-height: 700px) {
  //   margin-top: 20vh; /* Minimum margin with responsive adjustment */
  //   margin-left: -5.5vw;
  // }
  
}
.error-message {
  color: red; /* Example color for error messages */
  margin-top: 10px;
  font-size: 14px;
}



// small 13" screen, https://yesviz.com/devices/macbookpro-2018-13/#google_vignette
  // @media (min-width: 600px) and (max-width: 1280px) {
  // },



// >15" screen
// @media (min-width: 1280px) {
//     // margin-top: 250px;
//     margin-top: calc(1.5 * 10vw);

//     // margin-left: -5.5vw;
//   }
// }
</style>
