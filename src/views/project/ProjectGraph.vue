<template>
  <VCard style="height: 625px;">
    <VCardItem title="Project Performance"> </VCardItem>

    <VCardText>
      <div class="slide-group-container d-flex justify-space-between align-center">
        <!-- Slide group for charts -->
        <VSlideGroup v-model="selectedCharts" show-arrows class="mb-10">
          <VSlideGroupItem
            v-for="(chartConfig, index) in chartConfigs"
            :key="chartConfig.title"
            :value="index"
          >
            <div
              class="slide-group-item"
              :style="selectedCharts.includes(index) ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
              :class="selectedCharts.includes(index) ? 'border' : 'border border-dashed'"
              @click="toggleChart(index)"
            >
              <VAvatar rounded size="40" class="mb-2">
                <img :src="chartConfig.img" alt="Chart Image" width="32" height="32" />
              </VAvatar>
              <h6 class="slide-group-title text-base font-weight-medium mb-0">{{ chartConfig.title }}</h6>
            </div>
          </VSlideGroupItem>
        </VSlideGroup>
      </div>

      <!-- Render the combined chart for all selected series with reduced padding on small screens -->
      <div class="graph-container">
        <VueApexCharts
          v-if="selectedSeries.length > 0"
          :options="combinedChartOptions"
          :series="selectedSeries"
          height="400"
          class="mt-1"
        />
      </div>
    </VCardText>
  </VCard>
</template>

<script>
import { computed, ref } from 'vue';
import VueApexCharts from 'vue3-apexcharts';

export default {
  components: {
    VueApexCharts,
  },
  props: {
    chartConfigs: Array,
  },
  setup(props) {
    const selectedCharts = ref([0]);

    const formatValueInThousands = (val) => `${(val / 1000).toFixed(0)}k`;

    const toggleChart = (index) => {
      const chartIndex = selectedCharts.value.indexOf(index);
      if (chartIndex === -1) {
        selectedCharts.value.push(index);
      } else if (selectedCharts.value.length > 1) {
        selectedCharts.value.splice(chartIndex, 1);
      }
    };

    const selectedSeries = computed(() => selectedCharts.value.map(index => ({
      name: props.chartConfigs[index].title,
      data: props.chartConfigs[index].series[0].data,
    })));

    const combinedChartOptions = computed(() => {
      if (selectedCharts.value.length > 0) {
        return {
          ...props.chartConfigs[selectedCharts.value[0]].chartOptions,
          chart: {
            type: 'area',
            toolbar: { show: false },
            animations: { enabled: true, easing: 'easeinout', speed: 1000 },
          },
          legend: { show: true },
          colors: selectedCharts.value.map(index => props.chartConfigs[index].chartOptions.colors[0]),
          dataLabels: {
            enabled: true,
            formatter: formatValueInThousands,
            style: {
              colors: selectedCharts.value.map(index => props.chartConfigs[index].chartOptions.colors[0]),
            },
          },
          yaxis: {
            labels: {
              formatter: formatValueInThousands,
              style: { fontSize: '13px' },
            },
          },
        };
      }
      return {};
    });

    return {
      selectedCharts,
      selectedSeries,
      combinedChartOptions,
      toggleChart,
    };
  },
};
</script>

<style scoped>
/* Default styles for slide group items */
.slide-group-item {
  block-size: 80px;
  inline-size: 110px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  border-radius: 8px;
  padding: 1rem;
  margin-inline-end: 1rem;
}

/* Default font size for title */
.slide-group-title {
  font-size: 1rem;
}

/* Styles for screens smaller than 600px */
@media (max-width: 600px) {
  .slide-group-item {
    block-size: 70px;
    inline-size: 90px;
  }

  .slide-group-title {
    font-size: 0.8rem;
  }

    /* Retain padding for the slide group container */
    .slide-group-container {
    padding-left: 1rem;
    padding-right: 1rem;
  }

  /* Reduce padding around the graph on smaller screens */
  .graph-container {
    padding-left: 0rem;
    padding-right: 0rem;
  }
}
@media (max-width: 600px) {
  .v-card-text {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }

  .v-card {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}

</style>
