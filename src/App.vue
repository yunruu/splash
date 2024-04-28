<script setup>
import { RouterLink, RouterView } from 'vue-router';
</script>

<template>
    <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/profile">Profile</RouterLink>
    </nav>
    <RouterView />
</template>

<style scoped>
nav {
    width: 100%;
    font-size: 12px;
    padding: 0.5rem;
    text-align: right;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;

    a {
        color: var(--color-theme-500);
    }
}

nav a.router-link-exact-active {
    color: var(--color-text);
    font-weight: 500;
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
</style>
