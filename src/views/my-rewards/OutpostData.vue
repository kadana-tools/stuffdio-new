<script>
import { computed, ref } from 'vue';

// Import images
import img_derpape from '@/assets/images/illustrations/derpape.png';
import img_derpbird from '@/assets/images/illustrations/derpbird.png';
import img_derpling from '@/assets/images/illustrations/derpling.png';
import img_pred from '@/assets/images/illustrations/pred.png';

export default {
  props: {
    Outpost_Data: {
      type: Array,
      default: () => [],
    },
  },
  setup(props) {
    const availableMonths = ref([]);
    const currentMonth = ref('');
    const expandedCards = ref({});
    const menuVisible = ref(false);

    // Initialize months based on Outpost_Data
    const initializeMonths = () => {
      const dates = new Set();
      if (Array.isArray(props.Outpost_Data) && props.Outpost_Data.length > 0) {
        props.Outpost_Data.forEach(post => {
          Object.keys(post?.MiningRewards || {}).forEach(date => dates.add(date));
        });

        const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));
        if (sortedDates.length > 1) {
          availableMonths.value = sortedDates.slice(0, sortedDates.length - 1); // Exclude last month
          currentMonth.value = availableMonths.value[availableMonths.value.length - 1];
        }
      }
    };

    initializeMonths();

    // Update selected month
    const updateMonth = (month) => {
      currentMonth.value = month;
    };

    // Function to format month and year
    const formatMonth = (dateString) => {
      return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
      });
    };

    // Helper function to round values and handle 0s
    const formatReward = (value) => {
      return value === 0 ? '0' : parseFloat(value).toFixed(1);
    };

    // Function to select the image based on faction
    const getAvatarImage = (Faction) => {
      switch(Faction) {
        case 'Preds':
          return img_pred;
        case 'Derp Birds':
          return img_derpbird;
        case 'Derplings':
          return img_derpling;
        case 'Derp Apes':
          return img_derpape;
        default:
          return img_pred; // Default image if faction is unknown
      }
    };

    // Computed data for each outpost's rewards
    const outpostRewards = computed(() => {
      return props.Outpost_Data
        .filter(post => {
          return post?.MiningRewards?.[currentMonth.value] || post?.DerpRewards || post?.EcosystemFees?.[currentMonth.value] || post?.Royalties?.[currentMonth.value];
        })
        .map(post => {
          const mining = parseFloat(post?.MiningRewards?.[currentMonth.value] || 0).toFixed(1);
          const royalties = parseFloat(post?.Royalties?.[currentMonth.value] || 0).toFixed(1);
          const ecosystemFees = parseFloat(post?.EcosystemFees?.[currentMonth.value] || 0).toFixed(1);
          const sumRewards = (parseFloat(mining) + parseFloat(royalties) + parseFloat(ecosystemFees)).toFixed(1);

          return {
            ...post,
            MiningReward: mining === '0.0' ? '-' : mining,
            Royalties: royalties === '0.0' ? '-' : royalties,
            EcosystemFees: ecosystemFees === '0.0' ? '-' : ecosystemFees,
            TotalSum: sumRewards === '0.0' ? '-' : sumRewards, // Display sum rounded to 1 decimal, or '-' if 0
            DerpReward: post?.DerpRewards || '-', // Ensure DerpReward is being captured correctly
            avatarImage: getAvatarImage(post.Faction), // Add avatarImage key based on faction
          };
        });
    });

    const toggleCardExpansion = (postId) => {
      expandedCards.value[postId] = !expandedCards.value[postId];
    };

    return {
      availableMonths,
      currentMonth,
      updateMonth,
      formatMonth,
      formatReward, // Use this to format rewards
      outpostRewards,
      expandedCards,
      toggleCardExpansion,
      menuVisible,
    };
  },
};
</script>

