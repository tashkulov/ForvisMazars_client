import { ref } from 'vue';
import axios from 'axios';

const tasks = ref<any[]>([]);
const dynamicPeople = ref<{ _id: string, name: string }[]>([]);
const hoveredCell = ref<{ person: string, day: string } | null>(null);
const taskToEdit = ref<{ person: string, day: string } | null>(null);
const showAddTaskDialog = ref(false);
const editingTaskId = ref<string | null>(null);
const editingUserId = ref<string | null>(null);
const users = ref<{ _id: string, name: string }[]>([]);

const apiBaseUrl = 'http://localhost:3000/api';

// Обновление списка динамических пользователей
const updateDynamicPeople = () => {
    dynamicPeople.value = [
        ...new Set([
            ...tasks.value.map(task => ({ _id: task.person?._id, name: task.person?.name })),
            ...users.value.map(user => ({ _id: user._id, name: user.name }))
        ])
    ];
};

// Получение всех задач
const fetchTasks = async () => {
    try {
        const response = await axios.get(`${apiBaseUrl}/tasks`);
        tasks.value = response.data;
        console.log('Fetched tasks:', tasks.value);
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

// Получение задач для конкретного дня
const getTasksForDay = (personId: string, day: string) => {
    return tasks.value.filter((t) => {
        // Проверка существования t.person перед доступом к его свойствам
        return t.person && t.person._id === personId && t.daysOfWeek.includes(day);
    });
};

// Показать инпут для добавления новой задачи
const showAddInput = (personId: string, day: string) => {
    taskToEdit.value = { person: personId, day };
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

        const response = await axios.post(`${apiBaseUrl}/tasks`, newTask);
        tasks.value.push(response.data);
        updateDynamicPeople();
        showAddTaskDialog.value = false;
    } catch (error) {
        console.error('Error adding task:', error);
    }
};

// Добавление нового пользователя
const addUser = async (userName: string) => {
    if (!userName.trim()) return;

    try {
        const response = await axios.post(`${apiBaseUrl}/users`, { name: userName });
        dynamicPeople.value.push({ _id: response.data._id, name: response.data.name });
    } catch (error) {
        console.error('Error adding user:', error);
    }
};

// Обновление информации о пользователе
const updateUser = async (userId: string, newName: string) => {
    if (!newName.trim()) return;

    try {
        const response = await axios.put(`${apiBaseUrl}/users/${userId}`, { name: newName });
        const userIndex = dynamicPeople.value.findIndex((person) => person._id === userId);
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
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

// Обновление информации о задаче
const updateTask = async ({ id, name }: { id: string, name: string }) => {
    if (!name.trim()) return;

    try {
        const response = await axios.put(`${apiBaseUrl}/tasks/${id}`, { task: name });
        const taskIndex = tasks.value.findIndex((task) => task._id === id);
        if (taskIndex !== -1) {
            tasks.value[taskIndex] = response.data;
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
    deleteUser
};
