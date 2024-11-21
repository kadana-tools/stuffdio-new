<template>
  <VCard class="revenue-report">
    <VRow class="charts-container">
      <!-- Sizes Chart -->
      <div class="sizes-chart">
        <VCardItem title="Totals">
          <template #append>
            <MoreBtn />
          </template>
        </VCardItem>
        <VCardText>
          <apexchart 
            width="100%"
            type="donut"
            :options="chartOptionsTotal"
            :series="chartSeriesTotal"
          />
        </VCardText>
      </div>

      <!-- Fortification Chart -->
      <div class="fortification-chart">
        <VCardItem title="Fortification" class="fortification-title" />
        <VCardText>
          <div>
            <apexchart 
              ref="fortificationChart"
              width="100%" 
              type="radialBar"
              :options="chartOptionsFortification"
              :series="chartSeriesFortification"
            />
            <div v-if="selectedSeriesValue !== null" class="series-value">
              {{ selectedSeriesValue }}%
            </div>
            <div v-else class="series-value">
              {{ fortifiedPercTotal }}%
            </div>

            <!-- Images for toggling series -->
            <div class="image-toggle-container">
              <img 
                v-for="(image, index) in images" 
                :key="index" 
                :src="image.src" 
                :alt="image.alt" 
                class="toggle-image"
                :class="{ selected: selectedImageIndex === index }" 
                @click="toggleSeries(image.alt, index)"
              />
            </div>
          </div>
        </VCardText>
      </div>
    </VRow>
  </VCard>
</template>



<script>
import img_derpape from '@/assets/images/illustrations/derpape.png';
import img_derpbird from '@/assets/images/illustrations/derpbird.png';
import img_derpling from '@/assets/images/illustrations/derpling.png';
import img_pred from '@/assets/images/illustrations/pred.png';

import { computed, onMounted, ref, watch } from 'vue';
import VueApexCharts from "vue3-apexcharts";
import { useTheme } from 'vuetify';

