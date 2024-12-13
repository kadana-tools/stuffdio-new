<template>
  <VCard style: height="625">
    <!-- Dropdown for selecting months -->
    <VCardItem>
      <!-- Switch for Monthly / All Time -->
      <VCardText class="d-flex align-center justify-center">
        <!-- "All Time" on the left side of the switch -->
        <span class="mr-4">All Time</span>

        <VSwitch
          v-model="isAllTime"
          inset
          class="mb-3 mt-3"
        />

        <!-- "Monthly" on the right side of the switch -->
        <span class="ml-4 ">Monthly</span>
      </VCardText>

      <!-- Show the dropdown when All Time is not selected -->
      <div class="mb-3" style="height: 48px;">
        <template v-if="!isAllTime">
          <!-- Empty space to prevent layout jump -->
        </template>
        <template v-else>
          <VBtn variant="tonal" size="small" class="d-flex mx-auto">
            <span>{{ new Date(currentMonth).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) }}</span>
            <template #append>
              <VIcon size="16" icon="tabler-chevron-down" />
            </template>

            <!-- VMenu for displaying the available months -->
            <VMenu activator="parent">
              <VList>
                <VListItem
                  v-for="(month, index) in availableMonths"
                  :key="index"
                  @click="updateMonth(month)"
                >
                  <VListItemTitle>{{ new Date(month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) }}</VListItemTitle>
                </VListItem>
              </VList>
            </VMenu>
          </VBtn>
        </template>
      </div>
    </VCardItem>

    <!-- Single VCard for all reward categories -->
    <VCardText>

      <!-- Mining Section -->
      <div class="d-flex flex-column justify-space-between" style="height: 100%;">
        <div class="text-h5 mb-2">Mining</div>
        <div class="d-flex align-center gap-x-4 mb-4">
          <VAvatar rounded size="70">
            <img :src="MiningPickaxe" alt="icon" width="45" height="45" />
          </VAvatar>
          <div class="d-flex align-center ml-auto">
            <span style="font-size: 1.2rem">₳</span>
            <h3 class="text-h3">
              {{ !isAllTime ? formatValue(allTimeData.Mining) : formatValue(formattedPostData[currentMonth]?.Mining || 0) }}
            </h3>
          </div>
        </div>
      </div>

      <!-- Divider between sections -->
      <VDivider />

      <!-- Ecosystem Fees Section -->
      <div class="d-flex flex-column justify-space-between" style="height: 100%;">
        <div class="text-h5 mb-2">Ecosystem Fees</div>
        <div class="d-flex align-center gap-x-4 mb-4">
          <VAvatar rounded size="65">
            <img :src="EcosystemRewards" alt="icon" width="45" height="45" />
          </VAvatar>
          <div class="d-flex align-center ml-auto">
            <span style="font-size: 1.2rem">₳</span>
            <h3 class="text-h3">
              {{ !isAllTime ? formatValue(allTimeData.Ecosystem) : formatValue(formattedPostData[currentMonth]?.Ecosystem || 0) }}
            </h3>            
          </div>
        </div>
      </div>

      <!-- Divider between sections -->
      <VDivider />

      <!-- Royalties Section -->
      <div class="d-flex flex-column justify-space-between" style="height: 100%;">
        <div class="text-h5 mb-2">Royalties</div>
        <div class="d-flex align-center gap-x-4 mb-4">
          <VAvatar rounded size="70">
            <img :src="HandCrown" alt="icon" width="45" height="45" />
          </VAvatar>
          <div class="d-flex align-center ml-auto">
            <span style="font-size: 1.2rem">₳</span>
            <h3 class="text-h3">
              {{ !isAllTime ? formatValue(allTimeData.Royalties) : formatValue(formattedPostData[currentMonth]?.Royalties || 0) }}
            </h3>
          </div>
        </div>
      </div>

    </VCardText>
  </VCard>
</template>

<script>
import EcosystemRewards from '@/assets/images/illustrations/ecosystemfees_v5.png';
import MiningPickaxe from '@/assets/images/illustrations/miningaxe.png';
import HandCrown from '@/assets/images/illustrations/royalties_v3.png';
import { computed, ref, watch } from 'vue';

export default {
  props: {
    formattedPostData: Object,
  },
  setup(props) {
    const availableMonths = ref([]);
    const currentMonth = ref('');
    const isAllTime = ref(false); // Default to "Monthly" when switch is on the right

    // Calculate all-time totals for Mining, Royalties, and Ecosystem Fees
    const allTimeData = computed(() => {
      const totals = { Mining: 0, Royalties: 0, Ecosystem: 0 };
      for (const month in props.formattedPostData) {
        totals.Mining += props.formattedPostData[month]?.Mining || 0;
        totals.Royalties += props.formattedPostData[month]?.Royalties || 0;
        totals.Ecosystem += props.formattedPostData[month]?.Ecosystem || 0;
      }
      return totals;
    });

      // Custom formatting for numbers with commas and decimals
    const formatValue = (value) => {
      if (value < 1) {
        return value.toPrecision(2); // Two significant decimals for small values
      }
      return new Intl.NumberFormat('en-US', { 
        minimumFractionDigits: 0, // No decimals
        maximumFractionDigits: 0 // No decimals
      }).format(value); // Commas and two decimals for larger values
    };

    const formatWholePart = (value) => {
      const [whole] = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0 }).format(value).split('.');
      return whole; // Returns the part before the decimal
    };

    const formatDecimalPart = (value) => {
      const [, decimals] = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value).split('.') || [];
      return decimals ? `.${decimals}` : ''; // Returns the decimal part with a dot
    };


    // Initialize available months based on the provided formattedPostData
    const initializeMonths = () => {
      const months = Object.keys(props.formattedPostData || {});
      if (months.length > 1) {
        availableMonths.value = months.slice(0, -1); // Use all months except the last one (October)
        currentMonth.value = availableMonths.value[availableMonths.value.length - 1]; // Set the most recent month (September) as default
      }
    };

    // Watch for changes in formattedPostData and re-initialize months when it updates
    watch(
      () => props.formattedPostData,
      () => {
        initializeMonths();
      },
      { immediate: true } // Ensure it's called immediately on component mount
    );

    const updateMonth = (month) => {
      currentMonth.value = month;
    };

    return {
      availableMonths,
      currentMonth,
      updateMonth,
      isAllTime, // Toggle between Monthly and All Time
      allTimeData, // Computed all-time data
      MiningPickaxe,
      HandCrown,
      EcosystemRewards,
      formatValue,
      formatWholePart,
      formatDecimalPart
    };
  },
};
</script>

<style scoped>
.rewards-card-statistics {
  border-block-end-style: solid;
  border-block-end-width: 2px;
  height: 200px;
}

.rewards-card-statistics:hover {
  border-block-end-width: 3px;
  margin-block-end: -1px;
  transition: all 0.1s ease-out;
}

.text-h3 {
  font-size: 1.5rem;
  /* font-weight: bold; */
}

.number {
  font-size: 1.5rem; /* Same as text-h3 */
}

.decimal {
  font-size: 1rem; /* Smaller than the main number */
  color: #666; /* Optional: muted color */
}
</style>
