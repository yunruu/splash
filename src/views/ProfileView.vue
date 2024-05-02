<script setup>
import { getProfile } from '../api/profile';
import { ref, onMounted } from 'vue';
import { useStore } from 'vuex';
import { deleteAccount } from '../api/auth';
import LoginFormCard from '../components/LoginFormCard.vue';
import MessageDialog from '@/components/MessageDialog.vue';

const store = useStore();
const profileData = ref({});
const isLoginModalOpen = ref(false);
const dialog = ref({
    isOpen: false,
    title: '',
    message: '',
    isCancel: false,
    icon: '',
    confirm: () => {}
});

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
    const user = store.getters.getUsername;
    if (!user) {
        isLoginModalOpen.value = true;
    } else {
        profileData.value = await populateData(user);
    }
});

const onLogin = async (username) => {
    profileData.value = await populateData(username);
    isLoginModalOpen.value = false;
};

const logout = () => {
    store.commit('logout');
    dialog.value = {
        isOpen: true,
        title: 'Logged out',
        message: 'You have been logged out successfully.',
        icon: '/icons/green-tick.svg',
        isCancel: false,
        confirm: () => {
            dialog.value.isOpen = false;
        }
    };
    isLoginModalOpen.value = true;
};

const handleDeleteAccount = (e) => {
    e.preventDefault();
    dialog.value = {
        isOpen: true,
        title: 'Delete Account',
        message: 'Are you sure you want to delete your account?',
        isCancel: true,
        confirm: confirmDeleteAccount
    };
};

const confirmDeleteAccount = async () => {
    dialog.value.isOpen = false;
    const res = await deleteAccount(store.getters.getUsername);
    if (!res.data) {
        dialog.value = {
            isOpen: true,
            title: 'Error',
            message:
                'An error occurred while deleting your account: ' + (res.error || 'Unknown error'),
            isCancel: false,
            confirm: () => {
                dialog.value.isOpen = false;
            }
        };
        return;
    }
    store.commit('login', null);
    dialog.value = {
        isOpen: true,
        title: 'Account Deleted',
        message: 'Your account has been deleted successfully.',
        icon: '/icons/green-tick.svg',
        isCancel: false,
        confirm: () => {
            dialog.value.isOpen = false;
            isLoginModalOpen.value = true;
        }
    };
};
</script>

<template>
    <LoginFormCard v-if="isLoginModalOpen" @logged-in="onLogin" />

    <div v-else class="profile">
        <h1 class="text-2xl font-bold py-3 border-b mb-12">
            Welcome back, {{ profileData?.username }}
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
            <button
                class="border border-rose-800 px-4 py-2 text-rose-800 text font-semibold rounded-full"
                @click="handleDeleteAccount"
            >
                Delete account
            </button>
        </form>
    </div>
    <MessageDialog
        v-if="dialog.isOpen"
        :message="dialog.message"
        :title="dialog.title"
        :is-cancel="dialog.isCancel"
        :icon="dialog.icon"
        @confirm="dialog.confirm"
        @cancel="dialog.isOpen = false"
    />
</template>
