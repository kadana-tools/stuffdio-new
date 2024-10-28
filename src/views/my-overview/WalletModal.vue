<template>
  <div>
    <!-- Wallet Connect Button or Searched Wallet Display -->
    <VHover v-slot:default="{ isHovering, props }">
      <!-- Conditional rendering based on if a wallet is searched but not connected -->
      <template v-if="walletStore.isWalletSearched && !walletStore.isWalletConnected">
        <VBtn
          ref="searchedWalletButton"
          color="primary"
          v-bind="props"
          class="searched-wallet-btn"
        >
           <span>{{ formattedSearchedWalletName }}</span>
        <!-- Wrap the clear icon in a VBtn to give it a button feel -->
          <VBtn
            icon
            class="clear-btn-icon"
            size="x-small" 
            @click.stop="clearSearchedWallet"
          >
            <VIcon icon="tabler-x" />
          </VBtn>
        </VBtn>
      </template>
      <!-- Regular Wallet Connect Button -->
      <template v-else>
        <VBtn
          ref="walletButton"
          color="primary"
          v-bind="props"
          :append-icon="walletStore.backendDataRetrieved && walletStore.changeAddress ? (showWalletMenu ? 'tabler-chevron-up' : 'tabler-chevron-down') : ''"
          @click="!walletStore.changeAddress && openWalletConnectDialog()"
        >
          <span v-if="walletStore.backendDataRetrieved && walletStore.changeAddress">
            {{ formattedAddress }}
          </span>
          <span v-else>Connect Wallet</span>
        </VBtn>

        <!-- Dropdown Menu for Disconnect, only if wallet is connected -->
        <VMenu
          v-if="walletStore.isWalletConnected"
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
      </template>
    </VHover>

    <!-- Display the searched wallet if present
    <div v-if="walletStore.isWalletSearched" class="searched-wallet-display">
      <VChip
        outlined
        color="primary"
        class="searched-wallet-chip"
      >
        <template #prepend>
          <VAvatar icon="tabler-wallet" />
        </template>
        <span>{{ walletStore.changeAddress }}</span>
        <VIcon
          icon="tabler-x"
          class="clear-icon"
          @click="clearSearchedWallet"
        />
      </VChip>
    </div> -->

    <!-- WalletConnect Modal -->
    <VDialog 
      v-model="showWalletConnectDialog" 
      persistent 
      :class="isLoading ? 'transparent-dialog' : ''"
    >
      <VCard class="responsive-modal">
        <VCard v-if="!isLoading" class="close-btn" @click="closeWalletConnectDialog">
          <VIcon icon="tabler-x" />
        </VCard>

        <VCardItem v-if="!isLoading" title="Connect to Wallet:"></VCardItem>
        <VCardText v-if="!isLoading">
          <WalletConnect @wallet-enabled="onWalletConnected" @loading="setLoadingState" />
        </VCardText>
      </VCard>
    </VDialog>

    <!-- New VDialog for Loader -->
    <VDialog v-model="showLoaderDialog" persistent max-width="350px">
      <VCard class="loader-modal">
        <WalletLoader />
      </VCard>
    </VDialog>
  </div>
</template>


<script setup>
import WalletConnect from '@/layouts/components/WalletConnect.vue';
import { useWalletStore } from '@/store/walletStore';
import WalletLoader from '@/views/my-overview/WalletLoader.vue';
import { computed, ref } from 'vue';

// Pinia store to manage wallet state
const walletStore = useWalletStore()

const showWalletConnectDialog = ref(false) // Controls the wallet connect modal visibility
const showWalletMenu = ref(false) // Controls the dropdown visibility
const showLoaderDialog = ref(false); // Controls the loader modal visibility
const isLoading = ref(false); // Track loading state
const walletButton = ref(null) // Button ref to tie the dropdown to

// Reusable function to format a string if its length is greater than 12 characters
const formatString = (str) => {
  if (str && str.length > 12) {
    return `${str.slice(0, 7)}...${str.slice(-5)}`;
  }
  return str; // Return the full string if it's 12 or fewer characters
};

