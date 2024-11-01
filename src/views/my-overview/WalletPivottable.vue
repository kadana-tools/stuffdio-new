<template>
 <div class="table-container" v-if="!isSmallScreen">
  <VCard class="my-pivottable">

    <VCardItem title="Biome Footprint">
      <!-- <div class="table-header text-h6"></div>Biome Footprint -->
    </VCardItem>

     <VCardText>
      <!-- Add a scrollable container around the table -->
        <div class="table-container">
          <table class="table"> 
            <thead>
              <tr class="main-headers-row">
                <th v-for="(col, index) in mergedMainHeaders" :key="'main-' + index" :colspan="col.colspan" :style="getHeaderStyle(col.header)">
                  <span v-if="index === mergedMainHeaders.length - 1">{{ col.header }}</span>
                </th>
              </tr>

              <tr class="sub-headers-row">
                <th v-for="(col, index) in subHeaders" :key="'sub-' + index" :class="getCellClass(index, true)">
                  {{ col }}
                </th>
              </tr>
            </thead>
              <tbody>
                <tr v-for="(row, rowIndex) in bodyRows" :key="rowIndex" :class="getRowClass(rowIndex)">
                <td v-for="(cell, cellIndex) in row" :key="cellIndex" :class="getCellClass(cellIndex, false, row, rowIndex)" :style="getCellStyle(rowIndex, cellIndex)">
                  <span v-if="cellIndex !== 0">{{ cell }}</span>
                </td>
              </tr>
              <tr>
                <td v-for="(cell, cellIndex) in mergedLastRow" :key="'last-' + cellIndex" :colspan="cell.colspan">
                  <span v-if="cellIndex === 0">Total</span>
                  <span v-else>{{ cell.value }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </VCardText>
      
  </VCard>
</div> 

  <div class="table-container" v-else>
    <table class="table">
      <thead>
        <tr class="main-headers-row">
          <th v-for="(col, index) in transposedHeaders" :key="'trans-main-' + index" :style="getHeaderStyle(col)">
            <span>{{ col }}</span>
          </th>
        </tr>
        <tr class="sub-headers-row">
          <th v-for="(col, index) in transposedSubHeaders" :key="'trans-sub-' + index">
            {{ col }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in transposedBodyRows" :key="'trans-body-' + rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="'trans-cell-' + cellIndex" :class="getCellClass(cellIndex, false, row, rowIndex)" :style="getCellStyle(rowIndex, cellIndex)">
            <span>{{ cell }}</span>
          </td>
        </tr>
        <tr>
          <td v-for="(cell, cellIndex) in transposedLastRow" :key="'trans-last-' + cellIndex">
            <span>{{ cell }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import img_baldosbog from '@/assets/images/illustrations/baldos_bog.png';
import img_chillarcticadrifts from '@/assets/images/illustrations/chillarctica_drifts.png';
import img_chillvinejungle from '@/assets/images/illustrations/chillvine_jungle.png';
import img_derpape from '@/assets/images/illustrations/derpape.png';
import img_derpbird from '@/assets/images/illustrations/derpbird.png';
import img_derpling from '@/assets/images/illustrations/derpling.png';
import img_derpshirevalley from '@/assets/images/illustrations/derpshire_valley.png';
import img_lavalodepeaks from '@/assets/images/illustrations/lavalode_peaks.png';
import img_pinnacleperch from '@/assets/images/illustrations/pinnacle_perch.png';
import img_pred from '@/assets/images/illustrations/pred.png';
import img_sandcryptbandlands from '@/assets/images/illustrations/sandcrypt_bandlands.png';

export default {
  data() {
    return {
      isSmallScreen: window.innerWidth < 600,
    };
  },
  name: 'CompWalletPivottable',
  props: {
    Pivottable_Data: {
      type: [Object, Array, String],
      required: false,
      default() {
        const defaultData = {
          columns: [
            ['Faction', 'Derpshire Valley', 'Derpshire Valley', 'Derpshire Valley', 'Chillarctica Drifts', 'Chillarctica Drifts', 'Chillarctica Drifts', 'Sandcrypt Bandlands', 'Sandcrypt Bandlands', 'Sandcrypt Bandlands', 'Chillvine Jungle', 'Chillvine Jungle', 'Chillvine Jungle', 'Pinnacle Perch', 'Pinnacle Perch', 'Pinnacle Perch', 'Baldos Bog', 'Baldos Bog', 'Baldos Bog', 'Lavalode Peaks', 'Lavalode Peaks', 'Lavalode Peaks', '', 'Total'],
            ['', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', '', '']
          ],
          data: [
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Preds', , , , , , , , , , , , , , , , , , , , , , '', ],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Derp Birds', , , , , , , , , , , , , , , , , , , , , , '', ],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Derplings', , , , , , , , , , , , , , , , , , , , , , '', ],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Derp Apes', , , , , , , , , , , , , , , , , , , , , , '', ],
            ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
            ['Total', , , , , , , , , , , , , , , , , , , , , , '', 0]
          ]
        };
        console.log("Using default Pivottable_Data:", defaultData);
        return defaultData;
      },
      validator(value) {
        return typeof value === 'object' && Array.isArray(value.columns) && Array.isArray(value.data);
      },
    },
  },
  computed: {
    hasValidData() {
      if (typeof this.Pivottable_Data === 'string') {
        return false;
      }
      return this.Pivottable_Data && Array.isArray(this.Pivottable_Data.columns) && Array.isArray(this.Pivottable_Data.data);
    },
    mainHeaders() {
      return this.hasValidData ? this.Pivottable_Data.columns[0] : this.defaultData.columns[0];
    },
    subHeaders() {
      return this.hasValidData ? this.Pivottable_Data.columns[1] : this.defaultData.columns[1];
    },
    bodyRows() {
      return this.hasValidData ? this.Pivottable_Data.data.slice(0, -1).map(row =>
        row.map(cell => (cell === 0 ? '' : cell))
      ) : this.defaultData.data.slice(0, -1);
    },
    lastRow() {
      return this.hasValidData ? this.Pivottable_Data.data[this.Pivottable_Data.data.length - 1] : this.defaultData.data[this.defaultData.data.length - 1];
    },
    mergedMainHeaders() {
      const headers = [];
      const mainHeaders = this.mainHeaders;
      let currentHeader = mainHeaders[0];
      let colspan = 1;

      for (let i = 1; i < mainHeaders.length; i++) {
        if (mainHeaders[i] === currentHeader) {
          colspan++;
        } else {
          headers.push({ header: currentHeader, colspan });
          currentHeader = mainHeaders[i];
          colspan = 1;
        }
      }
      headers.push({ header: currentHeader, colspan });
      return headers;
    },
    mergedLastRow() {
      const mergedRow = [];
      const mainHeaders = this.mainHeaders;
      let currentSum = parseFloat(this.lastRow[0]);
      let colspan = 1;

      for (let i = 1; i < this.lastRow.length; i++) {
        if (mainHeaders[i] === mainHeaders[i - 1]) {
          currentSum += parseFloat(this.lastRow[i]);
          colspan++;
        } else {
          mergedRow.push({ value: isNaN(currentSum) ? "" : currentSum, colspan });
          currentSum = parseFloat(this.lastRow[i]);
          colspan = 1;
        }
      }
      mergedRow.push({ value: isNaN(currentSum) ? "" : currentSum, colspan });
      return mergedRow;
    },
    defaultData() {
      return {
        columns: [
          ['Faction', 'Derpshire Valley', 'Derpshire Valley', 'Derpshire Valley', 'Chillarctica Drifts', 'Chillarctica Drifts', 'Chillarctica Drifts', 'Sandcrypt Bandlands', 'Sandcrypt Bandlands', 'Sandcrypt Bandlands', 'Chillvine Jungle', 'Chillvine Jungle', 'Chillvine Jungle', 'Pinnacle Perch', 'Pinnacle Perch', 'Pinnacle Perch', 'Baldos Bog', 'Baldos Bog', 'Baldos Bog', 'Lavalode Peaks', 'Lavalode Peaks', 'Lavalode Peaks', '', 'Total'],
          ['', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', 'S', 'M', 'L', '', '']
        ],
        data: [
          ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          ['Preds', , , , , , , , , , , , , , , , , , , , , , '', ],
          ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          ['Derp Birds', , , , , , , , , , , , , , , , , , , , , , '', ],
          ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          ['Derplings', , , , , , , , , , , , , , , , , , , , , , '', ],
          ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          ['Derp Apes', , , , , , , , , , , , , , , , , , , , , , '', ],
          ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
          ['Total', , , , , , , , , , , , , , , , , , , , , , '', 0]
        ]
      };
    },
    transposedColumns() {
      if (!this.hasValidData) return [];
      const rows = [this.mainHeaders, this.subHeaders];
      for (let i = 0; i < this.bodyRows.length; i++) {
        rows.push(this.bodyRows[i]);
      }
      rows.push(this.lastRow);
      return rows[0].map((_, colIndex) => rows.map(row => row[colIndex] || ""));
    },
    transposedHeaders() {
      return this.transposedColumns[0];
    },
    transposedSubHeaders() {
      return this.transposedColumns[1];
    },
    transposedBodyRows() {
      return this.transposedColumns.slice(2, -1);
    },
    transposedLastRow() {
      return this.transposedColumns[this.transposedColumns.length - 1];
    },
  },
  methods: {
    getHeaderStyle(header) {
      const backgroundImages = {
        'Derpshire Valley': `url(${img_derpshirevalley})`,
        'Chillarctica Drifts': `url(${img_chillarcticadrifts})`,
        'Sandcrypt Bandlands': `url(${img_sandcryptbandlands})`,
        'Chillvine Jungle': `url(${img_chillvinejungle})`,
        'Pinnacle Perch': `url(${img_pinnacleperch})`,
        'Baldos Bog': `url(${img_baldosbog})`,
        'Lavalode Peaks': `url(${img_lavalodepeaks})`,
      };
      return {
        backgroundImage: backgroundImages[header] || 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      };
    },
    getCellClass(cellIndex, isHeader, row, rowIndex) {
      if (isHeader || ![0, 2, 4, 6, 8].includes(rowIndex)) {
        const header = this.mainHeaders[cellIndex];
        const headerColors = {
          'Derpshire Valley': 'header1-color',
          'Chillarctica Drifts': 'header2-color',
          'Sandcrypt Bandlands': 'header3-color',
          'Chillvine Jungle': 'header4-color',
          'Pinnacle Perch': 'header5-color',
          'Baldos Bog': 'header6-color',
          'Lavalode Peaks': 'header7-color',
        };
        return headerColors[header] || '';
      }
      return '';
    },
    getRowClass(rowIndex) {
      return [0, 2, 4, 6, 8].includes(rowIndex) ? 'short-row' : '';
    },
    getCellStyle(rowIndex, cellIndex) {
      const backgroundImages = {
        1: `url(${img_pred})`,
        3: `url(${img_derpbird})`,
        5: `url(${img_derpling})`,
        7: `url(${img_derpape})`,
      };
      if (cellIndex === 0 && backgroundImages[rowIndex]) {
        return {
          backgroundImage: backgroundImages[rowIndex],
          backgroundSize: '50%',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          width: '300px',
          padding: '10px',
        };
      }
      return {
        width: '150px',
        padding: '8px',
      };
    },
    checkScreenWidth() {
      this.isSmallScreen = window.innerWidth < 600;
    },
  },
  mounted() {
    window.addEventListener("resize", this.checkScreenWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.checkScreenWidth);
  },
};
</script>



<style scoped>
.table-container {
  overflow-x: auto; /* Allow horizontal scrolling */
  width: 100%; /* Take full width of the parent */
}


.table {
  border-collapse: collapse;
}

.table th,
.table td {
  padding: 8px;  /* the space around the text, so this can also influence the row height! */   
  text-align: center;
}

.table td {
  height: 40px;
  width: 150px;
  font-weight: bold;
}

.table-header {
  margin-bottom: 10px;
  text-align: center;
}

.main-headers-row th {
  position: relative;
  width: 150px; /* Ensure consistent width */
}

.main-headers-row th::before {
  content: '';
  display: block;
  padding-top: 100%; /* This makes the height equal to the width */
}

.main-headers-row span {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  text-align: center;
}

.sub-headers-row th {
  height: 40px; /* Increase the height for the first row */
}

.short-row td {
  height: 4px; /* Set height to 10px for specific rows */
}

.header1-color {
  background-color: rgba(49,69,25,255);
  color: white;
}

.header2-color {
  background-color: rgba(140,149,140,255);
  color: white;
}

.header3-color {
  background-color: rgba(152,71,52,255);
  color: white;
}

.header4-color {
  background-color: rgba(83,78,19,255);
  color: white;
}

.header5-color {
  background-color: rgba(76,59,76,255);
  color: white;
}

.header6-color {
  background-color: rgba(31,74,62,255);
  color: white;
}

.header7-color {
  background-color: rgba(74,34,36,255);
  color: white;
}
</style>
