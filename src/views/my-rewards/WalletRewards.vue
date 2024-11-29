<script>
import { computed, ref } from 'vue';

// Import images
import DerpRewards from '@/assets/images/illustrations/derptoken.png'; // Replace with actual derp image
import EcosystemRewards from '@/assets/images/illustrations/ecosystemfees_v5.png'; // Replace with actual ecosystem image
import MiningPickaxe from '@/assets/images/illustrations/miningaxe.png';
import HandCrown from '@/assets/images/illustrations/royalties_v3.png'; // Replace with actual hand holding crown image

export default {
  props: {
    Rewards_Data: Object,
  },
  setup(props) {
    // Extract the available months from the rewards data, excluding the last month
    const availableMonths = ref([]);
    const currentMonth = ref('');

    // Initialize the months based on available data, ignoring the last month
    const initializeMonths = () => {
      if (props.Rewards_Data && props.Rewards_Data['Total wallet mining rewards']) {
        const months = Object.keys(props.Rewards_Data['Total wallet mining rewards'] || {});
        if (months.length > 1) {
          availableMonths.value = months.slice(0, months.length - 1); // Exclude the last month
          currentMonth.value = availableMonths.value[availableMonths.value.length - 1]; // Default to the second-to-last month
        }
      }
    };

    initializeMonths();

    // Function to update the current month
    const updateMonth = (month) => {
      currentMonth.value = month;
    };

    // Helper function to calculate the percentage change
    const calculatePercentageChange = (currentValue, previousValue) => {
      if (previousValue === 0) return 0; // Avoid division by zero
      return (((currentValue - previousValue) / previousValue) * 100).toFixed(1);
    };

    // Get the reward data and percentage change for the selected month
    const rewardData = computed(() => {
      const selectedIndex = availableMonths.value.indexOf(currentMonth.value);
      const previousMonth = selectedIndex > 0 ? availableMonths.value[selectedIndex - 1] : null;

      return [
        {
          img: MiningPickaxe, // Use the imported mining pickaxe image
          color: 'primary',
          title: 'Mining',
          value: props.Rewards_Data['Total wallet mining rewards'][currentMonth.value] || 0,
          change: previousMonth
            ? calculatePercentageChange(
                props.Rewards_Data['Total wallet mining rewards'][currentMonth.value] || 0,
                props.Rewards_Data['Total wallet mining rewards'][previousMonth] || 0
              )
            : 0, // No change if no previous month
          isHover: false,
        },
        {
          img: EcosystemRewards, // Use the imported ecosystem rewards image
          color: 'error',
          title: 'Ecosystem Fees',
          value: props.Rewards_Data['Total wallet ecosystem fees'][currentMonth.value] || 0,
          change: previousMonth
            ? calculatePercentageChange(
                props.Rewards_Data['Total wallet ecosystem fees'][currentMonth.value] || 0,
                props.Rewards_Data['Total wallet ecosystem fees'][previousMonth] || 0
              )
            : 0,
          isHover: false,
        },
        {
          img: HandCrown, // Use the imported hand holding crown image
          color: 'warning',
          title: 'Royalties',
          value: props.Rewards_Data['Total wallet royalties'][currentMonth.value] || 0,
          change: previousMonth
            ? calculatePercentageChange(
                props.Rewards_Data['Total wallet royalties'][currentMonth.value] || 0,
                props.Rewards_Data['Total wallet royalties'][previousMonth] || 0
              )
            : 0,
          isHover: false,
        },
        {
          img: DerpRewards, // Use the imported derp rewards image
          color: 'info',
          title: '$Derp',
          value: props.Rewards_Data['Total wallet derp rewards'] || 0,
          isHover: false,
        },
      ];
    });

    return {
      rewardData,
      availableMonths,
      currentMonth,
      updateMonth,
    };
  },
};
</script>




<template>
  <VCard>
    <VCardItem title="Total Rewards">
      <template #append>
        <!-- VBtn with dropdown for selecting months -->
        <VBtn
          variant="tonal"
          size="small"
          class="d-flex mx-auto"
        >
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
                :value="index"
                @click="updateMonth(month)"
              >
                <VListItemTitle>{{ new Date(month).toLocaleDateString(undefined, { year: 'numeric', month: 'long' }) }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </template>
    </VCardItem>

    <!-- Rewards cards displaying data based on selected month -->
    <VRow>
      <VCol
        v-for="(data, index) in rewardData"
        :key="index"
        cols="12"
        lg="3"
        md="6"
        sm="6"
      >
        <VCardText>
          <VCard
            class="rewards-card-statistics cursor-pointer"
            :style="data.isHover ? `border-block-end-color: rgb(var(--v-theme-${data.color}))` : `border-block-end-color: rgba(var(--v-theme-${data.color}),0.38)`"
            @mouseenter="data.isHover = true"
            @mouseleave="data.isHover = false"
          >
            <!-- Apply flex column and space between for vertical distribution -->
            <VCardText class="d-flex flex-column justify-space-between" style="height: 100%;">
              
              <!-- Title div -->
              <div class="text-h5 mb-2">
                {{ data.title }}
              </div>

              <!-- Avatar and Value div -->
              <div class="d-flex align-center gap-x-4 mb-4">
                <VAvatar rounded size="70">
                  <img :src="data.img" alt="icon" width="65" height="65" v-if="data.img" />
                </VAvatar>
                <div class="d-flex align-center ml-auto">
                  <!-- Round the value to 1 decimal -->
                  <span v-if="data.title !== '$Derp'" style="font-size: 1.1rem; margin-left: 4px;">₳</span>
                  <h3 class="text-h3">{{ parseFloat(data.value).toFixed(2) }}</h3>
                  <!-- Add "ada" for all except Derp rewards -->
                  <!-- Add '/epoch' for Derp rewards -->
                  <span v-if="data.title === '$Derp'" style="font-size: 0.8rem; margin-left: 4px;">/epoch</span>
                </div>
              </div>

              <!-- Change info div -->
              <div class="d-flex gap-x-2 align-center">
                <h6 v-if="data.title !== '$Derp'" class="text-h6">
                  {{ (data.change > 0) ? '+' : '' }} {{ data.change }}%
                </h6>
                <div v-if="data.title !== '$Derp'" class="text-sm text-disabled">
                  than prior month
                </div>
              </div>

            </VCardText>
          </VCard>
        </VCardText>
      </VCol>
    </VRow>

  </VCard>
</template>



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
</style>
