<template>
  <div :class="['task-item', getColorClass(task._id)]">
    <div v-if="editing" class="edit-mode">
      <input type="text" v-model="taskName" @keyup.enter="saveTask" class="task-input" />
    </div>
    <div v-else class="view-mode">
      <p class="task-text">{{ task.task }}</p>
      <div class="icons">
        <img src="../../../../public/assets/editIcon.png" alt="Edit" @click="startEditing" class="icon edit-icon" />
        <img src="../../../../public/assets/deleteIcon.png" alt="Delete" @click="deleteTask" class="icon delete-icon" />
        <img src="../../../../public/assets/copy.png" alt="Clone" @click="cloneTask" class="icon clone-icon" />
      </div>
    </div>
  </div>
</template>
>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  task: {
    type: Object,
    required: true,
  },
});

const emits = defineEmits(['updateTask', 'deleteTask', 'cloneTask']);

const editing = ref(false);
const taskName = ref(props.task.task);

const startEditing = () => {
  editing.value = true;
};

const saveTask = () => {
  if (taskName.value.trim()) {
    emits('updateTask', props.task._id, taskName.value);
    editing.value = false;
  }
};

const deleteTask = () => {
  emits('deleteTask', props.task._id);
};

const cloneTask = () => {
  emits('cloneTask', props.task._id);
};

// Генерация класса цвета на основе id или другого критерия
const getColorClass = (taskId: string) => {
  const colors = ['color-red', 'color-blue', 'color-green', 'color-yellow'];
  const index = parseInt(taskId.slice(-1), 10) % colors.length; // Простой способ генерации индекса
  return colors[index];
};
</script>
<style scoped>
.task-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 12px;
  position: relative;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.task-item:hover {
  background-color: #f0f0f0;
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.2);
}

/* Примеры классов цветов */
.color-red {
  background-color: #ffcccc;
}

.color-blue {
  background-color: #cce5ff;
}

.color-green {
  background-color: #d4edda;
}

.color-yellow {
  background-color: #fff3cd;
}

.edit-mode {
  display: flex;
  align-items: center;
  width: 100%;
}

.task-input {
  flex: 1;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 16px;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.task-input:focus {
  border-color: #007bff;
  box-shadow: 0 0 8px rgba(0, 123, 255, 0.3);
  outline: none;
}

.view-mode {
  display: flex;
  align-items: center;
  flex: 1;
  position: relative;
}

.task-text {
  flex: 1;
  font-size: 16px;
  color: #333;
  transition: color 0.3s ease;
}

.task-text:hover {
  color: #007bff;
}

.icons {
  display: flex;
  gap: 8px;
  position: absolute;
  top: 10px;
  right: 10px;
}

.icon {
  cursor: pointer;
  width: 20px;
  height: 20px;
  transition: transform 0.3s ease, filter 0.3s ease;
}

.icon:hover {
  transform: scale(1.2);
  filter: brightness(1.2);
}

.edit-icon {
  filter: hue-rotate(180deg);
}

.delete-icon {
  filter: hue-rotate(0deg);
}

.clone-icon {
  filter: hue-rotate(90deg);
}

/* Responsive Styles */
@media (max-width: 600px) {
  .task-item {
    padding: 8px;
    margin-bottom: 8px;
  }

  .task-input {
    font-size: 14px;
    padding: 8px;
  }

  .task-text {
    font-size: 14px;
  }

  .icons {
    gap: 6px;
    top: 5px;
    right: 5px;
  }

  .icon {
    width: 18px;
    height: 18px;
  }
}

@media (max-width: 900px) {
  .task-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .icons {
    position: static;
    margin-top: 8px;
  }
}

@media (min-width: 1200px) {
  .task-item {
    padding: 16px;
    margin-bottom: 16px;
  }

  .task-input {
    font-size: 18px;
    padding: 12px;
  }

  .task-text {
    font-size: 18px;
  }

  .icons {
    gap: 6px;
    top: -7px;
    left: -10px;
  }

  .icon {
    width: 17px;
    height: 17px;
  }
}
</style>
