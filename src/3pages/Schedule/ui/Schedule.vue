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

      <div v-for="(person, personIndex) in dynamicPeople" :key="personIndex" class="person-row">
        <div class="person-cell"><strong>{{ person }}</strong></div>
        <div v-for="day in daysOfWeek" :key="day" class="schedule-cell"
             @mouseover="hoveredCell = { person, day }"
             @mouseleave="hoveredCell = null">
          <TaskItem
              v-for="task in getTasksForDay(person, day)"
              :key="task._id"
              :task="task"
              @editingTaskId="editingTaskId"
              @updateTask="updateTask"
              @deleteTask="deleteTask"
          />
          <div v-if="hoveredCell && hoveredCell.person === person && hoveredCell.day === day"
               class="task-icons add-icon">
            <img :src="addIcon" alt="Add" class="icon" @click="showAddInput(person, day)" />
          </div>

          <div v-if="taskToEdit && taskToEdit.person === person && taskToEdit.day === day"
               class="add-task-input-container">
            <input type="text" v-model="newTaskName" @keyup.enter="handleAddTask" placeholder="Add new task" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import addIcon from '../../../../public/assets/addIcon.png';

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
  editingTaskId,
  addUser as apiAddUser
} from '../api/useTasks.ts';
import TaskItem from "../../../5features/TaskItem/ui/TaskItem.vue";

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const newTaskName = ref('');
const newUserName = ref('');
const showAddUserInput = ref(false);

onMounted(() => {
  fetchTasks();
});

const handleAddTask = () => {
  if (taskToEdit.value) {
    confirmAddTask(newTaskName.value).then(() => {
      newTaskName.value = '';
      taskToEdit.value = null; // Сбросить состояние редактирования
    });
  }
};

const addUserHandler = () => {
  if (newUserName.value.trim()) {
    apiAddUser(newUserName.value.trim()).then(() => {
      newUserName.value = '';
      showAddUserInput.value = false;
    });
  }
};
</script>
<style scoped>
.schedule-container {
  padding: 30px;
  background-color: #f7f9fc;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #2d3748;
  font-size: 2.5rem;
  font-weight: 600;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 20px;
}

.schedule-header-cell {
  padding: 15px;
  font-weight: 600;
  text-align: center;
  background-color: #edf2f7;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.day-title {
  margin: 0;
  font-size: 1.2rem;
  color: #4a5568;
}

.person-row {
  display: contents;
}

.person-cell {
  background-color: #ffffff;
  text-align: center;
  vertical-align: middle;
  padding: 15px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  font-weight: 600;
  color: #2d3748;
}

.schedule-cell {
  padding: 20px;
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.schedule-cell:hover {
  background-color: #f1f5f9;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.add-user-button {
  background-color: #3182ce;
  color: white;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.add-user-button:hover {
  background-color: #2b6cb0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.add-user-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.3);
}

.add-user-button .icon {
  margin-right: 8px;
  width: 20px;
  height: 20px;
}

.schedule-cell:hover  {
  background-color: #2b6cb0;
  transform: scale(1.03);
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

.schedule-cell:hover .task-icons {
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

.add-user-input-container {
  display: flex;
  align-items: center;
  gap: 10px;
}

.add-user-input-container input {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  font-size: 1rem;
  width: 250px;
  box-sizing: border-box;
}

.add-user-input-container button {
  padding: 10px 20px;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  border-radius: 10px;
  background-color: #3182ce;
  color: white;
  transition: background-color 0.3s ease;
}

.add-user-input-container button:hover {
  background-color: #2b6cb0;
}

.add-task-input-container {
  margin-top: 10px;
}

.add-task-input-container  input {
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  padding: 10px;
  font-size: 1rem;
  width: calc(100% - 20px);
  box-sizing: border-box;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.add-task-input-container input:focus {
  border-color: #3182ce;
  outline: none;
  box-shadow: 0 0 5px rgba(49, 130, 206, 0.5);
}
</style>
