<template>
  <div class="schedule-container">
    <h1 class="title">Weekly Schedule</h1>
    <div class="schedule-grid">
      <div class="schedule-header-cell"></div>
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
              :editingTaskId="editingTaskId"
              @updateTask="updateTask"
              @deleteTask="deleteTask"
          />
          <!-- Иконки добавления задачи -->
          <div v-if="hoveredCell && hoveredCell.person === person && hoveredCell.day === day"
               class="task-icons add-icon">
            <img :src="addIcon" alt="Add" class="icon" @click="showAddInput(person, day)" />
          </div>
        </div>
      </div>
    </div>

    <AddTaskDialog v-if="showAddTaskDialog" :person="taskToEdit.person" :day="taskToEdit.day"
                   @confirmAddTask="confirmAddTask" @closeDialog="closeAddTaskDialog" />
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import addIcon from '../../../../public/assets/addIcon.png';
import editIcon from '../../../../public/assets/editIcon.png';
import deleteIcon from '../../../../public/assets/deleteIcon.png';
import AddTaskDialog from "../../../6entities/ui/AddTaskDialog/AddTaskDialog.vue";
import TaskItem from "./TaskItem.vue";

import {
  tasks,
  dynamicPeople,
  hoveredCell,
  taskToEdit,
  showAddTaskDialog,
  editingTaskId,
  getTasksForDay,
  showAddInput,
  confirmAddTask,
  updateTask,
  deleteTask,
  closeAddTaskDialog,
  fetchTasks
} from '../api/useTasks.ts';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

onMounted(() => {
  fetchTasks();
});
</script>


<style scoped>
.schedule-container {
  padding: 30px;
  background-color: #f0f4f8;
  font-family: 'Roboto', sans-serif;
  min-height: 100vh;
}

.title {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
  font-size: 2.5rem;
  font-weight: bold;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 15px;
}

.schedule-header-cell {
  padding: 15px;
  font-weight: bold;
  text-align: center;
  background-color: #e2e8f0;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
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
  background-color: #edf2f7;
  text-align: center;
  vertical-align: middle;
  padding: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-weight: bold;
  color: #2d3748;
}

.schedule-cell {
  padding: 15px;
  background-color: #fff;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  position: relative;
  display: flex;
  flex-direction: column;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.schedule-cell:hover {
  background-color: #f7fafc;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.task-container {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
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

.schedule-cell:hover .task-block {
  background-color: #2b6cb0;
  transform: scale(1.02);
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

.modal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.modal-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

button {
  margin-top: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.3s ease, color 0.3s ease;
}

button:hover {
  background-color: #3182ce;
  color: white;
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
</style>
