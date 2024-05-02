<template>
    <div class="modal-wrapper">
        <div class="modal bg-white rounded-xl px-4 py-6 w-100">
            <div class="relative w-full">
                <div
                    v-if="props.title"
                    class="text-2xl font-bold pb-4 border-b border-slate-200 mb-6"
                >
                    {{ props.title }}
                </div>
                <button @click="closeModal" class="absolute right-1">
                    <img
                        src="/icons/close.svg"
                        alt="Close expense form icon"
                        class="cursor-pointer h-7 hover:bg-gray-100 rounded active:border-2 active:border-rose-600 active:bg-transparent"
                    />
                </button>
            </div>
            <slot></slot>
        </div>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const emit = defineEmits(['close']);
const props = defineProps(['title']);

const closeModal = () => {
    emit('close');
};
</script>

<style scoped>
.modal-wrapper {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: var(--modal-z-index);
}
.modal {
    min-height: 70%;
    max-height: calc(90vh - var(--nav-height));
    overflow-y: auto;
    width: 90%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
}
</style>