<template>
  <VCard>
    <VCardItem title="Rewards per Outpost">
      <template #append>
        <!-- VBtn with dropdown for selecting months -->
        <VBtn
          variant="tonal"
          size="small"
          class="d-flex mx-auto"
        >
          <span>{{ formatMonth(currentMonth) }}</span>

          <template #append>
            <VIcon size="16" icon="tabler-chevron-down" />
          </template>

          <!-- VMenu for displaying available months -->
          <VMenu v-model="menuVisible" activator="parent" @click:outside="menuVisible = false">
            <VList>
              <VListItem
                v-for="(month, index) in availableMonths"
                :key="index"
                @click="updateMonth(month); menuVisible = false"
              >
                <VListItemTitle>{{ formatMonth(month) }}</VListItemTitle>
              </VListItem>
            </VList>
          </VMenu>
        </VBtn>
      </template>
    </VCardItem>

    <!-- Display Outpost rewards based on selected month -->
    <VRow>
      <VCol
        v-for="(post, index) in outpostRewards"
        :key="post.Outpost_ID"
        cols="12"
        lg="3"
        md="6"
        sm="6" 
      >
        <VCardText>
          <VCard
            class="rewards-card-statistics cursor-pointer"
            :style="post.isHover ? `border-block-end-color: rgb(var(--v-theme-primary))` : `border-block-end-color: rgba(var(--v-theme-primary),0.38)`"
            @mouseenter="post.isHover = true"
            @mouseleave="post.isHover = false"
          >
            <div class="image-container">
              <VImg :src="post.Image" />
              <!-- Avatar dynamically set based on post.Faction -->
              <div class="avatar-container d-flex justify-center">
                <VAvatar
                  size="36"
                  class="avatar-style"
                  round
                >
                <img :src="post.avatarImage" alt="Faction Avatar" width="36" height="36" />
              </VAvatar>
              </div>
            </div>

            
            <VCardText>
              <div class="text-h5 mb-2">{{ post.Outpost_ID }}</div>

              <div class="d-flex justify-space-between align-center mb-4">
                <!-- Hoverable section: Rewards and toggle icon -->
                <div
                  class="sum-text rewards-hover d-flex align-center"
                  style="font-size: 0.9rem; font-weight: bold; cursor: pointer;"
                  @click="toggleCardExpansion(post.Outpost_ID)"
                >
                  Rewards:
                  <VIcon
                    :icon="expandedCards[post.Outpost_ID] ? 'tabler-chevron-up' : 'tabler-chevron-down'"
                    size="16"
                    class="ml-1"
                  />
                </div>

                <!-- Non-hoverable section: Total sum -->
                <div class="sum-value">
                  <h4 class="text-h4">{{ post.TotalSum }}</h4>
                  <span style="font-size: 0.8rem; margin-left: 4px;">ada</span>
                </div>
              </div>

              <VExpandTransition>
                <div v-show="expandedCards[post.Outpost_ID]">
                  <VDivider />
                  <VCardText>
                    <!-- Detailed breakdown -->
                    <div class="d-flex align-center gap-x-4 mb-4">
                      <div class="sum-text" style="font-size: 0.8rem; font-weight: bold;">Mining:</div>
                      <div class="d-flex align-center ml-auto">
                        <span class="ml-2">{{ post.MiningReward }}</span>
                        <span v-if="post.MiningReward !== '-'" class="ada-unit">ada</span> <!-- Added class 'ada-unit' -->
                      </div>
                    </div>

                    <div class="d-flex align-center gap-x-4 mb-4">
                      <div class="sum-text" style="font-size: 0.8rem; font-weight: bold;">Ecosystem Fees:</div>
                      <div class="d-flex align-center ml-auto">
                        <span class="ml-2">{{ post.EcosystemFees }}</span>
                        <span v-if="post.EcosystemFees !== '-'" class="ada-unit">ada</span> <!-- Added class 'ada-unit' -->
                      </div>
                    </div>

                    <div class="d-flex align-center gap-x-4 mb-4">
                      <div class="sum-text" style="font-size: 0.8rem; font-weight: bold;">Royalties:</div>
                      <div class="d-flex align-center ml-auto">
                        <span class="ml-2">{{ post.Royalties }}</span>
                        <span v-if="post.Royalties !== '-'" class="ada-unit">ada</span> <!-- Added class 'ada-unit' -->
                      </div>
                    </div>

                  </VCardText>
                </div>
              </VExpandTransition>


              <div class="d-flex align-center gap-x-4 ml-2 mb-4">
                <div class="sum-text" style="font-size: 0.9rem; font-weight: bold;">
                  $Derp:
                </div>
                <div class="d-flex align-center ml-auto">
                  <h6 class="text-h6">{{ post.DerpReward }}</h6>
                  <span style="font-size: 0.8rem; margin-left: 4px;">/epoch</span>
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
  position: relative;
  border-block-end-style: solid;
  border-block-end-width: 2px;

  &:hover {
    border-block-end-width: 3px;
    margin-block-end: -1px;
    transition: all 0.1s ease-out;
  }
}

.ada-unit {
  font-size: 0.8rem;
  margin-left: 4px;
  font-weight: normal; /* Match this to other styling if needed */
}

.image-container {
  position: relative;
}

.avatar-container {
  position: absolute;
  display: flex;
  justify-content: center;
  inset-block-end: -1rem; /* Move avatar to bottom of the image */
  inset-inline-start: 1rem; /* Control horizontal positioning */
  z-index: 10; /* Bring the avatar in front */
}

.avatar-style {
  border: 3px solid rgb(var(--v-theme-surface)); /* Border color */
  background-color: rgba(var(--v-theme-surface)); /* Background color */
}

.rewards-hover {
  transition: background-color 0.3s ease, color 0.3s ease;
  padding: 4px 8px;
  border-radius: 4px;
}

.rewards-hover:hover {
  background-color: rgba(var(--v-theme-primary), 0.1); /* Slight background highlight */
  color: var(--v-theme-primary); /* Change text color on hover */
}

.sum-text {
  font-family: 'Arial', sans-serif; /* Customize the font as needed */
  cursor: pointer; /* Add pointer for clickability */
}

.sum-value {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