// For formatting the connected wallet's address
const formattedAddress = computed(() => {
  if (walletStore.changeAddress && walletStore.backendDataRetrieved) {
    return formatString(walletStore.changeAddress);
  }
  return 'Connect Wallet';
});

// For formatting the searched wallet name
const formattedSearchedWalletName = computed(() => {
  return formatString(walletStore.searchedWalletName);
});


// Emit event to parent when wallet is connected
const emit = defineEmits(['wallet-connected']);

// Open the wallet connect modal
const openWalletConnectDialog = () => {
  showWalletConnectDialog.value = true;
};

// Close modals and emit event when wallet is connected
const onWalletConnected = () => {
  showWalletConnectDialog.value = false;
  showLoaderDialog.value = false;
  walletStore.backendDataRetrieved = true; // Indicate that backend data is retrieved
  emit('wallet-connected', true);
};

// Update loading state when the child triggers loading
const setLoadingState = (loading) => {
  isLoading.value = loading;
  if (loading) {
    showWalletConnectDialog.value = false;
    showLoaderDialog.value = true;
  } else {
    showLoaderDialog.value = false;
  }
};

// Watch backendDataRetrieved and close loader dialog if it's true
watch(() => walletStore.backendDataRetrieved, (newVal) => {
  if (newVal) {
    showLoaderDialog.value = false; // Close the loader dialog when data is retrieved
  }
});

// Disconnect the wallet and reset all states
const disconnectWallet = () => {
  // Reset wallet state in Pinia store
  walletStore.setWalletConnected(false);
  walletStore.setChangeAddress(''); // Reset the wallet's address
  walletStore.backendDataRetrieved = false; // Reset backend data status

  // Reset UI states
  showWalletMenu.value = false; // Close the dropdown menu
  showWalletConnectDialog.value = false; // Close the wallet connect dialog
  showLoaderDialog.value = false; // Close the loader dialog
  isLoading.value = false; // Stop any ongoing loading process
};

// Manually close wallet connect modal
const closeWalletConnectDialog = () => {
  showWalletConnectDialog.value = false;
};

// Clear the searched wallet when the clear icon is clicked
const clearSearchedWallet = () => {
  walletStore.setWalletSearched(false);
  walletStore.setSearchedWalletName(null);
  walletStore.setWalletConnected(false); // Reset wallet connected status
  walletStore.setChangeAddress(null); // Clear the change address
  walletStore.setBackendDataRetrieved(false); // Reset backend data status
};


</script>

<style scoped>

.searched-wallet-btn {
  pointer-events: none; /* Disable all pointer events for the button */
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: background-color 0.3s ease;
  /* rgba(115,103,240,255) */
}

.clear-btn-icon {
  pointer-events: auto; /* Re-enable pointer events for the icon button */
  background-color: transparent;
  color: var(--v-on-primary);
  padding: 0;
  margin-left: 4px;

  .v-icon {
    transition: color 0.3s ease;
  }

  &:hover .v-icon {
    color: var(--v-primary-lighten4); /* Lighten the icon color on hover */
  }
}

.loader-modal {
  padding: 20px;
  text-align: center;
  display: flex; /* Use flexbox to center content */
  justify-content: center; /* Horizontally center the loader */
  align-items: center; /* Vertically center the loader if needed */
  background-color: transparent !important;
  border: none !important; /* Remove border */
  box-shadow: none !important; /* Remove shadow */
  overflow: hidden !important; /* Ensure no scrollbars */
}

.transparent-dialog {
  background-color: transparent !important;
  overflow: hidden !important; /* Ensure no scrollbars */
}

.transparent-dialog .v-card {
  background-color: transparent !important; /* Fully transparent */
  box-shadow: none !important; /* Remove shadow */
  border: none; /* Remove border */
  overflow: hidden !important; /* Ensure no scrollbars inside the card */
}

body.no-scroll {
  overflow: hidden;
}

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
