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
        <div v-for="day in daysOfWeek" :key="day" class="schedule-cell">
          <div v-if="hasTask(person, day)" class="task-block">{{ getTask(person, day) }}</div>
        </div>
      </div>
    </div>

    <button class="add-task-button" @click="addTask">Add Task</button>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const tasks = ref([]);
const dynamicPeople = ref([]);

const hasTask = (person: string, day: string) => {
  return tasks.value.some((t) => t.person === person && t.daysOfWeek.includes(day));
};

const getTask = (person: string, day: string) => {
  const task = tasks.value.find((t) => t.person === person && t.daysOfWeek.includes(day));
  return task ? task.task : '';
};
const addTask = async () => {
  const personName = prompt("Enter person's name:", 'New Person');
  if (!personName) {
    alert('Task must have a name!');
    return;
  }

  const selectedDays = [];
  daysOfWeek.forEach(day => {
    if (confirm(`Assign task to ${day}?`)) {
      selectedDays.push(day);
    }
  });

  const taskName = prompt("Enter the task:", 'New Task');

  try {
    const newTask = {
      person: personName,
      daysOfWeek: selectedDays,
      task: taskName
    };

    const response = await axios.post('http://localhost:3000/api/schedule', newTask);
    const createdTask = response.data;

    tasks.value.push(createdTask);

    dynamicPeople.value = [...new Set(tasks.value.map(task => task.person))];
  } catch (error) {
    console.error('Error creating new task:', error);
  }
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
  padding: 20px;
  background-color: #f9f9f9;
}

.title {
  text-align: center;
  margin-bottom: 20px;
  color: #333;
}

.schedule-grid {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  gap: 10px;
}

.schedule-header-cell {
  padding: 10px;
  font-weight: bold;
  text-align: center;
  background-color: #eee;
  border: 1px solid #ddd;
}

.person-row {
  display: contents;
}

.person-cell {
  background-color: #f7f7f7;
  text-align: center;
  vertical-align: middle;
  padding: 10px;
  border: 1px solid #ddd;
}

.schedule-cell {
  padding: 10px;
  background-color: #fff;
  border: 1px solid #ddd;
  position: relative;
  height: 60px;
}

.task-block {
  background-color: #4285f4;
  color: white;
  padding: 5px;
  text-align: center;
  border-radius: 5px;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.add-task-button {
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.add-task-button:hover {
  background-color: #0056b3;
}
</style>
