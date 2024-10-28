<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center text-medium-emphasis">
      &copy;
      {{ new Date().getFullYear() }}
      Made With
      <VIcon
        icon="tabler-heart-filled"
        color="error"
        size="1.25rem"
        class="mx-1"
      />
      By Kadana
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a>
        Powered by
        <img 
          src="@/assets/images/illustrations/Cardano-ADA-Logo-v2.png"
          alt="Cardano" 
          style="height: 25px; margin-left: 8px; vertical-align: middle;" 
        />
      </a>
    </span>
  </div>
</template>
