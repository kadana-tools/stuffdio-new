// utils/api.js

import { useWalletStore } from '@/store/walletStore';
import axios from 'axios';

// Function to post the wallet address to the backend
export const postAddressToBackend = async (address) => {
  const walletStore = useWalletStore(); // Use the store
  try {
    const response = await axios.post('https://stuffd-jul23.ew.r.appspot.com/get_metadata', { address });
    // const response = await axios.post('http://127.0.0.1:5000/get_metadata', { address });

    // Assuming backend sends an object when successful and a string for errors
    if (typeof response.data === 'string') {
      // If the response is a string, return it as an error message
      return response.data;
    }

    // If the response is not a string, assume it's successful
    walletStore.setBackendData(response.data); // Set backend data in store
    walletStore.setBackendDataRetrieved(true); // Set backend data retrieved

    // Return the successful response data (you can also return a success flag if needed)
    return response.data;

  } catch (error) {
    console.error('Error posting address to backend:', error);
    return "An error occurred while fetching data"; // Return a default error message
  }
};
