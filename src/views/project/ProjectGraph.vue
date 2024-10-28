<template>
  <VCard style="height: 625px;">
    <VCardItem title="Project Performance"> </VCardItem>

    <VCardText>
      <div class="d-flex justify-space-between align-center">
        <!-- Slide group for charts -->
        <VSlideGroup v-model="selectedCharts" show-arrows class="mb-10">
          <VSlideGroupItem
            v-for="(chartConfig, index) in chartConfigs"
            :key="chartConfig.title"
            :value="index"
          >
            <div
              style="block-size: 80px; inline-size: 110px;"
              :style="selectedCharts.includes(index) ? 'border-color:rgb(var(--v-theme-primary)) !important' : ''"
              :class="selectedCharts.includes(index) ? 'border' : 'border border-dashed'"
              class="d-flex flex-column justify-center align-center cursor-pointer rounded py-4 px-5 me-4"
              @click="toggleChart(index)"
            >
              <!-- Use the imported images instead of the VIcon component -->
              <VAvatar rounded size="40" class="mb-2">
                <img :src="chartConfig.img" alt="Chart Image" width="32" height="32" />
              </VAvatar>
              <h6 class="text-base font-weight-medium mb-0">{{ chartConfig.title }}</h6>
            </div>
          </VSlideGroupItem>
        </VSlideGroup>
      </div>

      <!-- Render the combined chart for all selected series -->
      <VueApexCharts
        v-if="selectedSeries.length > 0"
        :options="combinedChartOptions"
        :series="selectedSeries"
        height="400"
        class="mt-1"
      />
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
    // Initial value: set Mining chart (index 0) as selected by default
    const selectedCharts = ref([0]);

    // Function to format values in thousands
    const formatValueInThousands = (val) => {
      return `${(val / 1000).toFixed(0)}k`;
    };

    // Toggle chart selection on click
    const toggleChart = (index) => {
      const chartIndex = selectedCharts.value.indexOf(index);
      if (chartIndex === -1) {
        selectedCharts.value.push(index); // Add chart if not selected
      } else if (selectedCharts.value.length > 1) {
        selectedCharts.value.splice(chartIndex, 1); // Remove chart only if more than one is selected
      }
    };

    // Combine all selected chart series into one
    const selectedSeries = computed(() => {
      return selectedCharts.value.map(index => {
        return {
          name: props.chartConfigs[index].title, // Ensure series name matches chart title
          data: props.chartConfigs[index].series[0].data,
        };
      });
    });

    // Combine chart options, ensuring correct colors for data labels and formatting numbers as thousands
    const combinedChartOptions = computed(() => {
      if (selectedCharts.value.length > 0) {
        return {
          ...props.chartConfigs[selectedCharts.value[0]].chartOptions,
          chart: {
            type: 'area',  // Ensure the chart type is 'area' (surface chart)
            toolbar: { show: false },  // Disable the toolbar (zoom, pan, etc.)
            animations: {
              enabled: true,
              easing: 'easeinout',
              speed: 1000, // Slowing down the animation speed by 25%
            },
          },
          legend: {
            show: true, // Enable legend to distinguish the series
          },
          colors: selectedCharts.value.map(index => props.chartConfigs[index].chartOptions.colors[0]),
          dataLabels: {
            enabled: true,
            formatter: formatValueInThousands, // Format data labels as thousands (e.g., 15k)
            style: {
              colors: selectedCharts.value.map(index => props.chartConfigs[index].chartOptions.colors[0]), // Ensure unique data label colors
            },
          },
          yaxis: {
            labels: {
              formatter: formatValueInThousands, // Format y-axis labels as thousands (e.g., 15k)
              style: {
                fontSize: '13px',
              },
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
