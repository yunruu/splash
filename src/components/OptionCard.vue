<template>
    <div
        class="w-full border rounded-lg border-gray-200 bg-gray-100 flex justify-between my-2 p-3 hover:cursor-pointer active:border-2 active:border-rose-600"
        @click="toggleOption"
    >
        <span>{{ props.label }}</span>
        <img v-if="isSelected" src="/icons/selected-tick.svg" alt="Selected" class="h-5 w-5" />
        <img v-else src="/icons/unselected-tick.svg" alt="Selected" class="h-5 w-5" />
    </div>
</template>

<script setup>
import { defineProps, defineEmits, ref } from 'vue';

const props = defineProps(['label', 'id']);
const emit = defineEmits(['toggleOption']);
const isSelected = ref(false);

const toggleOption = () => {
    isSelected.value = !isSelected.value;
    emit('toggleOption', props.id, isSelected);
};
</script>
