<template>
  <div class="modal">
    <div class="modal-content">
      <h2 class="modal-title">Add Task for {{ person }} on {{ day }}</h2>
      <input
          v-model="taskName"
          class="input"
          placeholder="Enter task name"
      />
      <div class="modal-actions">
        <button class="btn primary" @click="addTask">Add Task</button>
        <button class="btn secondary" @click="cancel">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps({
  person: String,
  day: String,
});

const emits = defineEmits(['confirmAddTask', 'closeDialog']);

const taskName = ref('');

const addTask = () => {
  if (taskName.value.trim()) {
    emits('confirmAddTask', taskName.value);
    taskName.value = '';
  } else {
    alert('Task name cannot be empty!');
  }
};

const cancel = () => {
  emits('closeDialog');
  taskName.value = '';
};
</script>

<style scoped>
.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #f9fafb;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 350px;
  max-width: 100%;
  z-index: 1000;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.modal-title {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #2d3748;
}

.input {
  width: 100%;
  padding: 10px 15px;
  margin-bottom: 20px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: #3182ce;
}

.modal-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn {
  flex: 1;
  padding: 10px;
  font-size: 1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn.primary {
  background-color: #3182ce;
  color: white;
}

.btn.primary:hover {
  background-color: #2b6cb0;
}

.btn.secondary {
  background-color: #e2e8f0;
  color: #2d3748;
}

.btn.secondary:hover {
  background-color: #cbd5e0;
}
</style>
