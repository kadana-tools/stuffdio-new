<template>
  <div>
    <!-- Wallet Connect Button with Dropdown -->
    <VHover v-slot:default="{ isHovering, props }">
      <VBtn
        ref="walletButton"
        color="primary"
        v-bind="props"
        :append-icon="walletStore.backendDataRetrieved && walletStore.changeAddress ? (showWalletMenu ? 'tabler-chevron-up' : 'tabler-chevron-down') : ''"
        @click="!walletStore.changeAddress && (showWalletConnect = true)"
      >
        <span v-if="walletStore.backendDataRetrieved && walletStore.changeAddress">
          {{ formattedAddress }}
        </span>
        <span v-else>Connect Wallet</span>
      </VBtn>

      <!-- Dropdown Menu for Disconnect -->
      <VMenu
        v-if="walletStore.changeAddress"
        v-model="showWalletMenu"
        :activator="walletButton"
        offset-y
        :close-on-content-click="true"
        :value="isHovering"
      >
        <VList>
          <VListItem 
            @click="disconnectWallet" 
            class="custom-list-item"
            append-icon="tabler-logout"
          >
            <VListItemTitle>Disconnect</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
    </VHover>

    <!-- WalletConnect Modal -->
    <VDialog v-model="showWalletConnect" persistent>
      <VCard class="responsive-modal">
        <!-- Conditional Close Button -->
        <VCard v-if="!isLoading" class="close-btn" @click="closeModal">
          <VIcon icon="tabler-x" />
        </VCard>

        <VCardItem v-if="!isLoading" title="Connect to Wallet:"></VCardItem>
        <VCardText>
          <!-- Pass Event Listener to Child -->
          <WalletConnect @wallet-enabled="onWalletConnected" @loading="setLoadingState" />
        </VCardText>
      </VCard>
    </VDialog>
    
    <!-- Loading Overlay: This will show while loading -->
    <div v-if="isLoading" class="loading-overlay">
      <WalletLoader />
    </div>

  </div>
</template>

<script setup>
import WalletConnect from '@/layouts/components/WalletConnect.vue';
import { useWalletStore } from '@/store/walletStore';
import WalletLoader from '@/views/my-overview/WalletLoader.vue';
import { computed, ref } from 'vue';


// Pinia store to manage wallet state
const walletStore = useWalletStore()

const showWalletConnect = ref(false) // Controls the modal visibility
const showWalletMenu = ref(false) // Controls the dropdown visibility
const isLoading = ref(false); // Track loading state from the child component
const walletButton = ref(null) // Button ref to tie the dropdown to
// const backendDataRetrieved = ref(false); // Track backend data retrieval


// Compute the formatted address for display
const formattedAddress = computed(() => {
  if (walletStore.changeAddress && walletStore.backendDataRetrieved) {
    const address = walletStore.changeAddress
    return `${address.slice(0, 7)}...${address.slice(-5)}`
  }
  return 'Connect Wallet'
})

// Emit event to parent when wallet is connected
const emit = defineEmits(['wallet-connected'])

// Close modal and emit event
const onWalletConnected = () => {
  showWalletConnect.value = false
  showWalletMenu.value = false

  // After backend data is retrieved, set the flag to true
  walletStore.backendDataRetrieved = true;
  emit('wallet-connected', true)
}

// Update loading state when the child triggers loading
const setLoadingState = (loading) => {
  isLoading.value = loading;
};

// Disconnect the wallet
const disconnectWallet = () => {
  walletStore.setWalletConnected(false)
  walletStore.setChangeAddress('') // Reset the change address
  walletStore.backendDataRetrieved = false;
  showWalletMenu.value = false // Close the dropdown
}

// Manually close modal
const closeModal = () => {
  showWalletConnect.value = false
}
</script>

<style scoped>

.responsive-modal {
  /* Default width */
  /* max-width: 100%; */
  width: 100%; /* For mobile */
}

@media (min-width: 600px) {
  /* Tablet size */
  .responsive-modal {
    max-width: 350px;
    margin: 0 auto; /* Center horizontally */
  }
}


/* Custom close button styles using VCard */
.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 1;
  background-color: transparent;
  color: var(--v-on-surface); /* Default color */
  padding: 5px;
  border-radius: 50%; /* Circular button */
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;

  /* REMOVE BORDER AND OUTLINE, it seems like this helped in the end to remove the border (tip from chatgpt) */
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}

.close-btn:hover {
  background-color: var(--v-primary-lighten4); /* Hover background */
  color: var(--v-primary); /* Hover icon color */
}

.close-btn:focus {
  background-color: transparent;
  color: var(--v-primary-darken1); /* Uses the darkened primary color for hover */
}

.custom-list-item {
  padding: 0px 0px; /* Adjust padding for a smaller height */
  height: 8px; /* Optionally set a fixed height */
}

/* Additional reset for VIcon inside the button */
.close-btn .v-icon {
  border: none !important;
  outline: none !important;
  box-shadow: none !important;
}
</style>
