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
    <VRow class="match-height d-flex flex-wrap" v-else>
      <!-- Wallet pivot table -->
      <VCol class="wallet-pivot">
        <div class="scroll-container">
          <WalletPivottable class="my-dashboard-margin" :Pivottable_Data="walletStore.backendData[1]" />
        </div>
      </VCol>

      <!-- Sizes and Fortification -->
      <VCol class="sizes-and-fortification">
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

/* Medium screens: 1024px - 1279px */
@media (min-width: 1400px) {
  .wallet-pivot {
    flex: 0 0 75%; /* 9/12 */
    max-width: 75%; /* Ensure proper width */
  }
  .sizes-and-fortification {
    flex: 0 0 25%; /* 3/12 */
    max-width: 25%;
  }
}

/* Small screens: Less than 1024px */
@media (max-width: 1399px) {
  .wallet-pivot,
  .sizes-and-fortification {
    flex: 0 0 100%; /* Full width */
    max-width: 100%;
  }
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