export default {
  components: {
    apexchart: VueApexCharts
  },

  props: {
    Overview_Data: Object
  },

  setup(props) {

    // Access Vuetify theme for dynamic color management
    const theme = useTheme();
    const headingColor = computed(() => `rgba(var(--v-theme-on-background), var(--v-high-emphasis-opacity))`);
    const labelColor = computed(() => `rgba(var(--v-theme-on-background), var(--v-medium-emphasis-opacity))`);
    
    const fortificationChart = ref(null);
    const selectedImageIndex = ref(null);
    const selectedSeriesValue = ref(null);
    const chartSeriesFortification = ref([0, 0, 0, 0]);
    const fortifiedPercTotal = ref(props.Overview_Data?.["Fortification perc_and_count"]?.["fortified_perc_total"] || 0);

    const updateChartSeries = () => {
      chartSeriesFortification.value = [
        props.Overview_Data?.["Fortification perc_and_count"]?.["fortified_perc_pred"].toFixed(1) || 0,
        props.Overview_Data?.["Fortification perc_and_count"]?.["fortified_perc_derp"].toFixed(1) || 0,
        props.Overview_Data?.["Fortification perc_and_count"]?.["fortified_perc_derpling"].toFixed(1) || 0,
        props.Overview_Data?.["Fortification perc_and_count"]?.["fortified_perc_derpape"].toFixed(1) || 0,
      ];
      fortifiedPercTotal.value = props.Overview_Data?.["Fortification perc_and_count"]?.["fortified_perc_total"].toFixed(1) || 0;
    };

    const toggleSeries = (seriesName, index) => {
      if (selectedImageIndex.value === index) {
        selectedImageIndex.value = null;
        selectedSeriesValue.value = null;
        fortificationChart.value.updateSeries(chartSeriesFortification.value);
      } else {
        const seriesNames = ["Preds", "Derp Birds", "Derplings", "Derp Apes"];
        seriesNames.forEach((name, i) => {
          if (name === seriesName) {
            selectedSeriesValue.value = chartSeriesFortification.value[i];
            selectedImageIndex.value = index;
          }
        });
        fortificationChart.value.updateOptions({
          series: chartSeriesFortification.value.map((val, i) =>
            i === index ? val : 0
          )
        });
      }
    };

    onMounted(() => {
      if (props.Overview_Data) {
        updateChartSeries();
      }
    });

    watch(() => props.Overview_Data, () => {
      if (props.Overview_Data) {
        updateChartSeries();
      }
    });

    // Define chart options for the donut chart
    const chartOptionsTotal = ref({
      chart: {
        type: 'donut',
        id: 'vuechart-example',
      },
      labels: ['Small', 'Medium', 'Large'],
      legend: {
        position: 'bottom',
        labels: {
          colors: 'headingColor.value', // Use the headingColor dynamically
        },
      },
      colors: ['rgba(112,163,158,255)', 'rgba(182,63,106,255)', 'rgb(67, 69, 98)'],
      plotOptions: {
        pie: {
          startAngle: 0,
          endAngle: 360,
          expandOnClick: true,
          offsetX: 0,
          offsetY: 0,
          customScale: 1,
          dataLabels: {
            offset: 0,
            minAngleToShowLabel: 360 
          },
          donut: {
            size: '70%',
            background: 'transparent',
            labels: {
              show: true,
              name: {
                show: false,
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                colors: headingColor.value, // Use the headingColor dynamically
                offsetY: 0,
              },
              value: {
                show: true,
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: headingColor.value, // Use the headingColor dynamically
                offsetY: 8,
              },
              total: {
                show: true,
                showAlways: true,
                label: 'Total',
                fontSize: '22px',
                fontFamily: 'Helvetica, Arial, sans-serif',
                fontWeight: 600,
                color: headingColor.value, // Use the headingColor dynamically
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => a + b, 0);
                }
              }
            }
          }
        }
      }
    });

    // Watch for theme changes and update chart colors dynamically
    watch(
      [headingColor, labelColor],
      ([newHeadingColor, newLabelColor]) => {
        chartOptionsTotal.value.legend.labels.colors = newHeadingColor;
        chartOptionsTotal.value.plotOptions.pie.donut.labels.value.color = newHeadingColor;
        chartOptionsTotal.value.plotOptions.pie.donut.labels.total.color = newLabelColor;
      }
    );

    const chartOptionsFortification = ref({
      chart: {
        height: '100%',
        type: 'radialBar',
        expandOnClick: true,
        offsetY: -20,
        offsetX: 0,
      },
      labels: ["Preds", "Derp Birds", "Derplings", "Derp Apes"],
      colors: ['rgba(255,32,55,255)', 'rgba(0,210,219,255)', 'rgba(35,218,133,255)', 'rgba(247,160,62,255)'],
      legend: {
        show: false,
      },
      tooltip: {
        shared: false,
        intersect: true,
      },
      markers: {
        size: 0.1,
      },
      plotOptions: {
        radialBar: {
          hollow: {
            margin: 5,
            size: '47%',
            background: 'transparent',
          },
          track: {
            show: true,
            background: '#40475D',
            strokeWidth: '10%',
            opacity: 0.6,
            margin: 3,
          },
          dataLabels: {
            name: {
              show: false,
              fontSize: '16px',
              fontWeight: 600,
              offsetY: -10,
            },
            value: {
              show: true,
              fontSize: '16px',
              fontWeight: 600,
              formatter(val) {
                return val.toFixed(1) + '%';
              },
            },
            total: {
              show: false,
              fontSize: '16px',
              fontWeight: 600,
              color: 'rgb(0,0,0)',
            },
          },
          startAngle: -125,
          endAngle: 125,
        },
      },
    });

    // Computed property for the total chart series
    const chartSeriesTotal = computed(() => {
      if (!props.Overview_Data || !props.Overview_Data["nr of NFTs"]) {
        return [0, 0, 0];
      }
      return [
        props.Overview_Data["nr of NFTs"]["#Smalls"] || 0,
        props.Overview_Data["nr of NFTs"]["#Mediums"] || 0,
        props.Overview_Data["nr of NFTs"]["#Larges"] || 0,
      ];
    });

    // Computed property for the locked value
    const derpLockedValue = computed(() => {
      if (!props.Overview_Data || !props.Overview_Data["Total $Derp Locked"]) {
        return '0';
      }
      return props.Overview_Data["Total $Derp Locked"];
    });

    return {
      fortificationChart,
      images: [
        { src: img_pred, alt: 'Preds' },
        { src: img_derpbird, alt: 'Derp Birds' },
        { src: img_derpling, alt: 'Derplings' },
        { src: img_derpape, alt: 'Derp Apes' }
      ],
      toggleSeries,
      selectedImageIndex,
      selectedSeriesValue,
      chartSeriesFortification,
      fortifiedPercTotal,
      chartOptionsTotal,
      chartOptionsFortification,
      chartSeriesTotal,
      derpLockedValue,
    };
  }
}


</script>


<style> /*Chatgpt: Scoped styles (<style scoped>) generate unique class names, preventing media queries from matching elements. Use plain <style> instead.
/* General Styles */
.charts-container {
  display: flex;
  flex-wrap: wrap;
}

.sizes-chart,
.fortification-chart {
  flex: 0 0 100%;
  max-width: 100%;
}

/* Between 600px and 1399px: Row layout */
@media (min-width:700px) and (max-width: 1399px) {
  .sizes-chart {
    flex: 0 0 50%;
    max-width: 50%;
  }
  .fortification-chart {
    flex: 0 0 50%;
    max-width: 50%;
  }
}

/* Larger than 1400px: Vertical layout */
@media (min-width: 1400px) {
  .sizes-chart,
  .fortification-chart {
    flex: 0 0 100%;
    max-width: 100%;
  }
}

/* Divider styles for visual separation (optional) */
.divider {
  display: none;
}

@media (min-width: 600px) and (max-width: 1399px) {
  .divider {
    display: block;
    margin: 0 16px;
    height: auto;
  }
}

@media (max-width: 599px) {
  .divider {
    display: none;
  }
}

.image-toggle-container {
  display: flex;
  justify-content: center;
  margin-top: 60px;
}

.toggle-image {
  width: 30px;
  height: 30px;
  margin: 0 10px;
  margin-top: 80px;
  margin-bottom: -80px;
  cursor: pointer;
  border: 2px solid transparent;
  transition: transform 0.2s ease;
}

.toggle-image.selected {
  transform: scale(1.75); /* Increase size by 33% */
}

.series-value {
  text-align: center;
  margin-top: -85px;
  font-size: 15px;
  font-weight: bold;
  margin-bottom: -80px;
}
</style>

