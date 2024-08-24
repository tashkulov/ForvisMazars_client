// src/features/schedule/routes.ts
import { RouteRecordRaw } from 'vue-router';
import Schedule from './ui/Schedule.vue';

const routes: RouteRecordRaw[] = [
    {
        path: '/schedule',
        name: 'Schedule',
        component: Schedule,
    },
];

export default routes;
