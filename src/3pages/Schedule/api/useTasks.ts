import { ref } from 'vue';
import axios from 'axios';

const tasks = ref<any[]>([]);
const dynamicPeople = ref<{ _id: string, person: string }[]>([]);
const hoveredCell = ref<{ person: string, day: string } | null>(null);
const taskToEdit = ref<{ person: string, day: string } | null>(null);
const showAddTaskDialog = ref(false);
const editingTaskId = ref<string | null>(null);
const editingUserId = ref<string | null>(null);

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
        dynamicPeople.value = [...new Set(tasks.value.map(task => ({ _id: task.person, name: task.person })))];

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

        dynamicPeople.value.push({ _id: createdUser._id, name: createdUser.name });
    } catch (error) {
        console.error('Error adding user:', error);
    }
};
const updateUser = async (userId: string, newName: string) => {
    if (!newName.trim()) return;

    try {
        const updatedUser = {
            name: newName
        };

        const response = await axios.put(`http://localhost:3000/api/schedule/${userId}`, updatedUser);
        const updatedUserFromServer = response.data;

        const userIndex = dynamicPeople.value.findIndex((person) => person._id === userId);
        if (userIndex !== -1) {
            dynamicPeople.value[userIndex].name = updatedUserFromServer.name;
        }

        editingUserId.value = null;
    } catch (error) {
        console.error('Error updating user:', error);
    }
};


const deleteUser = async (userId: string) => {
    try {
        await axios.delete(`http://localhost:3000/api/schedule/${userId}`);
        dynamicPeople.value = dynamicPeople.value.filter(person => person._id !== userId);
    } catch (error) {
        console.error('Error deleting user:', error);
    }
};

const updateTask = async ({ id, name }: { id: string, name: string }) => {
    if (!name.trim()) return;

    try {
        const updatedTask = {
            person: name
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
        tasks.value = tasks.value.filter(task => task._id !== taskId);
    } catch (error) {
        console.error('Error deleting task:', error);
    }
};

const fetchTasks = async () => {
    try {
        const response = await axios.get('http://localhost:3000/api/schedule');
        tasks.value = response.data;
        dynamicPeople.value = [...new Set(tasks.value.map(task => ({ _id: task.person, name: task.person })))];
    } catch (error) {
        console.error('Error fetching tasks:', error);
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
    updateUser,
    deleteUser
};
