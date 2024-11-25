// utils/api.js

import { useWalletStore } from '@/store/walletStore';
import axios from 'axios';

// Function to post the wallet address to the backend
export const postAddressToBackend = async (address) => {
  const walletStore = useWalletStore(); 

  try {
    // const response = await axios.post('https://stuffd-426805.ew.r.appspot.com/get_metadata', { address }); // an older version
    const response = await axios.post('https://stuffd-jul23.ew.r.appspot.com/get_metadata', { address }); // the latest version
    // const response = await axios.post('http://127.0.0.1:5000/get_metadata', { address });

    if (typeof response.data === 'string') {
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
