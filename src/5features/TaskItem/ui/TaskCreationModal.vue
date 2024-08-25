
<template>
  <div class="modal">
    <h3>Добавить задачу</h3>
    <input v-model="taskName" placeholder="Task name" />
    <button @click="confirm">Подтвердить</button>
  </div>
</template>

<script setup lang="ts">
import { ref, defineEmits } from 'vue';

const taskName = ref('');
const emit = defineEmits(['confirm']);

const confirm = () => {
  emit('confirm', { name: taskName.value });
};
</script>

<style scoped>
.modal {
  /* стили модального окна */
}
</style>
