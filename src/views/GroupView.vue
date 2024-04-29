<script setup>
import { ref, onMounted } from 'vue';
import { getGroups } from '../api/group';

const groupsData = ref([]);

const createGroup = () => {
    console.log('Create group');
};

// onMounted(async () => {
//     try {
//         groupsData.value = await getGroups('admin', false);
//         console.log(groupsData.value);
//     } catch (error) {
//         console.error(error);
//     }
// });
</script>

<template>
    <div class="flex items-center justify-center">
        <button
            class="bg-indigo-500 px-4 py-2 text-white font-semibold rounded-full"
            @click="createGroup"
        >
            Add new group
        </button>
    </div>
</template>
