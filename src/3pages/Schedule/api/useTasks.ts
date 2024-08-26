import { ref } from 'vue';
import axios from 'axios';
import {Logger} from "sass";

const tasks = ref<hoveredCell[]>([]);
const dynamicPeople = ref<{ _id: string, name: string }[]>([]);
const hoveredCell = ref<{ _id: string, person: string, day: string } | null>(null);
const taskToEdit = ref<{ person: string, day: string } | null>(null);
const showAddTaskDialog = ref(false);
const editingTaskId = ref<string | null>(null);
const editingUserId = ref<string | null>(null);
const users = ref<{ _id: string, name: string }[]>([]);

const apiBaseUrl = 'http://localhost:3000/api';

const updateDynamicPeople = () => {
    dynamicPeople.value = [
        ...new Set([
            ...tasks.value.map(task => ({ _id: task.person?._id, name: task.person?.name })),
            ...users.value.map(user => ({ _id: user._id, name: user.name }))
        ])
    ];
};
const onCellHover = (personId: string, personName: string, day: string) => {
    hoveredCell.value = { _id: personId, person: personName, day };
};

// Получение всех задач
const fetchTasks = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}/tasks`);
        tasks.value = response.data;
        updateDynamicPeople();
    } catch (error) {
        console.error('Error fetching tasks:', error);
    }
};


// Получение всех пользователей
const fetchUsers = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}/users`);
        users.value = response.data;
        updateDynamicPeople();
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};


const getTasksForDay = (personId: string, day: string) => {
    return tasks.value.filter((t) => {
        return t.person && t.person._id === personId && t.daysOfWeek.includes(day);
    });
};


const showAddInput = (personId: string, day: string) => {
    taskToEdit.value = { person: personId, day };
    showAddTaskDialog.value = true;
};
const confirmAddTask = async (taskName: string) => {
    if (!taskName.trim()) return;
    const personId = hoveredCell.value?._id
    if (!personId) {
        console.error('Person ID is not set.');
        return;
    }
    const newTask = {
        person: personId,  // Используем только ID пользователя
        daysOfWeek: [taskToEdit.value?.day],
        task: taskName
    }
    try {
        const response = await axios.post(`${apiBaseUrl}/tasks`, newTask);
        tasks.value.push(response.data);
        updateDynamicPeople();
        showAddTaskDialog.value = false;
    } catch (error) {
        console.error('Error adding task:', error);
    }
};




const addUser = async (userName: string) => {
    if (!userName.trim()) return;

    try {
        const response = await axios.post(`${apiBaseUrl}/users`, { name: userName });
        dynamicPeople.value.push({ _id: response.data._id, name: response.data.name });
    } catch (error) {
        console.error('Error adding user:', error);
    }
};
const updateUser = async ({ id, name }: { id: string, name: string }) => {
    if (!name.trim()) return;

    console.log('Updating user with ID:', id, 'New name:', name);

    try {
        const response = await axios.put(`${apiBaseUrl}/users/${id}`, { name });
        console.log('Update response:', response.data);

        const userIndex = dynamicPeople.value.findIndex((person) => person._id === id);

        if (userIndex !== -1) {
            dynamicPeople.value[userIndex].name = response.data.name;
        }
        editingUserId.value = null;
    } catch (error) {
        console.error('Error updating user:', error);
    }
};



// Удаление пользователя
const deleteUser = async (userId: string) => {
    try {
        await axios.delete(`${apiBaseUrl}/users/${userId}`);

        dynamicPeople.value = dynamicPeople.value.filter(person => person._id !== userId);

        tasks.value = tasks.value.filter(task => task.person !== userId);

        console.log(`User and their tasks with ID ${userId} deleted.`);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};
// Обновление информации о задаче
const updateTask = async ({ id, updatedTaskName }: { id: string, updatedTaskName: string }) => {
    if (!updatedTaskName.trim()) return;

    try {
        const response = await axios.put(`${apiBaseUrl}/tasks/${id}`, { task: updatedTaskName });
        const taskIndex = tasks.value.findIndex((task) => task._id === id);

        if (taskIndex !== -1) {
            tasks.value[taskIndex] = response.data;
            updateDynamicPeople();
        }
        editingTaskId.value = null;
    } catch (error) {
        console.error('Error updating task:', error);
    }
};






// Удаление задачи
const deleteTask = async (taskId: string) => {
    try {
        await axios.delete(`${apiBaseUrl}/tasks/${taskId}`);
        tasks.value = tasks.value.filter(task => task._id !== taskId);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

export {
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
    addUser,
    fetchUsers,
    updateUser,
    deleteUser,
    onCellHover
};