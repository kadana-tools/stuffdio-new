<template>
  <VRow no-gutters class="auth-wrapper">
    <VCol cols="12" md="6" class="auth-card-v2 d-flex align-center justify-center">
      <VCard class="responsive-card mt-sm-0 pt-3">
        
        <VCardText>
          <h4 class="text-h4 mb-1">Hi there!</h4>    <!-- Alternative: Hi there! -->
          <p class="mb-0">
            Search for a Cardano wallet address or connect your wallet and get to know more about your Outpost NFTs.
          </p> 
        </VCardText>         <!-- Alternative: Enter a Cardano wallet address or connect your wallet and get to know more about your Outpost NFTs. -->


        <!-- Wallet Address Search Field -->
        <VCardText>
          <VForm ref="refVForm">
            <VRow>
              <VCol cols="12">
                <VTextField
                  ref="inputRef"
                  v-model="walletAddress"
                  label="Submit Wallet Address"
                  placeholder="addr1... or $handle"
                  @keydown.enter="updateAddress"
                  class="w-100"
                >
                  <!-- Append the search and close buttons -->
                  <template #append-inner>

                    <!-- Close button to clear the input -->
                    <!-- <VBtn 
                      color="surface-bright"
                      v-if="walletAddress"
                      icon
                      @click="clearInput"
                      class="small-clear-btn" 
                    >
                     <VIcon size="16">tabler-x</VIcon>
                   </VBtn> -->

                    <!-- Search button -->
                    <VBtn 
                      color="surface-bright"
                      v-if="walletAddress"
                      icon
                      @click="updateAddress"
                    >
                      <VIcon>tabler-search</VIcon>
                    </VBtn>
                    

                  </template>
                </VTextField>
              </VCol>

              <!-- Divider and optional content -->
              <VCol cols="12" class="d-flex align-center">
                <VDivider />
                <span class="mx-4">or</span>
                <VDivider />
              </VCol>

              <!-- Wallet Connect Option -->
              <VCol cols="8">
                <WalletModal @wallet-connected="onWalletConnected" />
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>

    <!-- Error Overlay -->
    <div v-if="showErrorMessage" class="error-overlay">
      <div class="error-message-box">
        <span>{{ errorMessage }}</span>
        <div class="visual-timer" :style="{ width: timerWidth + '%' }"></div>
      </div>
    </div>

    <!-- Loader Dialog -->
    <VDialog v-model="showLoaderDialog" persistent max-width="350px">
      <VCard class="loader-modal">
        <WalletLoader />
      </VCard>
    </VDialog>
  </VRow>
</template>

<script setup>
import { useWalletStore } from '@/store/walletStore';
import { postAddressToBackend } from '@/utils/api'; // Import the API function
import WalletLoader from '@/views/my-overview/WalletLoader.vue'; // Import the WalletLoader component
import WalletModal from '@/views/my-overview/WalletModal.vue';
import { ref, watch } from 'vue';

const walletAddress = ref('$test-wallet'); // Default text
const showWalletConnect = ref(false);
const walletStore = useWalletStore();

// State for showing loader
const showLoaderDialog = ref(false);

// State for error message and visual timer
const errorMessage = ref('');
const showErrorMessage = ref(false);
const timerWidth = ref(100); // For visual timer bar

// Function to handle the visual timer effect
const startErrorTimer = () => {
  timerWidth.value = 100;
  const interval = setInterval(() => {
    if (timerWidth.value > 0) {
      timerWidth.value -= 2.5; // Decrement width over time
    } else {
      clearInterval(interval);
      showErrorMessage.value = false;
    }
  }, 100);
};

// Create a reference for the input field
const inputRef = ref(null);

const updateAddress = async () => {
  showLoaderDialog.value = true; // Show loader before starting the update
  try {
    // Assume the address is successfully validated and backend confirms the connection
    walletStore.setChangeAddress(walletAddress.value); 
    
    const response = await postAddressToBackend(walletAddress.value); // Post address to backend

    if (typeof response === 'string') {
      // If backend returns a string (error), show the message
      errorMessage.value = response;
      showErrorMessage.value = true;
      startErrorTimer(); // Start visual timer

      // Reset state for unsuccessful attempt
      walletStore.setWalletConnected(false);
      walletStore.setBackendDataRetrieved(false);
      walletStore.setWalletSearched(false);
      walletStore.setChangeAddress(null);
      walletStore.setSearchedWalletName(null);

    } else {
      // walletStore.setBackendDataRetrieved(true); // Indicate that backend data is ready
      walletStore.setWalletSearched(true); // New line to mark the wallet as searched
      walletStore.setSearchedWalletName(walletAddress.value); // Set the searched wallet name

    }
  } catch (error) {
    console.error("Error updating address:", error);
  } finally {
    showLoaderDialog.value = false; // Hide loader after update completes
  }
};

// // Clear input field function
// const clearInput = () => {
//   walletAddress.value = '';
// };

// // Focus on the input field when the component is mounted
// onMounted(() => {
//   inputRef.value.focus();
// });

// Watch for backend data retrieval and close the loader if data is ready
watch(() => walletStore.backendDataRetrieved, (newVal) => {
  if (newVal) {
    showLoaderDialog.value = false;
  }
});

const onWalletConnected = () => {
  showWalletConnect.value = false;
  walletStore.setWalletConnected(true);
};
</script>


<style scoped>
/* Responsive Card Styling */
.responsive-card {
  width: 100%; /* Full width on small devices */
}

@media (min-width: 600px) {
  .responsive-card {
    max-width: 350px; /* Adjust width for larger screens */
    margin: 0 auto; /* Center on tablet screens */
  }
}

/* Styling for Loader Modal */
.loader-modal {
  padding: 20px;
  text-align: center;
  display: flex;
  justify-content: center; /* Horizontally center the loader */
  align-items: center; /* Vertically center the loader */
  background-color: transparent !important;
  border: none !important; /* Remove border */
  box-shadow: none !important; /* Remove shadow */
  overflow: hidden !important; /* Ensure no scrollbars */
}

/* Error Overlay for Desktop */
.error-overlay {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -20%);
  z-index: 1000;
  pointer-events: none; /* Allow interaction with elements below */
}

/* Error Overlay for Mobile (screens with a width of 600px or less) */
@media (max-width: 600px) {
  .error-overlay {
    top: 25%;
  }
}

.error-message-box {
  background-color: rgba(255, 0, 0, 0.7);
  border: 1px solid rgba(255, 0, 0, 0.5);
  padding: 10px 15px;
  border-radius: 8px;
  font-size: 0.9rem;
  position: relative;
  color: white; /* Set the text color to white */
  pointer-events: auto; /* Re-enable pointer events only for the error box */
}

/* Visual Timer */
.visual-timer {
  height: 3px;
  background-color: red; /* Color for the timer bar */
  position: absolute;
  bottom: 0;
  left: 0;
  transition: width 0.1s linear; /* Smooth width transition */
}
.close-error-btn {
  position: absolute;
  top: 4px;
  right: 4px;
}
</style>
