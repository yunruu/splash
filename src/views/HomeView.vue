<script setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();

onBeforeMount(() => {
    if (!store.state.username) {
        router.push('/profile');
    }
});
</script>

<template>
    <div>This is the home page</div>
</template>
