<script setup>
import { getProfile } from '../api/profile';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';

import LoginFormCard from '../components/LoginFormCard.vue';

const store = useStore();
const profileData = ref({});
const isLoginModalOpen = ref(false);

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
    const user = store.state.username;
    if (!user) {
        isLoginModalOpen.value = true;
    } else {
        profileData.value = await populateData(user.username);
    }
});

const onLogin = async (username) => {
    profileData.value = await populateData(username);
    isLoginModalOpen.value = false;
};

const logout = () => {
    store.commit('login', null);
    isLoginModalOpen.value = true;
};
</script>

<template>
    <LoginFormCard v-if="isLoginModalOpen" @logged-in="onLogin" />

    <div v-else class="profile">
        <h1 class="text-2xl font-bold py-3 border-b mb-12">
            Welcome back, {{ profileData?.name }}
        </h1>

        <form class="flex flex-col gap-6">
            <div class="flex flex-col gap-2">
                <label for="name" class="text-xs font-semibold">Username</label>
                <input
                    id="name"
                    type="text"
                    v-model="profileData.username"
                    class="border rounded-lg px-3 py-2"
                    disabled
                />
            </div>
            <div class="flex flex-col gap-2">
                <label for="email" class="text-xs font-semibold">Email</label>
                <input
                    id="email"
                    type="email"
                    v-model="profileData.email"
                    class="border rounded-lg px-3 py-2"
                    disabled
                />
            </div>
            <button
                class="bg-rose-800 px-4 py-2 mt-5 text-white text font-semibold rounded-full"
                @click="logout"
            >
                Logout
            </button>
        </form>
    </div>
</template>
