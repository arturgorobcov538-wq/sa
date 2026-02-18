<template>
  <div id="app">
    <HomePage />
  </div>
</template>

<script setup lang="ts">
import HomePage from './pages/HomePage.vue';
</script>

<style>
@import './styles/variables.css';

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: var(--font-family);
  background-color: var(--color-background);
  color: var(--color-text);
  line-height: 1.6;
}

#app {
  min-height: 100vh;
  padding: var(--spacing-md);
}
</style>