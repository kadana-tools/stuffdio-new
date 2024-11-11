export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    isWalletConnected: false,
    isWalletSearched: false,
    searchedWalletName: null,
    changeAddress: null,
    backendData: null,
    backendDataRetrieved: false,
    enablingAborted: false, // New state to track aborted connection
    closeLoaderForEmptyWalletConnect: false, // New state
    backendMessage: '', // New state for backend message
    // I'll be honest.. I dont rly like that I have to define so many parameters in the store. I think in a next iteration this the amount of states can be reduced significantly. 
  }),
  actions: {
    setWalletConnected(isConnected) {
      this.isWalletConnected = isConnected;
    },
    setWalletSearched(isSearched) {
      this.isWalletSearched = isSearched;
    },
    setSearchedWalletName(walletName) {
      this.searchedWalletName = walletName;
    },
    setChangeAddress(address) {
      this.changeAddress = address;
    },
    setBackendData(data) {
      this.backendData = data;
    },
    setBackendDataRetrieved(status) {
      this.backendDataRetrieved = status;
    },
    setEnablingAborted(status) { // Ensure this action is defined
      this.enablingAborted = status;
    },
    setCloseLoaderForEmptyWalletConnect(status) {
      if (!status) {
        setTimeout(() => {
          this.closeLoaderForEmptyWalletConnect = status;
        }, 500); // Delay reset to allow watchers to react
      } else {
        this.closeLoaderForEmptyWalletConnect = status;
      }
    },
    setBackendMessage(message) {
      this.backendMessage = message;
    },
    
  },
  getters: {
    hasErrorMessage(state) {
      return typeof state.backendData === 'string' && state.backendData.length > 0;
    },
  },
});
