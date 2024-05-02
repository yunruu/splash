<template>
    <div class="z-[9998] fixed top-0 left-0 right-0 h-full wrapper"></div>
    <div class="z-[9999] fixed top-8 left-0 right-0 m-5 bg-white p-4 rounded-lg shadow-md">
        <div class="text-lg font-bold mb-4 border-b pb-3 flex items-center gap-3">
            <img
                :src="icon ? icon : '/icons/alert.svg'"
                alt="Warning"
                class="w-6 h-6 inline-block"
            />
            {{ props.title || 'Untitled' }}
        </div>
        <div class="text-sm text-gray-500">
            {{ props.message }}
        </div>

        <div class="flex flex-row-reverse gap-4 mt-4">
            <button
                class="bg-rose-800 text-white px-4 py-2 rounded hover:cursor-pointer hover:bg-rose-900"
                @click="confirm"
            >
                Confirm
            </button>
            <button
                v-if="props.isCancel"
                class="bg-gray-200 text-gray-800 px-4 py-2 rounded hover:cursor-pointer hover:bg-gray-300"
                @click="cancel"
            >
                Cancel
            </button>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps(['title', 'message', 'isCancel', 'icon']);
const emit = defineEmits(['confirm', 'cancel']);

const confirm = () => {
    emit('confirm');
};

const cancel = () => {
    emit('cancel');
};
</script>

<style scoped>
.wrapper {
    background-color: rgba(0, 0, 0, 0.3);
}
</style>
