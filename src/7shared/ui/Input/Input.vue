<template>
  <input
      v-model="modelValue"
      @blur="handleBlur"
      @keydown="handleKeydown"
      class="edit-input"
      :placeholder="placeholder"
  />
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';

const props = defineProps({
  modelValue: String,
  placeholder: String
});

const emits = defineEmits(['update:modelValue']);

const modelValue = ref(props.modelValue);

// Watch prop changes to update local ref
watch(() => props.modelValue, (newValue) => {
  modelValue.value = newValue;
});

const handleBlur = () => {
  emits('update:modelValue', modelValue.value);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter') {
    emits('update:modelValue', modelValue.value);
    event.preventDefault(); // Prevent default behavior
  }
};
</script>

<style scoped>
.edit-input {
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  padding: 10px;
  font-size: 1rem;
  width: 100%;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.edit-input:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 5px rgba(49, 130, 206, 0.5);
}

.edit-input::placeholder {
  color: #a0aec0;
}
</style>
