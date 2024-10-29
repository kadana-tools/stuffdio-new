<template>
  <div class="loading-container">
    <VProgressCircular indeterminate color="primary" size="80" />
    <img class="circular-image" src="@/assets/images/illustrations/Play-button-as-a-D-v2.png" alt="Cardano Logo">
  </div>
</template>

<style scoped>
.loading-container {
  position: relative;
  width: 80px; /* Ensure this matches the size of the VProgressCircular */
  height: 80px; /* Same as the size of the progress circle */
}

.circular-image {
  position: absolute;
  top: 50%; /* Adjusted this slightly to move the image upwards */
  left: 50%;
  width: 75px; /* Adjust this to match your needs */
  height: 75px; /* Adjust this to match your needs */
  transform: translate(-50%, -50%);
  border-radius: 50%;
}
</style>
