<template>
  <div class="user-container">
    <div v-if="isEditing" class="edit-input-container">
      <input
          v-model="editUserName"
          @blur="updateUser"
          @keydown.enter="updateUser"
          class="edit-input"
          placeholder="Edit user name..."
      />
    </div>

    <div v-else class="user-block" @dblclick="startEditing">
      {{ user.name }}
    </div>

    <div v-if="!isEditing" class="user-icons">
      <img :src="editIcon" alt="Edit" class="icon" @click="startEditing" />
      <img :src="deleteIcon" alt="Delete" class="icon" @click="deleteUser" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, defineProps, defineEmits } from 'vue';
import editIcon from '../../../../public/assets/editIcon.png';
import deleteIcon from '../../../../public/assets/deleteIcon.png';

const props = defineProps<{
  user: { _id: string, name: string };
  editingUserId: string | null;
}>();

const emit = defineEmits<{
  (event: 'updateUser', payload: { id: string, name: string }): void;
  (event: 'deleteUser', payload: string): void;
}>();

const editUserName = ref(props.user.name);
const isEditing = ref(props.editingUserId === props.user._id);

const startEditing = () => {
  isEditing.value = true;
};

const updateUser = () => {
  if (!editUserName.value.trim()) return;
  emit('updateUser', { id: props.user._id, name: editUserName.value });
  isEditing.value = false;
};

const deleteUser = () => {
  emit('deleteUser', props.user._id);
};

watch(() => props.editingUserId, (newId) => {
  isEditing.value = newId === props.user._id;
});
</script>

<style scoped>
.user-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 200px; /* Ширина для лучшего визуального восприятия */
  margin: 10px; /* Отступ для лучшего визуального восприятия */
}

.edit-input-container {
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

.user-block {
  background-color: #2b6cb0;
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
  cursor: pointer; /* Добавьте курсор указателя для интерактивности */
}

.user-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.user-container:hover .user-icons {
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
