<template>
    <GroupCard
        v-for="group in groupsData"
        :key="group.id"
        :name="group.name"
        :description="group.description"
        :members="group.profiles"
        class="mb-3"
        @click="onClickViewGroup(group.id)"
    />
    <button
        class="bg-rose-800 px-4 py-2 text-white text font-semibold rounded-full fixed bottom-20 right-8"
        @click="onClickCreateGroup"
    >
        + New group
    </button>

    <GroupFormCard v-if="isCreateModalOpen" @closeModal="closeGroupModal" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { getGroups } from '../api/group';
import GroupCard from '../components/GroupCard.vue';
import GroupFormCard from '../components/GroupFormCard.vue';

const router = useRouter();

const groupsData = ref([]);
const isCreateModalOpen = ref(false);

const onClickCreateGroup = () => {
    isCreateModalOpen.value = true;
};

const closeGroupModal = () => {
    fetchGroups();
    isCreateModalOpen.value = false;
};

const fetchGroups = async () => {
    try {
        groupsData.value = await getGroups('admin', false);
    } catch (error) {
        console.error(error);
    }
};

const onClickViewGroup = (groupId) => {
    router.push(`/group/${groupId}`);
};

onMounted(async () => {
    await fetchGroups();
});
</script>
