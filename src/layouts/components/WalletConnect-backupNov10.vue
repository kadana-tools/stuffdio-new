<template>
  <VContainer class="wallet-container">
    <!-- Wallet selection buttons -->
    <VRow v-if="wallets.length && !isLoading">
      <VCol cols="6" sm="6" v-for="key in wallets" :key="key">
        <VCard
          outlined
          class="wallet-card"
          :class="{ active: whichWalletSelected === key }"
          @click="selectWallet(key)"
        >
          <div class="wallet-btn-content">
            <!-- Place icon above the wallet name and reduce the size of the icon -->
            <img
              v-if="walletIcons[key]"
              :src="walletIcons[key]"
              width="24"
              height="24"
              :alt="key"
              class="wallet-icon"
            />
            <div class="wallet-name">{{ walletNames[key] || key }}</div>
          </div>
        </VCard>
      </VCol>
    </VRow>

    <!-- Loading State -->
    <!-- <VCardText v-if="isLoading" class="d-flex flex-column align-center">
      <div class="progress-container">
        <VProgressCircular indeterminate color="primary" size="70" />
        <img class="circular-image" src="@/assets/images/illustrations/Play-button-as-a-D-v2.png" alt="Cardano Logo">
      </div>
      <p class="loading-text mt-10">Retrieving data from the Cardano Blockchain <span class="dots"></span> </p>
    </VCardText> -->

    <!-- Connect Button -->
    <!-- <VCardText v-else> -->
      <VCardText v-if="!isLoading">
      <VBtn
        color="primary"
        variant="tonal"
        class="connect-btn"
        :disabled="!whichWalletSelected"
        @click="enableWallet"
      >
        <VIcon icon="tabler-check" start />
        Connect
      </VBtn>
    </VCardText>
  </VContainer>
</template>


<script>
import {
  Address,
  AssetName,
  Assets,
  BigNum,
  LinearFee,
  MultiAsset,
  ScriptHash,
  Transaction,
  TransactionBuilder,
  TransactionBuilderConfigBuilder,
  TransactionOutput,
  TransactionOutputBuilder,
  TransactionUnspentOutput,
  TransactionUnspentOutputs,
  TransactionWitnessSet,
  Value
} from "@emurgo/cardano-serialization-lib-asmjs";
import { Buffer } from 'buffer';

import { useWalletStore } from '@/store/walletStore';
import { postAddressToBackend } from '@/utils/api'; // Import the shared function


const walletStore = useWalletStore(); // Access the Pinia store

