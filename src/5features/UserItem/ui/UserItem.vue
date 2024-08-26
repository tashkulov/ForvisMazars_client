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
      <strong>{{ user.name }}</strong>
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
  user: { _id: string; name: string };
  editingUserId: string | null;
}>();

const emit = defineEmits<{
  (event: 'updateUser', payload: { id: string; name: string }): void;
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
  width: 100%;
  max-width: 300px;
  margin: 10px;
}

.edit-input-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.edit-input {
  border: 2px solid #cbd5e1;
  border-radius: 8px;
  padding: 12px;
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
  padding: 12px;
  font-size: 26px;

  margin: 5px 0;
  text-align: center;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex: 1;
  transition: background-color 0.3s ease, transform 0.3s ease;
  cursor: pointer;
}

.user-block:hover {
  background-color: #2c5282;
  transform: translateY(-3px);
}

.user-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 12px;
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
  transition: transform 0.3s ease, filter 0.3s ease;
}

.icon:hover {
  transform: scale(1.2);
}

.icon.edit-icon {
  filter: brightness(0) invert(0.4); /* Blue color for edit icon */
}

.icon.delete-icon {
  filter: brightness(0) invert(0.7); /* Red color for delete icon */
}

/* Responsive Styles */
@media (max-width: 600px) {
  .user-container {
    width: 100%;
    max-width: none;
    margin: 5px;
  }

  .edit-input {
    font-size: 0.9rem;
  }

  .user-block {
    padding: 10px;
    margin: 5px 0;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .user-icons {
    top: 5px;
    right: 5px;
    gap: 8px;
  }
}

@media (min-width: 1200px) {
  .user-container {
    width: 300px;
  }

  .user-block {
    padding: 15px;
    margin: 10px 0;
  }
}
</style>
