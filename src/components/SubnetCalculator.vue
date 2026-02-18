<template>
  <div class="subnet-calculator">
    <div class="input-section">
      <div class="input-group">
        <label for="ip-address">IP адрес:</label>
        <input
          id="ip-address"
          v-model="ipAddress"
          type="text"
          placeholder="192.168.1.150"
          :class="{ 'error': !isIpValid(ipAddress) && ipAddress.length > 0 }"
          @input="validateIp"
          @keyup.enter="calculate"
        />
        <div v-if="!isIpValid(ipAddress) && ipAddress.length > 0" class="error-message">
          Некорректный IP адрес
        </div>
      </div>
      
      <div class="input-group">
        <label for="netmask">Сетевая маска:</label>
        <select id="netmask" v-model="selectedMask">
          <option v-for="mask in NETMASK_OPTIONS" :key="mask.cidr" :value="mask.mask">
            {{ mask.cidr }} / {{ mask.mask }}
          </option>
        </select>
      </div>
    </div>
    
    <button 
      @click="calculate" 
      :disabled="!isValidForCalculation"
      class="calculate-btn"
    >
      Рассчитать
    </button>
    
    <div v-if="showResults" class="results-section">
      <h2>Результаты расчета</h2>
      
      <div class="results-grid">
        <div class="result-card">
          <div class="result-label">IP адрес:</div>
          <div class="result-value">{{ results.ip }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Сетевая маска:</div>
          <div class="result-value">{{ results.mask }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Адрес сети:</div>
          <div class="result-value">{{ results.networkAddress }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Количество адресов:</div>
          <div class="result-value">{{ results.addressesCount }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Диапазон адресов:</div>
          <div class="result-value">{{ results.firstUsable }} - {{ results.lastUsable }}</div>
        </div>
        
        <div class="result-card">
          <div class="result-label">Широковещательный адрес:</div>
          <div class="result-value">{{ results.broadcastAddress }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { NETMASK_OPTIONS } from '../utils/constants';
import { isIpValid } from '../utils/ipValidation';
import {
  getNetworkAddress,
  getAddressesCount,
  getBroadcastAddress,
  getFirstUsableAddress,
  getLastUsableAddress
} from '../utils/networkCalculations';

const ipAddress = ref('192.168.1.150');
const selectedMask = ref('255.255.255.0');
const showResults = ref(false);

interface CalculationResults {
  ip: string;
  mask: string;
  networkAddress: string;
  addressesCount: number;
  firstUsable: string;
  lastUsable: string;
  broadcastAddress: string;
}

const results = ref<CalculationResults>({
  ip: '',
  mask: '',
  networkAddress: '',
  addressesCount: 0,
  firstUsable: '',
  lastUsable: '',
  broadcastAddress: ''
});

const isValidForCalculation = computed(() => {
  return isIpValid(ipAddress.value);
});

const validateIp = () => {
};

const calculate = () => {
  if (!isValidForCalculation.value) {
    return;
  }

  const networkAddress = getNetworkAddress(ipAddress.value, selectedMask.value);
  const addressesCount = getAddressesCount(selectedMask.value);
  const broadcastAddress = getBroadcastAddress(networkAddress, selectedMask.value);
  const firstUsable = getFirstUsableAddress(networkAddress, selectedMask.value);
  const lastUsable = getLastUsableAddress(broadcastAddress, selectedMask.value);

  results.value = {
    ip: ipAddress.value,
    mask: selectedMask.value,
    networkAddress,
    addressesCount,
    firstUsable,
    lastUsable,
    broadcastAddress
  };

  showResults.value = true;
};
</script>

<style scoped>
.subnet-calculator {
  background-color: var(--color-card);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  box-shadow: var(--shadow-md);
}

.input-section {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.input-group {
  flex: 1;
  min-width: 250px;
}

label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 500;
  color: var(--color-text);
}

input, select {
  width: 100%;
  padding: var(--spacing-md);
  font-size: var(--font-size-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: border-color 0.3s, box-shadow 0.3s;
  box-sizing: border-box;
  font-family: var(--font-family);
}

input:focus, select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

input.error {
  border-color: var(--color-error);
  background-color: #fff5f5;
}

.error-message {
  color: var(--color-error);
  font-size: var(--font-size-sm);
  margin-top: var(--spacing-xs);
}

.calculate-btn {
  display: block;
  width: 100%;
  padding: var(--spacing-md);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-lg);
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s;
  margin-bottom: var(--spacing-xl);
  font-family: var(--font-family);
}

.calculate-btn:hover:not(:disabled) {
  background-color: var(--color-primary-hover);
  transform: translateY(-1px);
}

.calculate-btn:active:not(:disabled) {
  transform: translateY(0);
}

.calculate-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.7;
}

.results-section {
  animation: fadeIn 0.5s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.results-section h2 {
  color: var(--color-text);
  margin-top: 0;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
}

.result-card {
  background-color: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border-left: 4px solid var(--color-primary);
}

.result-label {
  font-weight: 500;
  color: var(--color-text-light);
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-xs);
}

.result-value {
  font-weight: 600;
  color: var(--color-text);
  font-family: 'Courier New', Courier, monospace;
  word-break: break-all;
}

@media (max-width: 768px) {
  .input-section {
    flex-direction: column;
  }
  
  .input-group {
    min-width: 100%;
  }
  
  .results-grid {
    grid-template-columns: 1fr;
  }
}
</style>