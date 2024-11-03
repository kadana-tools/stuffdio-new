export const useWalletStore = defineStore('walletStore', {
  state: () => ({
    isWalletConnected: false,
    isWalletSearched: false, // New state to track if a wallet was searched
    searchedWalletName: null, // New state to track the name of the searched wallet
    changeAddress: null,
    backendData: null,
    backendDataRetrieved: false,
    enablingAborted: false, // New state to track aborted connection
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
  },
  getters: {
    // Getter to check if there's an error message in backendData
    hasErrorMessage(state) {
      return typeof state.backendData === 'string' && state.backendData.length > 0;
    },
  },
});
