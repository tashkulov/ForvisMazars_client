<template>
  <div class="task-icons">
    <img :src="editIcon" alt="Edit" class="icon" @click="onEdit" />
    <img :src="deleteIcon" alt="Delete" class="icon" @click="onDelete" />
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import editIcon from '../../../../public/assets/editIcon.png';
import deleteIcon from '../../../../public/assets/deleteIcon.png';

const props = defineProps<{
  taskId: string;
}>();

const emit = defineEmits<{
  (event: 'edit', taskId: string): void;
  (event: 'delete', taskId: string): void;
}>();

const onEdit = () => {
  emit('edit', props.taskId);
};

const onDelete = () => {
  emit('delete', props.taskId);
};
</script>

<style scoped>
.task-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.task-icons .icon {
  cursor: pointer;
  width: 24px;
  height: 24px;
}

.task-container:hover .task-icons {
  opacity: 1;
}
</style>
