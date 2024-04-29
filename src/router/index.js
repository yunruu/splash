import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue')
        },
        {
            path: '/profile',
            name: 'profile',
            component: () => import('../views/ProfileView.vue')
        },
        {
            path: '/groups',
            name: 'groups',
            component: () => import('../views/GroupView.vue')
        },
        {
            path: '/group/:id',
            name: 'group',
            component: () => import('../views/GroupDetailView.vue')
        },
        {
            path: '/:catchAll(.*)',
            name: 'not-found',
            component: () => import('../views/404NotFound.vue')
        }
    ]
});

export default router;
