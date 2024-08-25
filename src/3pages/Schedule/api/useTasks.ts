// src/hooks/useTasks.ts
import { ref } from 'vue';
import axios from 'axios';

const tasks = ref<any[]>([]);
const dynamicPeople = ref<string[]>([]);
const hoveredCell = ref<{ person: string, day: string } | null>(null);
const taskToEdit = ref<{ person: string, day: string } | null>(null);
const showAddTaskDialog = ref(false);
const editingTaskId = ref<string | null>(null);

const getTasksForDay = (person: string, day: string) => {
    return tasks.value.filter((t) => t.person === person && t.daysOfWeek.includes(day));
};

const showAddInput = (person: string, day: string) => {
    taskToEdit.value = { person, day };
    showAddTaskDialog.value = true;
};

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
const addUser = async (userName: string) => {
    if (!userName.trim()) return;

    try {
        const response = await axios.post('http://localhost:3000/api/schedule', { person: userName });
        const createdUser = response.data;

        dynamicPeople.value.push(createdUser.person); // Добавляем нового пользователя в список
        newUser.value = ''; // Очищаем поле ввода
    } catch (error) {
        console.error('Error adding user:', error);
    }
};
const updateTask = async ({ id, name }: { id: string, name: string }) => {
    if (!name.trim()) return;

    try {
        const updatedTask = {
            ...tasks.value.find(task => task._id === id),
            task: name,
        };

        const response = await axios.put(`http://localhost:3000/api/schedule/${id}`, updatedTask);
        const updatedTaskFromServer = response.data;

        const taskIndex = tasks.value.findIndex((task) => task._id === id);
        if (taskIndex !== -1) {
            tasks.value[taskIndex] = updatedTaskFromServer;
        }

        editingTaskId.value = null;
    } catch (error) {
        console.error('Error updating task:', error);
    }
};

const deleteTask = async (taskId: string) => {
    try {
        await axios.delete(`http://localhost:3000/api/schedule/${taskId}`);
        tasks.value = tasks.value.filter((task) => task._id !== taskId);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

const closeAddTaskDialog = () => {
    showAddTaskDialog.value = false;
};

const fetchTasks = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/schedule');
        tasks.value = response.data;
        dynamicPeople.value = [...new Set(tasks.value.map(task => task.person))];
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};

export {
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
    fetchTasks,
    addUser
};
