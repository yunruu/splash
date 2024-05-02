<template>
    <GroupCard
        v-for="group in groupsData"
        :key="group.id"
        :name="group.name"
        :description="group.description"
        :id="group.id"
        :members="group.profiles"
        @click="onClickViewGroup(group.id)"
        @update="updateGroup"
        @delete="handleDeleteGroup"
    />
    <button
        class="bg-rose-800 px-4 py-2 text-white text font-semibold rounded-full fixed bottom-20 right-8"
        @click="onClickCreateGroup"
    >
        + New group
    </button>

    <GroupFormCard v-if="isCreateModalOpen" @closeModal="closeGroupModal" />
    <GroupFormCard
        v-if="updateGroupModal.isOpen"
        :groupData="updateGroupModal.data"
        @closeModal="closeGroupModal"
    />
    <MessageDialog
        v-if="message.isOpen"
        :title="message.title"
        :message="message.message"
        :is-cancel="false"
        :icon="message.icon"
        @confirm="message.isOpen = false"
    />
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { getGroups } from '../api/group';
import GroupCard from '../components/GroupCard.vue';
import GroupFormCard from '../components/GroupFormCard.vue';
import MessageDialog from '../components/MessageDialog.vue';

const router = useRouter();
const store = useStore();

const groupsData = ref([]);
const isCreateModalOpen = ref(false);
const updateGroupModal = ref({ isOpen: false, groupId: '', data: {} });
const message = ref({ title: '', message: '', isOpen: false });

const onClickCreateGroup = () => {
    isCreateModalOpen.value = true;
};

const closeGroupModal = (isSuccess, msg) => {
    fetchGroups();
    isCreateModalOpen.value = false;
    updateGroupModal.value = { isOpen: false, groupId: '', data: {} };
    if (isSuccess) {
        message.value = {
            title: 'Success',
            message: msg,
            isOpen: true,
            icon: '/icons/green-tick.svg'
        };
    }
};

const fetchGroups = async () => {
    try {
        groupsData.value = await getGroups(store.getters.getUsername, false);
    } catch (error) {
        console.error(error);
    }
};

const updateGroup = (groupId) => {
    updateGroupModal.value = {
        isOpen: true,
        groupId,
        data: groupsData.value.find((group) => group.id === groupId)
    };
};

const onClickViewGroup = (groupId) => {
    router.push(`/group/${groupId}`);
};

const handleDeleteGroup = () => {
    fetchGroups();
    message.value = {
        title: 'Success',
        message: 'Group deleted successfully',
        isOpen: true,
        icon: '/icons/green-tick.svg'
    };
};

onBeforeMount(() => {
    const user = store.getters.getUsername;
    if (!user) {
        router.push('/profile');
    }
});

onMounted(async () => {
    await fetchGroups();
});
</script>
