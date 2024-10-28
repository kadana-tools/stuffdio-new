<template>
  <div v-if="visible" class="notification">
    <p>{{ message }}</p>
    <button @click="hide">Close</button>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const visible = ref(false);
const message = ref('');

// Show the notification with a message
const show = (msg) => {
  message.value = msg;
  visible.value = true;
};

// Hide the notification
const hide = () => {
  visible.value = false;
};

// Expose the `show` function to be used from other components or store
defineExpose({ show });
</script>

<style scoped>
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #ff5555;
  color: #fff;
  padding: 15px;
  border-radius: 8px;
  z-index: 1000;
}
</style>