export default {
  emits: ['wallet-enabled', 'loading'], // Declare the emitted events

  data() {
    return {
      isLoading: false,  // Add a loading state
      selectedTabId: "1",
      whichWalletSelected: null, //or undefined
      walletFound: false,
      walletIsEnabled: false,
      walletName: undefined,
      walletIcon: undefined,
      walletAPIVersion: undefined,
      wallets: [],
      walletIcons: {},
      walletNames: {},
      networkId: undefined,
      Utxos: undefined,
      CollatUtxos: undefined,
      balance: null, //or undefined
      changeAddress: undefined,
      rewardAddress: undefined,
      usedAddress: undefined,
      txBody: undefined,
      txBodyCborHex_unsigned: "",
      txBodyCborHex_signed: "",
      submittedTxHash: "",
      addressBech32SendADA:
        "addr_test1qrt7j04dtk4hfjq036r2nfewt59q8zpa69ax88utyr6es2ar72l7vd6evxct69wcje5cs25ze4qeshejy828h30zkydsu4yrmm",
      lovelaceToSend: 3000000,
      assetNameHex: "4c494645",
      assetPolicyIdHex: "ae02017105527c6c0c9840397a39cc5ca39fabe5b9998ba70fda5f2f",
      assetAmountToSend: 5,
      addressScriptBech32:
        "addr_test1wpnlxv2xv9a9ucvnvzqakwepzl9ltx7jzgm53av2e9ncv4sysemm8",
      datumStr: "12345678",
      plutusScriptCborHex: "4e4d01000033222220051200120011",
      transactionIdLocked: "",
      transactionIndxLocked: 0,
      lovelaceLocked: 3000000,
      manualFee: 900000,
    };
  },
  methods: {
      // Ensure that `window.cardano` exists and list available wallets
      checkForWallets() {
        if (typeof window.cardano !== 'undefined') {
          const wallets = [];
          const walletIcons = {};
          const walletNames = {};
          const uniqueWallets = new Set(); // Use Set to ensure uniqueness of wallet names

          for (const key in window.cardano) {
            // Ensure that each wallet is unique based on its name
            if (window.cardano[key] && window.cardano[key].enable && !uniqueWallets.has(window.cardano[key].name)) {
              wallets.push(key);
              walletIcons[key] = window.cardano[key].icon;
              walletNames[key] = window.cardano[key].name;
              uniqueWallets.add(window.cardano[key].name); // Add wallet name to the Set
            }
          }

          if (wallets.length > 0) {
            // Reverse the order of the wallets and set the first as selected
            this.wallets = wallets.reverse(); 
            this.whichWalletSelected = wallets[0];
            this.walletIcons = walletIcons;
            this.walletNames = walletNames;
            this.walletFound = true;
          } else {
            console.error('No compatible Cardano wallet found.');
          }
        } else {
          console.error('Cardano wallet not found.');
        }
      },
    resetData() {
      this.walletIsEnabled = false;
      this.Utxos = null;
      this.CollatUtxos = null;
      this.balance = null;
      this.changeAddress = null;
      this.rewardAddress = null;
      this.usedAddress = null;
      this.txBody = null;
      this.txBodyCborHex_unsigned = "";
      this.txBodyCborHex_signed = "";
      this.submittedTxHash = "";
    },

    // Select a wallet when clicked
    selectWallet(key) {
      this.whichWalletSelected = key;
      this.resetData(); // Reset state when selecting a new wallet
    },

    // Enable the selected wallet and fetch its balance
    async enableWallet() {
      const walletKey = this.whichWalletSelected;
      this.isLoading = true; // Set loading to true

      this.$emit('loading', true); // Emit loading state to the parent

      try {
        // Attempt to enable the wallet
        this.API = await window.cardano[walletKey].enable();
        console.log('this.API:', this.API);

        // Check if the wallet connection was aborted
        if (this.API && this.API.status === false) {
          console.warn("Wallet connection was aborted by the user:", this.API);
          walletStore.setEnablingAborted(true); // Set enablingAborted to true on abort
          this.resetData(); // Reset wallet-related state
          this.isLoading = false; // Ensure loading is disabled on abort
          this.$emit('loading', false); // Notify parent to stop loading
          return; // Exit early to prevent further execution
        }

        // Check if the wallet is enabled
        this.walletIsEnabled = await window.cardano[walletKey].isEnabled();

        if (this.walletIsEnabled) {
          // Fetch balance and post to backend
          await this.getChangeAddress();
          await postAddressToBackend(this.changeAddress);
          walletStore.setWalletConnected(true);
          walletStore.setEnablingAborted(false); // Clear enablingAborted on success


          // Notify parent that wallet is enabled
          this.$emit("wallet-enabled");
        } else {
          console.error("Failed to enable wallet:", walletKey);
          this.resetData(); // Reset state on failure
        }
      } catch (err) {
        console.error(`Error enabling wallet ${walletKey}:`, err);
        this.resetData(); // Reset state on error
        walletStore.setEnablingAborted(true); // Set enablingAborted on error

      } finally {
        this.isLoading = false; // Ensure loading ends
        this.$emit('loading', false); // Notify parent loading is complete
      }
    },






    checkIfWalletFound() {
      const walletKey = this.whichWalletSelected;
      const walletFound = !!window?.cardano?.[walletKey];
      this.walletFound = walletFound;
      return walletFound;
    },
    async getAPIVersion() {
      const walletKey = this.whichWalletSelected;
      const walletAPIVersion = window?.cardano?.[walletKey].apiVersion;
      this.walletAPIVersion = walletAPIVersion;
      return walletAPIVersion;
    },
    async getWalletName() {
      const walletKey = this.whichWalletSelected;
      const walletName = window?.cardano?.[walletKey].name;
      this.walletName = walletName;
      return walletName;
    },
    async getNetworkId() {
      try {
        const networkId = await this.API.getNetworkId();
        this.networkId = networkId;
      } catch (err) {
        console.log(err);
      }
    },
    async getUtxos() {
      let Utxos = [];
      try {
        const rawUtxos = await this.API.getUtxos();
        for (const rawUtxo of rawUtxos) {
          const utxo = TransactionUnspentOutput.from_bytes(
            Buffer.from(rawUtxo, "hex")
          );
          const input = utxo.input();
          const txid = Buffer.from(
            input.transaction_id().to_bytes(),
            "utf8"
          ).toString("hex");
          const txindx = input.index();
          const output = utxo.output();
          const amount = output.amount().coin().to_str(); // ADA amount in lovelace
          const multiasset = output.amount().multiasset();
          let multiAssetStr = "";
          if (multiasset) {
            const keys = multiasset.keys(); // policy Ids of thee multiasset
            const N = keys.len();
            for (let i = 0; i < N; i++) {
              const policyId = keys.get(i);
              const policyIdHex = Buffer.from(
                policyId.to_bytes(),
                "utf8"
              ).toString("hex");
              const assets = multiasset.get(policyId);
              const assetNames = assets.keys();
              const K = assetNames.len();
              for (let j = 0; j < K; j++) {
                const assetName = assetNames.get(j);
                const assetNameString = Buffer.from(
                  assetName.name(),
                  "utf8"
                ).toString();
                const assetNameHex = Buffer.from(
                  assetName.name(),
                  "utf8"
                ).toString("hex");
                const multiassetAmt = multiasset.get_asset(
                  policyId,
                  assetName
                );
                multiAssetStr += `+ ${multiassetAmt.to_str()} + ${policyIdHex}.${assetNameHex} (${assetNameString})`;
              }
            }
          }
          const obj = {
            txid: txid,
            txindx: txindx,
            amount: amount,
            str: `${txid} #${txindx} = ${amount}`,
            multiAssetStr: multiAssetStr,
            TransactionUnspentOutput: utxo,
          };
          Utxos.push(obj);
        }
        this.Utxos = Utxos;
      } catch (err) {
        console.log(err);
      }
    },
    async getCollateral() {
      let CollatUtxos = [];
      try {
        let collateral = [];
        const wallet = this.whichWalletSelected;
        if (wallet === "nami") {
          collateral = await this.API.experimental.getCollateral();
        } else {
          collateral = await this.API.getCollateral();
        }
        for (const x of collateral) {
          const utxo = TransactionUnspentOutput.from_bytes(
            Buffer.from(x, "hex")
          );
          CollatUtxos.push(utxo);
        }
        this.CollatUtxos = CollatUtxos;
      } catch (err) {
        console.log(err);
      }
    },
    // Fetch the balance of the enabled wallet
    async getBalance() {
      try {
        const balanceCBORHex = await this.API.getBalance();
        const balance = Value.from_bytes(Buffer.from(balanceCBORHex, "hex")).coin();
        // Convert balance to ADA (1 ADA = 1,000,000 Lovelace)
        this.balance = (BigNum.from_str(balance.to_str()).to_str() / 1000000).toString();
      } catch (err) {
        console.error('Error fetching balance:', err);
      }
    },
    async getChangeAddress() {
      try {
        const raw = await this.API.getChangeAddress();
        const changeAddress = Address.from_bytes(
          Buffer.from(raw, "hex")
        ).to_bech32();
        this.changeAddress = changeAddress;
        walletStore.setChangeAddress(this.changeAddress);
      } catch (err) {
        console.log(err);
      }
    },
    // Async function to post the wallet address to backend
    // async postAddressToBackend(address) {
    //   try {
    //     const response = await axios.post('https://stuffd-jul23.ew.r.appspot.com/get_metadata', { address });
    //     const walletStore = useWalletStore();
    //     walletStore.setBackendData(response.data);
    //     console.log('posted address to backend',response.data)
    //   } catch (error) {
    //     console.error('Error posting address to backend:', error);
    //   }
    // },
    async getRewardAddresses() {
      try {
        const raw = await this.API.getRewardAddresses();
        const rawFirst = raw[0];
        const rewardAddress = Address.from_bytes(
          Buffer.from(rawFirst, "hex")
        ).to_bech32();
        this.rewardAddress = rewardAddress;
      } catch (err) {
        console.log(err);
      }
    },
    async getUsedAddresses() {
      try {
        const raw = await this.API.getUsedAddresses();
        const rawFirst = raw[0];
        const usedAddress = Address.from_bytes(
          Buffer.from(rawFirst, "hex")
        ).to_bech32();
        this.usedAddress = usedAddress;
      } catch (err) {
        console.log(err);
      }
    },
    async buildSendADATransaction() {
      const txBuilder = await this.initTransactionBuilder();
      const shelleyOutputAddress = Address.from_bech32(
        this.addressBech32SendADA
      );
      const shelleyChangeAddress = Address.from_bech32(this.changeAddress);

      txBuilder.add_output(
        TransactionOutput.new(
          shelleyOutputAddress,
          Value.new(BigNum.from_str(this.lovelaceToSend.toString()))
        )
      );

      const txUnspentOutputs = await this.getTxUnspentOutputs();
      txBuilder.add_inputs_from(txUnspentOutputs, 1);

      txBuilder.add_change_if_needed(shelleyChangeAddress);

      const txBody = txBuilder.build();

      const transactionWitnessSet = TransactionWitnessSet.new();

      const tx = Transaction.new(
        txBody,
        TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
      );

      let txVkeyWitnesses = await this.API.signTx(
        Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
        true
      );

      txVkeyWitnesses = TransactionWitnessSet.from_bytes(
        Buffer.from(txVkeyWitnesses, "hex")
      );

      transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

      const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

      const submittedTxHash = await this.API.submitTx(
        Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
      );
      this.submittedTxHash = submittedTxHash;
    },
    async buildSendTokenTransaction() {
      const txBuilder = await this.initTransactionBuilder();
      const shelleyOutputAddress = Address.from_bech32(
        this.addressBech32SendADA
      );
      const shelleyChangeAddress = Address.from_bech32(this.changeAddress);

      let txOutputBuilder = TransactionOutputBuilder.new();
      txOutputBuilder = txOutputBuilder.with_address(shelleyOutputAddress);
      txOutputBuilder = txOutputBuilder.next();

      let multiAsset = MultiAsset.new();
      let assets = Assets.new();
      assets.insert(
        AssetName.new(Buffer.from(this.assetNameHex, "hex")),
        BigNum.from_str(this.assetAmountToSend.toString())
      );
      multiAsset.insert(
        ScriptHash.from_bytes(Buffer.from(this.assetPolicyIdHex, "hex")),
        assets
      );

      txOutputBuilder = txOutputBuilder.with_asset_and_min_required_coin(
        multiAsset,
        BigNum.from_str(this.protocolParams.coinsPerUtxoWord)
      );
      const txOutput = txOutputBuilder.build();

      txBuilder.add_output(txOutput);

      const txUnspentOutputs = await this.getTxUnspentOutputs();
      txBuilder.add_inputs_from(txUnspentOutputs, 3);

      txBuilder.add_change_if_needed(shelleyChangeAddress);

      const txBody = txBuilder.build();

      const transactionWitnessSet = TransactionWitnessSet.new();

      const tx = Transaction.new(
        txBody,
        TransactionWitnessSet.from_bytes(transactionWitnessSet.to_bytes())
      );

      let txVkeyWitnesses = await this.API.signTx(
        Buffer.from(tx.to_bytes(), "utf8").toString("hex"),
        true
      );
      txVkeyWitnesses = TransactionWitnessSet.from_bytes(
        Buffer.from(txVkeyWitnesses, "hex")
      );

      transactionWitnessSet.set_vkeys(txVkeyWitnesses.vkeys());

      const signedTx = Transaction.new(tx.body(), transactionWitnessSet);

      const submittedTxHash = await this.API.submitTx(
        Buffer.from(signedTx.to_bytes(), "utf8").toString("hex")
      );
      this.submittedTxHash = submittedTxHash;
    },
    async initTransactionBuilder() {
      const txBuilder = TransactionBuilder.new(
        TransactionBuilderConfigBuilder.new()
          .fee_algo(
            LinearFee.new(
              BigNum.from_str(this.protocolParams.linearFee.minFeeA),
              BigNum.from_str(this.protocolParams.linearFee.minFeeB)
            )
          )
          .pool_deposit(BigNum.from_str(this.protocolParams.poolDeposit))
          .key_deposit(BigNum.from_str(this.protocolParams.keyDeposit))
          .coins_per_utxo_word(BigNum.from_str(this.protocolParams.coinsPerUtxoWord))
          .max_value_size(this.protocolParams.maxValSize)
          .max_tx_size(this.protocolParams.maxTxSize)
          .prefer_pure_change(true)
          .build()
      );

      return txBuilder;
    },
    async getTxUnspentOutputs() {
      let txOutputs = TransactionUnspentOutputs.new();
      for (const utxo of this.Utxos) {
        txOutputs.add(utxo.TransactionUnspentOutput);
      }
      return txOutputs;
    },
  },
  mounted() {
    // Load available wallets on component mount
    this.checkForWallets();
  },
};
</script>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.progress-container {
  position: relative;
  width: 70px; /* Ensure this matches the size of the VProgressCircular */
  height: 70px; /* Same as the size of the progress circle */
}

.circular-image {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 65px; /* Adjust this to match your needs */
  height: 65px; /* Adjust this to match your needs */
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
.loading-text {
  font-size: 16px;
  text-align: center;
  position: relative;
  color: var(--v-primary-lighten4);
}

.dots::after {
  content: '.';
  animation: fadeInOut 1.5s infinite steps(1, end), pulseDots 1.5s infinite;
}

@keyframes pulseDots {
  0% {
    content: '.';
  }
  33% {
    content: '..';
  }
  66% {
    content: '...';
  }
  100% {
    content: '';
  }
}

@keyframes fadeInOut {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.4;
  }
}

.wallet-container {
  padding: 10px;
}

.wallet-card {
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70px;
  transition: background-color 0.3s, border-color 0.3s;
  text-align: center;
}

.wallet-card:hover {
  background-color: var(--v-primary-lighten5);
  border-color: #1976D2;
}

.wallet-card.active {
  background-color: var(--v-primary-lighten4);
  border-color: #1976D2;
}

.wallet-btn-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wallet-icon {
  margin-bottom: 8px;
}

.wallet-name {
  font-size: 14px;
}

.connect-btn {
  width: 100%;
  margin-top: 20px;
}
</style>
