<template>
  <VCard>
    <!-- Dropdown for selecting months -->
    <VCardItem title="Mined Coins"></VCardItem>

    <VCardItem style="padding: 0; margin: 0;">
      <!-- Switch for Monthly / All Time -->
      <VCardText class="d-flex align-center justify-center">
        <!-- "All Time" on the left side of the switch -->
        <span class="mr-4">All Time</span>

        <VSwitch
          v-model="isAllTime"
          inset
          class="switch-adjustments"
        />

        <!-- "Monthly" on the right side of the switch -->
        <span class="ml-4">Today</span>
      </VCardText>
    </VCardItem>

    <VCardText class="mb-0 mt-0" style="font-style: italic;">  As of 8AM UTC Yesterday </VCardText>

    <VCardText>
      <VRow>
        <!-- Iterate over the mined coins data and display in columns -->
        <VCol
          v-for="(coin, index) in minedCoinsData"
          :key="index"
          :cols="12"   
          :sm="12"     
          :md="6"
          :lg="4"      
        >
          <VCard class="d-flex flex-column justify-space-between">
            <div class="coin-item d-flex align-center gap-x-4 mb-1">
              <VAvatar rounded size="70">
                <img :src="getCoinLogo(coin.currency)" :alt="coin.currency" class="coin-logo" />
              </VAvatar>
              <div class="d-flex flex-column align-end ml-auto">
                <div class="d-flex align-center mt-4">
                  <h3 class="text-h3">+{{ formatValue(isAllTime ? coin.today : coin.allTime) }}</h3>
                  <span style="font-size: 0.8rem; margin-left: 4px;">{{ coin.currency }}</span>
                </div>
                <p class="coins-value">+${{ formatValue(isAllTime ? coin.coinsValueToday : coin.coinsValueAllTime) }}</p>
              </div>
            </div>
          </VCard>
        </VCol>
      </VRow>
    </VCardText>


  </VCard>
</template>


<script>
import LogoBitcoin from "@/assets/images/illustrations/logo-bitcoin.webp";
import LogoDash from "@/assets/images/illustrations/logo-dash.webp";
import LogoDogecoin from "@/assets/images/illustrations/logo-dogecoin.webp";
import LogoKaspa from "@/assets/images/illustrations/logo-kaspa.webp";
import LogoLitecoin from "@/assets/images/illustrations/logo-litecoin.webp";
import LogoMonero from "@/assets/images/illustrations/logo-monero.webp";
import LogoNervos from "@/assets/images/illustrations/logo-nervos-green.png";

export default {
  props: {
    minedCoinsData: {
      type: Array,
      required: true,
    },
  },
  data() {
    return {
      isAllTime: true, // Toggle between Monthly and All Time
      coinLogos: {
        BTC: LogoBitcoin,
        DASH: LogoDash,
        DOGE: LogoDogecoin,
        KAS: LogoKaspa,
        LTC: LogoLitecoin,
        XMR: LogoMonero,
        CKB: LogoNervos,
      },
    };
  },
  methods: {
    getCoinLogo(currency) {
      return this.coinLogos[currency] || "";
    },
    formatValue(value) {
      if (value < 1) {
        return value.toPrecision(2); // Two significant decimals
      } else {
        return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);
      }
    },
  },
};
</script>


<style scoped>
/* Adjust margins and paddings for the switch */
.switch-adjustments {
  margin-top: 2px !important;
  margin-bottom: 2px !important;
}

.coin-item {
  text-align: center;
  padding: 10px;
  transition: transform 0.2s ease;
}

.grid-item:hover {
  transform: scale(1.05);
}

.coin-logo {
  width: 50px;
  height: 50px;
}

.text-h5 {
  font-weight: bold;
  margin-bottom: 8px;
}

.text-h3 {
  font-size: 1.5rem;
  /* font-weight: bold; */
  margin: 0;
}

.coins-value {
  font-size: 1rem; /* Slightly smaller than the main value */
  color: #666; /* Optional: muted color for secondary info */
  margin-top: 4px;
}
</style>
