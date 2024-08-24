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
          <div v-for="task in getTasksForDay(person, day)" :key="task._id" class="task-container">
            <div v-if="editingTaskId === task._id">
              <input
                  v-model="editTaskName"
                  @blur="updateTask(task._id)"
                  @keydown.enter="updateTask(task._id)"
                  class="edit-input"
                  placeholder="Edit task..."
              />
            </div>
            <div v-else class="task-block" @dblclick="startEditing(task)">
              {{ task.task }}
            </div>

            <!-- Иконки редактирования и удаления -->
            <div v-if="!editingTaskId" class="task-icons">
              <img :src="editIcon" alt="Edit" class="icon" @click="startEditing(task)" />
              <img :src="deleteIcon" alt="Delete" class="icon" @click="deleteTask(task._id)" />
            </div>
          </div>

          <!-- Иконка добавления задачи в пустые ячейки -->
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
import editIcon from '../../../../public/assets/editIcon.png'; // Иконка редактирования
import deleteIcon from '../../../../public/assets/deleteIcon.png'; // Иконка удаления
import axios from 'axios';
import AddTaskDialog from "../../../6entities/ui/AddTaskDialog/AddTaskDialog.vue";

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const tasks = ref([]);
const dynamicPeople = ref([]);
const hoveredCell = ref<{ person: string, day: string } | null>(null);
const taskToEdit = ref<{ person: string, day: string } | null>(null);
const showAddTaskDialog = ref(false);
const editingTaskId = ref<string | null>(null);
const editTaskName = ref('');

// Получение задач на определённый день
const getTasksForDay = (person: string, day: string) => {
  return tasks.value.filter((t) => t.person === person && t.daysOfWeek.includes(day));
};

// Показать инпут для добавления задачи
const showAddInput = (person: string, day: string) => {
  taskToEdit.value = { person, day };
  showAddTaskDialog.value = true;
};

// Подтверждение добавления задачи
const confirmAddTask = async (taskName: string) => {
  if (!taskName.trim()) return;

  try {
    const newTask = {
      person: taskToEdit.value?.person,
      daysOfWeek: [taskToEdit.value?.day],
      task: taskName
    };

    const response = await axios.post('http://localhost:3000/api/schedule', newTask);
    const createdTask = response.data;

    tasks.value.push(createdTask);
    dynamicPeople.value = [...new Set(tasks.value.map(task => task.person))];

    showAddTaskDialog.value = false;
  } catch (error) {
    console.error('Error adding task:', error);
  }
};

// Функция для начала редактирования задачи
const startEditing = (task: any) => {
  editingTaskId.value = task._id;
  editTaskName.value = task.task;
};

// Обновление задачи после редактирования
const updateTask = async (taskId: string) => {
  if (!editTaskName.value.trim()) return;

  try {
    const updatedTask = {
      ...tasks.value.find(task => task._id === taskId),
      task: editTaskName.value,
    };

    const response = await axios.put(`http://localhost:3000/api/schedule/${taskId}`, updatedTask);
    const updatedTaskFromServer = response.data;

    // Обновляем задачу в локальном списке
    const taskIndex = tasks.value.findIndex((task) => task._id === taskId);
    if (taskIndex !== -1) {
      tasks.value[taskIndex] = updatedTaskFromServer;
    }

    editingTaskId.value = null;
    editTaskName.value = '';
  } catch (error) {
    console.error('Error updating task:', error);
  }
};

// Удаление задачи
const deleteTask = async (taskId: string) => {
  try {
    await axios.delete(`http://localhost:3000/api/schedule/${taskId}`);
    tasks.value = tasks.value.filter((task) => task._id !== taskId);
  } catch (error) {
    console.error('Error deleting task:', error);
  }
};

// Закрытие диалога добавления задачи
const closeAddTaskDialog = () => {
  showAddTaskDialog.value = false;
};

onMounted(async () => {
  try {
    const response = await axios.get('http://localhost:3000/api/schedule');
    tasks.value = response.data;
    dynamicPeople.value = [...new Set(tasks.value.map(task => task.person))];
  } catch (error) {
    console.error('Error fetching tasks:', error);
  }
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
