<script setup>
import { RouterLink, RouterView } from 'vue-router';

const routes = [
    {
        path: '/',
        label: 'Home',
        icon: '/icons/home.svg'
    },
    {
        path: '/groups',
        label: 'Groups',
        icon: '/icons/group.svg'
    },
    {
        path: '/profile',
        label: 'Profile',
        icon: '/icons/profile.svg'
    }
];
</script>

<template>
    <nav>
        <RouterLink
            v-for="route in routes"
            :key="route.path"
            :to="route.path"
            class="router-wrapper"
        >
            <div class="flex flex-col items-center">
                <img
                    :src="route.icon"
                    :alt="route.label + ' icon'"
                    width="24"
                    height="24"
                    style="height: 24px"
                />
                {{ route.label }}
            </div>
        </RouterLink>
    </nav>
    <RouterView />
</template>

<style scoped>
nav {
    width: 100%;
    height: var(--nav-height);
    font-size: 12px;
    padding: 0.5rem;
    text-align: center;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-around;
    z-index: var(--nav-z-index);
    background-color: white;

    a {
        color: var(--vt-c-text-light-2);
    }
}

nav a.router-link-exact-active {
    color: var(--color-text);
    font-weight: 500;

    img {
        filter: invert(1);
    }
}

nav a.router-link-exact-active:hover {
    background-color: transparent;
}

nav a {
    display: inline-block;
    padding: 0.5rem;
}

nav a:first-of-type {
    border: 0;
}

.router-wrapper {
    width: 100%;
}
</style>
