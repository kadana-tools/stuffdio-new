<template>
  <VRow class="my-custom-margin" v-if="!isBackendDataAvailable">
    <VCol cols="12" md="8">
      <SearchOrConnect class="transparent-card" @wallet-connected="handleWalletConnected" />
    </VCol>
  </VRow>

  <VRow class="match-height" v-else>
    <VCol cols="12" md="9" class="d-flex">
      <ProjectGraph class="my-dashboard-margin flex-grow-1" :chartConfigs="chartConfigs" />
    </VCol>

    <VCol cols="12" md="3" class="d-flex">
      <ProjectTotals class="my-dashboard-margin flex-grow-1" :formattedPostData="formattedPostData" />
    </VCol>
  </VRow>
</template>

<script>
import EcosystemRewards from '@/assets/images/illustrations/ecosystemfees_v5.png';
import MiningPickaxe from '@/assets/images/illustrations/miningaxe.png';
import HandCrown from '@/assets/images/illustrations/royalties_v3.png';

import { useWalletStore } from '@/store/walletStore';
import SearchOrConnect from '@/views/my-overview/SearchOrConnect.vue';
import ProjectGraph from '@/views/project/ProjectGraph.vue';
import ProjectTotals from '@/views/project/ProjectTotals.vue';

import axios from 'axios';
import { computed, ref } from 'vue';
import { useTheme } from 'vuetify';

export default {
  components: {
    ProjectGraph,
    ProjectTotals,
    SearchOrConnect,
  },
  setup() {
    const vuetifyTheme = useTheme();
    const data = ref({});
    const Dates = ref([]); // Correctly initialized empty array

    const walletStore = useWalletStore();

    const isWalletConnected = computed(() => walletStore.isWalletConnected);
    const isBackendDataAvailable = computed(() => walletStore.backendDataRetrieved);

    const miningColor = 'rgba(121,207,211,255)';
    const royaltiesColor = 'rgba(254,180,21,255)';
    const ecosystemColor = 'rgba(27,252,127,255)';

    const handleWalletConnected = (connected) => {
      if (walletStore.backendDataRetrieved) {
        walletStore.setWalletConnected(connected);
      }
    };

    const fetchData = async () => {
      try {
        const response = await axios.get('https://stuffd-426805.ew.r.appspot.com/get_project_totals');
        data.value = response.data;
        Dates.value = Object.keys(data.value); // Populate Dates array after data fetch
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Fetch data initially
    fetchData();

    const formattedPostData = computed(() => {
      return data.value || {};
    });

    // Utility function to format numbers in 'k' format
    const formatValueInThousands = (val) => {
      return `${(val / 1000).toFixed(0)}k`;
    };

    // Function to extract month names for the x-axis
    const getMonthLabels = (dates) => {
      return dates.map((date) => new Date(date).toLocaleString('default', { month: 'short' }));
    };

    const chartConfigs = computed(() => {
      const monthLabels = getMonthLabels(Dates.value.slice(0, -1)); // Exclude the last month

      const miningData = Dates.value.slice(0, -1).map((date) => data.value[date]?.Mining || 0);
      const royaltiesData = Dates.value.slice(0, -1).map((date) => data.value[date]?.Royalties || 0);
      const ecosystemData = Dates.value.slice(0, -1).map((date) => data.value[date]?.Ecosystem || 0);

      return [
        {
          title: 'Mining',
          img: MiningPickaxe,
          chartOptions: {
            chart: { type: 'area', toolbar: { show: false } },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800,
            },
            dataLabels: {
              enabled: true,
              formatter: formatValueInThousands,
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                colors: [miningColor],
              },
            },
            fill: { opacity: 0.4 },
            xaxis: {
              categories: monthLabels,
              labels: { style: { fontSize: '13px' } },
            },
            yaxis: {
              labels: {
                formatter: formatValueInThousands,
                style: { fontSize: '13px' },
              },
            },
            colors: [miningColor],
          },
          series: [{ data: miningData }],
        },
        {
          title: 'Ecosystem',
          img: EcosystemRewards,
          chartOptions: {
            chart: { type: 'area', toolbar: { show: false } },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800,
            },
            dataLabels: {
              enabled: true,
              formatter: formatValueInThousands,
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                colors: [ecosystemColor],
              },
            },
            fill: { opacity: 0.4 },
            xaxis: {
              categories: monthLabels,
              labels: { style: { fontSize: '13px' } },
            },
            yaxis: {
              labels: {
                formatter: formatValueInThousands,
                style: { fontSize: '13px' },
              },
            },
            colors: [ecosystemColor],
          },
          series: [{ data: ecosystemData }],
        },
        {
          title: 'Royalties',
          img: HandCrown,
          chartOptions: {
            chart: { type: 'area', toolbar: { show: false } },
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 800,
            },
            dataLabels: {
              enabled: true,
              formatter: formatValueInThousands,
              style: {
                fontSize: '12px',
                fontWeight: 'bold',
                colors: [royaltiesColor],
              },
            },
            fill: { opacity: 0.4 },
            xaxis: {
              categories: monthLabels,
              labels: { style: { fontSize: '13px' } },
            },
            yaxis: {
              labels: {
                formatter: formatValueInThousands,
                style: { fontSize: '13px' },
              },
            },
            colors: [royaltiesColor],
          },
          series: [{ data: royaltiesData }],
        },
      ];
    });

    return {
      chartConfigs,
      formattedPostData,
      isBackendDataAvailable,
      handleWalletConnected,
    };
  },
};
</script>



<style lang="scss">
.my-dashboard-margin {
  margin-top: 80px;
}

.match-height {
  display: flex;
  align-items: stretch;
}

.transparent-card {
  opacity: 0.9; /* Slight transparency */
  transition: opacity 0.3s ease-in-out; /* Smooth transition effect */
}

.my-custom-margin {
  margin-top: 150px;
  margin-left: 0;

  @media (min-width: 600px) {
    margin-top: 250px;
    margin-left: -100px;
  }
}
</style>
