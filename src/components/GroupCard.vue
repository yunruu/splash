<template>
    <div
        class="flex flex-col gap-2 border rounded-xl border-gray-200 hover:border-rose-500 hover:border-2 hover:cursor-pointer active:bg-slate-50"
    >
        <span class="text-2xl font-bold capitalize border-b p-3">{{ props.name }}</span>
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
</template>

<script setup>
const props = defineProps(['name', 'description', 'members']);
</script>
