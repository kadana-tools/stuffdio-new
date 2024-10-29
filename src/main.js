// main.js

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue'; // Using relative path

// Import plugins and styles with relative paths
import './@core/scss/template/index.scss'; // Relative path for styles
import { registerPlugins } from './@core/utils/plugins'; // Relative path
import './assets/styles/styles.scss'; // Relative path for custom styles

// Create vue app
const app = createApp(App);
const pinia = createPinia();

// Register plugins
registerPlugins(app);

// Register Pinia
app.use(pinia);

// Mount Vue app
app.mount('#app');
