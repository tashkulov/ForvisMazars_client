<template>
  <div
      :style="{
      transform: `translate(${position.x}px, ${position.y}px)`,
      width: size.width + 'px',
      height: size.height + 'px'
    }"
      class="draggable task-block"
  >
    {{ task.name }}
    <!-- Add icons for editing and deleting tasks -->
    <div class="task-icons">
      <img :src="editIcon" alt="Edit" class="icon" @click="startEditing" />
      <img :src="deleteIcon" alt="Delete" class="icon" @click="deleteTask" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, defineProps, defineEmits } from 'vue';
import interact from 'interactjs';
import editIcon from '../../../../public/assets/editIcon.png';
import deleteIcon from '../../../../public/assets/deleteIcon.png';

// Define props and emits
const props = defineProps({
  task: Object as { _id: string; name: string; position?: { x: number; y: number }; size?: { width: number; height: number } },
  editingTaskId: String
});

const emit = defineEmits(['updateTaskPosition', 'updateTaskSize', 'editTask', 'deleteTask']);

const position = ref<{ x: number; y: number }>({ x: 0, y: 0 });
const size = ref<{ width: number; height: number }>({ width: 100, height: 50 });

// Watch for changes in the task prop
watch(() => props.task, (newTask) => {
  position.value = newTask.position || { x: 0, y: 0 };
  size.value = newTask.size || { width: 100, height: 50 };
}, { immediate: true });

// Initialize interact.js
onMounted(() => {
  interact('.draggable')
      .draggable({
        listeners: {
          move(event) {
            position.value.x += event.dx;
            position.value.y += event.dy;
            emit('updateTaskPosition', { id: props.task._id, position: position.value });
          }
        }
      })
      .resizable({
        edges: { left: true, right: true, bottom: true, top: true },
        listeners: {
          move(event) {
            size.value.width = event.rect.width;
            size.value.height = event.rect.height;
            emit('updateTaskSize', { id: props.task._id, size: size.value });
          }
        }
      });
});

// Methods to handle task editing and deletion
const startEditing = () => {
  emit('editTask', props.task._id);
};

const deleteTask = () => {
  emit('deleteTask', props.task._id);
};
</script>

<style scoped>
.task-block {
  background-color: #3182ce;
  color: white;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: move;
}

.task-icons {
  position: absolute;
  top: 5px;
  right: 5px;
  display: flex;
  gap: 5px;
}

.icon {
  width: 20px;
  height: 20px;
  cursor: pointer;
}
</style>
