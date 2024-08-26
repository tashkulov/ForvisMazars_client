<template>
  <div class="schedule-container">
    <h1 class="title">Weekly Schedule</h1>
    <div class="schedule-grid">
      <div class="schedule-header-cell">
        <div v-if="!showAddUserInput">
          <button class="add-user-button" @click="showAddUserInput = true">+ Add User</button>
        </div>
        <div v-if="showAddUserInput" class="add-user-input-container">
          <input v-model="newUserName" class="edit-input" placeholder="Enter user name" />
          <button @click="addUserHandler">Add</button>
          <button @click="showAddUserInput = false">Cancel</button>
        </div>
      </div>
      <div v-for="day in daysOfWeek" :key="day" class="schedule-header-cell">
        <h3 class="day-title">{{ day }}</h3>
      </div>

      <div v-for="person in dynamicPeople" :key="person._id" class="person-row">
        <UserItem
            :user="person"
            :editingUserId="editingUserId"
            @updateUser="updateUserHandler"
            @deleteUser="deleteUserHandler"
        />
        <div v-for="day in daysOfWeek" :key="day" class="schedule-cell"
             @mouseenter="onCellHover(person._id, person.name, day)"
             @mouseleave="onCellHover(null,null)">
          <TaskItem
              v-for="task in getTasksForDay(person._id, day)"
              :key="task._id"
              :task="task"
              @updateTask="updateTaskHandler"
              @delete-task="deleteTaskHandler"
          />

          <div v-if="hoveredCell && hoveredCell.person === person.name && hoveredCell.day === day"
               class="task-icons">
            <img :src="addIcon" alt="Add" class="icon add-icon" @click="showAddInput(person.name, day)"/>
          </div>

          <div v-if="taskToEdit && taskToEdit.person === person.name && taskToEdit.day === day"
               class="add-task-input-container">
            <input type="text" v-model="newTaskName" @keyup.enter="handleAddTask" placeholder="Add" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import addIcon from '../../../../public/assets/addIcon.png';
import TaskItem from "../../../5features/TaskItem/ui/TaskItem.vue";
import UserItem from '../../../5features/UserItem/ui/UserItem.vue';
import {
  tasks,
  dynamicPeople,
  hoveredCell,
  taskToEdit,
  getTasksForDay,
  showAddInput,
  confirmAddTask,
  updateTask,
  deleteTask,
  fetchTasks,
  fetchUsers,
  addUser as apiAddUser,
  updateUser as apiUpdateUser,
  deleteUser as apiDeleteUser,
  onCellHover,
} from '../api/useTasks.ts';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const newTaskName = ref('');
const newUserName = ref('');
const showAddUserInput = ref(false);
const editingUserId = ref<string | null>(null);

onMounted(() => {
  fetchTasks();
  fetchUsers();
  console.log('Tasks after fetch:', tasks.value); // Логируем задачи
});

const handleAddTask = () => {
  if (taskToEdit.value && newTaskName.value.trim()) {
    confirmAddTask(newTaskName.value).then(() => {
      newTaskName.value = '';
      taskToEdit.value = null;
    }).catch(error => {
      console.error('Error adding task:', error);
    });
  }
};

const addUserHandler = () => {
  if (newUserName.value.trim()) {
    apiAddUser(newUserName.value).then(() => {
      newUserName.value = '';
      showAddUserInput.value = false;
    }).catch(error => {
      console.error('Error adding user:', error);
    });
  }
};

const updateUserHandler = async (userId: string, newName: string) => {
  try {
    await apiUpdateUser(userId, newName);
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

const deleteUserHandler = async (userId: string) => {
  try {
    await apiDeleteUser(userId);
  } catch (error) {
    console.error('Error deleting user:', error);
  }
};

const updateTaskHandler = async (taskId: string, updatedTaskName: string) => {
  try {
    await updateTask({id: taskId, updatedTaskName}); // Обновление задачи через API
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

const deleteTaskHandler = async (taskId: string) => {
  try {
    await deleteTask(taskId);
    await fetchTasks();
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};
</script>


<style scoped>
.schedule-container {
  padding: 30px;
  background: linear-gradient(135deg, #f7f9fc, #e2e8f0);
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 40px;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 20px;
}

.schedule-header-cell {
  padding: 15px;
  font-weight: 700;
  text-align: center;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.schedule-header-cell:hover {
  background-color: #edf2f7;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.day-title {
  margin: 0;
  font-size: 1.2rem;
  color: #4a5568;
}

.person-row {
  display: contents;
}

.schedule-cell {
  padding: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.schedule-cell:hover {
  background-color: #f1f5f9;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.add-user-button {
  background: linear-gradient(135deg, #3182ce, #63b3ed);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 12px 24px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.add-user-button:hover {
  background: linear-gradient(135deg, #2b6cb0, #4a90e2);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
}

.add-user-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.5);
}

.add-user-button .icon {
  margin-right: 10px;
  width: 24px;
  height: 24px;
}

.task-icons {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  gap: 12px;
  opacity: 0;
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.schedule-cell:hover .task-icons {
  opacity: 1;
  transform: translateY(0);
}

.icon {
  cursor: pointer;
  width: 26px;
  height: 26px;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.2);
}

.add-icon {
  filter: hue-rotate(90deg);
}

.add-user-input-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 10px;
}

.add-user-input-container input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  font-size: 1.1rem;
  width: 250px;
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.add-user-input-container input:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 8px rgba(49, 130, 206, 0.5);
}

.add-user-input-container button {
  padding: 12px 24px;
  font-size: 1.1rem;
  cursor: pointer;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #3182ce, #63b3ed);
  color: white;
  transition: background 0.3s ease;
}

.add-user-input-container button:hover {
  background: linear-gradient(135deg, #2b6cb0, #4a90e2);
}

.add-task-input-container {
  margin-top: 12px;
}

.add-task-input-container input {
  border: 2px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px;
  font-size: 1.1rem;
  width: calc(100% - 24px);
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.add-task-input-container input:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 8px rgba(49, 130, 206, 0.5);
}

/* Media Queries */
@media (max-width: 1200px) {
  .schedule-grid {
    grid-template-columns: repeat(7, 1fr);
  }
}

@media (max-width: 992px) {
  .schedule-grid {
    grid-template-columns: repeat(6, 1fr);
  }

  .title {
    font-size: 2rem;
  }

  .add-user-button {
    font-size: 0.9rem;
    padding: 10px 18px;
  }

  .schedule-cell {
    padding: 15px;
  }
}

@media (max-width: 768px) {
  .schedule-grid {
    grid-template-columns: repeat(5, 1fr);
  }

  .add-user-input-container input,
  .add-task-input-container input {
    width: calc(100% - 16px);
  }
}

@media (max-width: 576px) {
  .schedule-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .add-user-input-container input,
  .add-task-input-container input {
    width: calc(100% - 12px);
  }
}
</style>
