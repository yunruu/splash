<script setup>
import { getProfile } from '../api/profile';
import { ref, onMounted } from 'vue';

const profileData = ref({});

const populateData = async (username) => {
    try {
        const data = await getProfile(username);
        return data;
    } catch (error) {
        console.error(error);
        return {};
    }
};

onMounted(async () => {
    profileData.value = await populateData('admin');
});
</script>

<template>
    <div class="profile">
        <h1>Welcome back, {{ profileData?.name }}!</h1>
    </div>
</template>
