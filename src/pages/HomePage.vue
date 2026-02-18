<template>
  <div class="home-page">
    <h1>Калькулятор подсетей</h1>
    <p class="description">Введите IP-адрес и выберите маску сети для расчёта параметров подсети.</p>
    <SubnetCalculator />
  </div>
</template>

<script setup lang="ts">
import SubnetCalculator from '../components/SubnetCalculator.vue';
</script>

<style scoped>
.home-page {
  max-width: 900px;
  margin: 0 auto;
  padding: var(--spacing-xl);
}

h1 {
  color: var(--color-text);
  font-size: var(--font-size-xl);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.description {
  color: var(--color-text-light);
  text-align: center;
  margin-bottom: var(--spacing-xl);
  font-size: var(--font-size-md);
}
</style>