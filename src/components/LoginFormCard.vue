<script setup>
import { defineEmits, ref, computed } from 'vue';
import { useStore } from 'vuex';
import { createProfile, loginProfile } from '@/api/profile';
import MessageDialog from './MessageDialog.vue';
import { testEmail } from '@/utils/regex';

const emit = defineEmits(['loggedIn']);
const store = useStore();

const username = ref('');
const password = ref('');
const email = ref('');
const isRegister = ref(false);
const isPasswordVisible = ref(false);
const message = ref({ title: '', message: '', isOpen: false });

const login = async (e) => {
    e.preventDefault();
    message.value.isOpen = false;

    const res = await loginProfile(username.value, password.value);
    if (!res.data) {
        message.value = { title: 'Error!', message: res.error, isOpen: true };
        return;
    }
    store.commit('login', { username: username.value });
    emit('loggedIn', username.value);
};

const register = async (e) => {
    e.preventDefault();
    message.value.isOpen = false;

    if (!username.value || !password.value || !email.value) {
        message.value = { title: 'Error!', message: 'Please fill all the fields.', isOpen: true };
        return;
    }

    if (password.value.length < 6) {
        message.value = {
            title: 'Error!',
            message: 'Password must be at least 6 characters.',
            isOpen: true
        };
        return;
    }

    if (!testEmail(email.value)) {
        message.value = { title: 'Error!', message: 'Invalid email address.', isOpen: true };
        return;
    }

    const data = {
        username: username.value,
        password: password.value,
        email: email.value
    };

    try {
        const res = await createProfile(username.value, data);
        if (!res.data) {
            throw new Error('Failed to create profile, please try again later. ', res.error);
        }
        backToLogin();
    } catch (error) {
        message.value = { title: 'Error!', message: error.message, isOpen: true };
    }
};

const goToRegister = () => {
    isRegister.value = true;
    username.value = '';
    password.value = '';
};

const backToLogin = () => {
    isRegister.value = false;
};

const handleClickPrimaryBtn = (e) => {
    e.preventDefault();
    if (isRegister.value) {
        register(e);
    } else {
        login(e);
    }
};

const handleClickSecondaryBtn = (e) => {
    e.preventDefault();
    if (isRegister.value) {
        backToLogin(e);
    } else {
        goToRegister(e);
    }
};

const passwordFieldType = computed(() => {
    return isPasswordVisible.value ? 'text' : 'password';
});

const handleClickViewPasswordBtn = (e) => {
    e.preventDefault();
    isPasswordVisible.value = !isPasswordVisible.value;
}
</script>

<template>
    <div class="modal-wrapper">
        <div class="modal w-100 bg-white p-6 rounded">
            <span class="py-4 border-b text-2xl font-bold">Welcome to Splash!</span>
            <span class="py-3 mt-4 text-sm italic">Please login to continue.</span>

            <form class="mt-4 flex flex-col gap-4">
                <div class="flex flex-col gap-2">
                    <label for="username" class="text-xs font-semibold">Username</label>
                    <input
                        v-model="username"
                        type="text"
                        id="username"
                        name="username"
                        class="border rounded-lg px-3 py-2"
                    />
                </div>
                <div v-if="isRegister" class="flex flex-col gap-2">
                    <label for="email" class="text-xs font-semibold">Email</label>
                    <input
                        v-model="email"
                        type="email"
                        id="email"
                        name="email"
                        class="border rounded-lg px-3 py-2"
                    />
                </div>
                <div class="flex flex-col gap-2">
                    <label for="password" class="text-xs font-semibold">Password</label>
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
                            @click="handleClickViewPasswordBtn">
                            {{ isPasswordVisible ? 'Hide' : 'View' }}
                        </button>
                    </div>
                </div>
                <button
                    class="bg-rose-800 text-white mt-8 px-4 py-2 rounded hover:bg-rose-900"
                    @click="handleClickPrimaryBtn"
                >
                    {{ isRegister ? 'Register' : 'Login' }}
                </button>
                <button
                    class="border border-slate-300 mt-1 px-4 py-2 rounded hover:bg-gray-100 active:border-rose-500"
                    @click="handleClickSecondaryBtn"
                >
                    <span v-if="isRegister">Go back to Login</span>
                    <span v-else>Don't have an account? <b>Register now</b></span>
                </button>
            </form>
        </div>
    </div>

    <MessageDialog
        v-if="message.isOpen"
        :title="message.title"
        :message="message.message"
        :is-cancel="false"
        @confirm="message.isOpen = false"
    />
</template>

<style scoped>
.modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 2001;
    display: flex;
    justify-content: center;
    align-items: center;
}
.modal {
    width: 90%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
}
</style>
