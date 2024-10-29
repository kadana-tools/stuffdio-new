<script setup>
import {
  HorizontalNavGroup,
  HorizontalNavLink,
} from '@layouts/components';
import { useRoute } from 'vue-router';
;

const route = useRoute();

const props = defineProps({
  navItems: {
    type: null,
    required: true,
  },
})


console.log('Nav Items in HorizontalNav:', props.navItems);
console.log('Current route in production:', route.fullPath);


const resolveNavItemComponent = item => {
  console.log('Processing Nav Item:', item);
  if ('children' in item)
    return HorizontalNavGroup
  
  return HorizontalNavLink
}
</script>

<template>
  <ul class="nav-items">
    <Component
      :is="resolveNavItemComponent(item)"
      v-for="(item, index) in navItems"
      :key="index"
      :item="item"
    />
  </ul>
</template>

<style lang="scss">
.layout-wrapper.layout-nav-type-horizontal {
  .nav-items {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>
