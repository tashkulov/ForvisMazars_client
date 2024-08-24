// src/1App/router.ts
import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '../3pages/NotFound/ui/NotFound.vue';
import Schedule from '../3pages/Schedule/ui/Schedule.vue';
import MainPage from '../3pages/MainPage/ui/MainPage.vue';

const routes = [
    {
        path: '/',
        name: 'MainPage',
        component: MainPage,
    },
    {
        path: '/schedule',
        name: 'Schedule',
        component: Schedule,
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
