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
    // I'll be honest.. I dont rly like that I had to define ANOTHER parameter in the store, just to shutdown the loader if one cancels the walletenable. I hoped to fix it with alrdy existing parameters, but wasnt able...
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
    setCloseLoaderForEmptyWalletConnect(status) { // New action
      this.closeLoaderForEmptyWalletConnect = status;
    },
  },
  getters: {
    hasErrorMessage(state) {
      return typeof state.backendData === 'string' && state.backendData.length > 0;
    },
  },
});
