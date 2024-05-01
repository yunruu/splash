<template>
    <div class="bg-white p-6 rounded">
        <div class="py-4 w-full border-b text-2xl font-bold">Forgot your password?</div>

        <form class="mt-10 flex flex-col gap-4">
            <div class="flex flex-col gap-2">
                <label for="username" class="text-xs font-semibold">* Username</label>
                <input
                    v-model="username"
                    type="text"
                    id="username"
                    name="username"
                    class="border rounded-lg px-3 py-2"
                />
            </div>
            <div class="flex flex-col gap-4">
                <label for="password" class="text-xs font-semibold">* Password</label>
                <div class="flex items-center border rounded-lg">
                    <input
                        v-model="password"
                        :type="passwordFieldType"
                        id="password"
                        name="password"
                        class="flex-grow border-0 px-3 py-2 rounded-l-lg"
                    />
                    <button
                        class="px-2 bg-transparent text-xs leading-none"
                        @click="togglePasswordVisibility"
                    >
                        <img
                            :src="
                                isPasswordVisible
                                    ? '/icons/opened-eye.svg'
                                    : '/icons/closed-eye.svg'
                            "
                            alt="View password"
                            class="w-5 h-5"
                        />
                    </button>
                </div>
            </div>
            <button
                class="bg-rose-700 text-white mt-8 px-4 py-2 rounded hover:bg-rose-800"
                @click="handleClickPrimaryBtn"
            >
                Reset password
            </button>
            <button
                class="border border-slate-300 mt-1 px-4 py-2 rounded hover:bg-gray-100 active:border-rose-500"
                @click="handleClickSecondaryBtn"
            >
                Back to login
            </button>
        </form>
    </div>
    <MessageDialog
        v-if="message.isOpen"
        :title="message.title"
        :message="message.content"
        :is-cancel="message.isCancel"
        :icon="message.icon"
        @cancel="message.isOpen = false"
        @confirm="message.confirm"
    />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { resetPassword } from '@/api/auth';
import { validatePassword } from '../utils/validate';
import MessageDialog from './MessageDialog.vue';

const router = useRouter();
const username = ref('');
const password = ref('');
const isPasswordVisible = ref(false);

const message = ref({
    isOpen: false,
    title: '',
    content: '',
    isCancel: false,
    confirm: () => {}
});

const passwordFieldType = computed(() => {
    return isPasswordVisible.value ? 'text' : 'password';
});

const closeMessageDialog = () => {
    message.value.isOpen = false;
};

const togglePasswordVisibility = (e) => {
    e.preventDefault();
    isPasswordVisible.value = !isPasswordVisible.value;
};

const handleClickPrimaryBtn = (e) => {
    e.preventDefault();
    if (!username.value) {
        message.value = {
            isOpen: true,
            title: 'Error',
            content: 'Username is required.',
            isCancel: false,
            confirm: closeMessageDialog
        };
        return;
    }
    if (!password.value) {
        message.value = {
            isOpen: true,
            title: 'Error',
            content: 'Password is required.',
            isCancel: false,
            confirm: closeMessageDialog
        };
        return;
    }
    const validatePasswordRes = validatePassword(password.value);
    if (!validatePasswordRes.data) {
        message.value = {
            isOpen: true,
            title: 'Error',
            content: validatePasswordRes.error,
            isCancel: false,
            confirm: closeMessageDialog
        };
        return;
    }
    message.value = {
        isOpen: true,
        title: 'Confirm reset password?',
        content: 'Are you sure you want to reset your password?',
        isCancel: true,
        confirm: confirmPasswordReset
    };
};

const confirmPasswordReset = async () => {
    message.value.isOpen = false;
    try {
        const res = await resetPassword(username.value, password.value);
        if (!res.data) {
            throw new Error('Failed to reset password, please try again later.');
        }
        message.value = {
            isOpen: true,
            title: 'Success',
            content: 'Password reset successful. Please login with your new password.',
            isCancel: false,
            icon: '/icons/green-tick.svg',
            confirm: () => {
                router.push({ name: 'profile' });
            }
        };
    } catch (error) {
        console.error(error);
        message.value = {
            isOpen: true,
            title: 'Error',
            content: 'Failed to reset password, please try again later.',
            isCancel: false,
            confirm: closeMessageDialog
        };
    }
};

const handleClickSecondaryBtn = (e) => {
    e.preventDefault();
    router.push({ name: 'profile' });
};
</script>
