<template>
    <div
        class="my-5 flex flex-col gap-2 border rounded-xl border-gray-200 hover:border-rose-500 hover:border-2 hover:cursor-pointer"
        @click="$emit('click')"
    >
        <div class="border-b p-3 flex justify-between">
            <span class="text-2xl font-bold capitalize">{{ props.name }}</span>
            <div class="flex gap-1">
                <img
                    src="/icons/edit.svg"
                    alt="Edit"
                    class="w-7 h-7 p-1 mr-2 hover:bg-gray-100 rounded active:border-2 active:border-rose-600"
                    @click="updateGroup"
                />
                <img
                    src="/icons/delete.svg"
                    alt="Delete"
                    class="w-7 h-7 p-1 hover:bg-gray-100 rounded active:border-2 active:border-rose-600"
                    @click="onClickDeleteGroup"
                />
            </div>
        </div>
        <div class="p-3 pt-0">
            <span class="text">{{ props.description || 'No description' }}</span>
            <div class="flex overflow-hidden mt-3">
                <img src="/icons/group.svg" alt="Group members" class="rounded-full w-5 h-5 mr-3" />
                <span
                    v-for="member in props.members"
                    :key="member"
                    class="ml-1 mr-1 text-gray-500 text-xs"
                >
                    {{ member }}
                </span>
            </div>
        </div>
    </div>

    <MessageDialog
        v-if="message.isOpen"
        :title="message.title"
        :message="message.message"
        :is-cancel="true"
        :show-overlay="message.showOverlay"
        @cancel="message.isOpen = false"
        @confirm="handleDeleteGroup"
    />
</template>

<script setup>
import { defineEmits, defineProps, ref } from 'vue';
import MessageDialog from './MessageDialog.vue';
import { deleteGroup } from '../api/group';

const props = defineProps(['name', 'description', 'members', 'id']);
const emit = defineEmits(['click', 'update', 'delete']);

const message = ref({
    title: '',
    message: '',
    isOpen: false
});

const onClickDeleteGroup = (e) => {
    e.stopPropagation();
    message.value = {
        title: 'Delete group',
        message: 'Are you sure you want to delete this group?',
        showOverlay: true,
        isOpen: true
    };
};

const handleDeleteGroup = async () => {
    try {
        const res = await deleteGroup(props.id);
        if (res.error) throw new Error(res.error);
        emit('delete');
    } catch (error) {
        message.value = {
            title: 'Error',
            message: 'Failed to delete group',
            showOverlay: true,
            isOpen: true
        };
    }
};

const updateGroup = (e) => {
    e.stopPropagation();
    emit('update', props.id);
};
</script>
