<template>
    <div class="modal-wrapper">
        <div class="modal w-100 bg-white px-4 py-6 rounded">
            <div class="py-2 px-1 border-b w-full flex justify-between items-center">
                <span class="text-xl font-bold">New group</span>
                <img
                    src="/icons/close.svg"
                    alt="Close"
                    class="cursor-pointer h-7 hover:bg-gray-100 rounded active:border-2 active:border-rose-600"
                    @click="closeModal"
                />
            </div>

            <form class="flex-grow flex flex-col gap-4 mt-4 h-full justify-between">
                <div class="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Group name"
                        v-model="groupName"
                        class="border rounded px-2 py-1"
                    />
                    <textarea
                        placeholder="Group description"
                        v-model="groupDescription"
                        class="border rounded px-2 py-1"
                    ></textarea>
                    <div>
                        <div class="flex ml-1 my-1">
                            <img
                                src="/icons/group.svg"
                                alt="Group members"
                                class="rounded-full w-5 h-5 mr-3"
                            />
                            <span class="text-xs text-gray-500 font-semibold">Members</span>
                        </div>
                        <div class="members-list">
                            <ul class="mt-3">
                                <li
                                    v-for="member in members"
                                    :key="member"
                                    class="ml-1 mr-1 text-gray-500 text-sm"
                                >
                                    <OptionCard
                                        :label="member"
                                        :id="member"
                                        @toggle-option="onToggleOption"
                                    />
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="w-full">
                    <span v-if="isError" class="text-red-500">{{ errMsg }}</span>
                    <button
                        type="submit"
                        class="bg-rose-800 text-white font-semibold rounded py-2 w-full mt-2"
                        @click="onClickCreateGroup"
                    >
                        Create group
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, onMounted } from 'vue';
import { getAllProfiles } from '@/api/profile';
import OptionCard from './OptionCard.vue';
import { createGroup } from '@/api/group';

const emit = defineEmits(['closeModal']);
const members = ref();
const groupName = ref('');
const groupDescription = ref('');
const membersInGroup = ref([]);
const isError = ref(false);
const errMsg = ref('');

onMounted(async () => {
    members.value = await getAllProfiles();
});

const closeModal = () => {
    emit('closeModal');
};

const onToggleOption = (id, isSelected) => {
    if (isSelected.value) {
        membersInGroup.value.push(id);
    } else {
        membersInGroup.value = membersInGroup.value.filter((member) => member !== id);
    }
};

const onClickCreateGroup = async (e) => {
    e.preventDefault();
    if (!groupName.value) {
        isError.value = true;
        errMsg.value = 'Group name is required.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
        return;
    }
    if (membersInGroup.value.length === 0) {
        isError.value = true;
        errMsg.value = 'Group must have at least one member.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
        return;
    }
    try {
        const res = await createGroup({
            name: groupName.value,
            description: groupDescription.value,
            profiles: membersInGroup.value
        });
        if (res.error) {
            throw new Error('Failed to create group: ' + res.error);
        }
        closeModal();
    } catch (error) {
        console.error(error);
        isError.value = true;
        errMsg.value = 'Error creating group. Please try again later.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
    }
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
    z-index: 100;
}
.modal {
    min-height: 70%;
    width: 90%;
    max-width: 700px;
    display: flex;
    flex-direction: column;
}
.members-list {
    max-height: 40vh;
    overflow-y: auto;
}
</style>
