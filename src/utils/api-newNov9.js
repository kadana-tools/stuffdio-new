// utils/api.js

import { useWalletStore } from '@/store/walletStore';
import axios from 'axios';

// Function to handle backend address posting with centralized error handling
export const postAddressToBackend = async (address) => {
  const walletStore = useWalletStore(); // Access the Pinia store

  try {
    const response = await axios.post('https://stuffd-jul23.ew.r.appspot.com/get_metadata', { address });

    if (typeof response.data === 'string') {

      // Reset store states for unsuccessful attempt
      walletStore.setWalletConnected(false);
      walletStore.setBackendDataRetrieved(false);
      walletStore.setWalletSearched(false);
      walletStore.setChangeAddress(null);
      walletStore.setSearchedWalletName(null);

      // Return the error message for further handling if needed
      return response.data;
    }

    // If response is valid, store the data and update states
    walletStore.setBackendData(response.data);
    walletStore.setBackendDataRetrieved(true);
    walletStore.setWalletSearched(true);
    walletStore.setSearchedWalletName(address);

    // Return the successful response data
    return response.data;

  } catch (error) {
    console.error("Error posting address to backend:", error);

    // Reset states in case of request failure
    walletStore.setWalletConnected(false);
    walletStore.setBackendDataRetrieved(false);
    walletStore.setWalletSearched(false);
    walletStore.setChangeAddress(null);
    walletStore.setSearchedWalletName(null);

    // Return a default error message
    return "An error occurred while fetching data";
  }
};
