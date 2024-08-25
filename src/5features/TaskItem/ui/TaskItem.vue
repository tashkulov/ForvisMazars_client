<template>
  <div class="task-container">
    <div v-if="isEditing" class="edit-input-container">
      <input
          v-model="editTaskName"
          @blur="updateTask"
          @keydown.enter="updateTask"
          class="edit-input"
          placeholder="Edit task..."
      />
    </div>
    <div v-else class="task-block" @dblclick="startEditing">
      {{ task.task }}
    </div>

    <div v-if="!isEditing" class="task-icons">
      <img :src="editIcon" alt="Edit" class="icon" @click="startEditing" />
      <img :src="deleteIcon" alt="Delete" class="icon" @click="deleteTask" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import editIcon from '../../../../public/assets/editIcon.png';
import deleteIcon from '../../../../public/assets/deleteIcon.png';

const props = defineProps({
  task: Object,
  editingTaskId: String
});

const emit = defineEmits(['updateTask', 'deleteTask']);

const editTaskName = ref(props.task.task);
const isEditing = ref(props.editingTaskId === props.task._id);

const startEditing = () => {
  isEditing.value = true;
};

const updateTask = () => {
  if (!editTaskName.value.trim()) return;
  emit('updateTask', { id: props.task._id, name: editTaskName.value });
  isEditing.value = false;
};

const deleteTask = () => {
  emit('deleteTask', props.task._id);
};
</script>

<style scoped>
.task-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.edit-input-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
}

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

.task-block {
  background-color: #3182ce;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  padding: 10px;
  margin: 5px 0;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  flex: 1;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.task-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.task-container:hover .task-icons {
  opacity: 1;
  transform: translateY(0);
}

.icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.1);
}
</style>