<template>
    <div
        class="flex hover:cursor-pointer hover:border-2 hover:rounded-xl hover:border-rose-500"
        @click="openExpenseFormModal"
    >
        <div
            class="bg-rose-600 rounded-l-lg p-3 text-white font-bold h-full flex items-center text-center w-12"
        >
            {{ getDate(expense.timestamp) }}
        </div>
        <div class="border rounded-r-xl py-2 px-3 flex-grow flex items-center">
            <div class="flex flex-col flex-grow">
                <div class="capitalize">{{ expense.name }}</div>
                <div class="text-xs text-gray-500 italic">
                    {{ expense.description || 'No description' }}
                </div>
            </div>
            <div class="flex gap-1">
                <span>{{ expense.currency }}</span>
                <span>{{ roundToTwoDecimal(expense.amount) }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import moment from 'moment';

const { expense } = defineProps(['expense']);
const emit = defineEmits(['openExpenseFormModal']);

const getDate = (timestamp) => {
    const date = moment(timestamp.toDate());
    return date.format('MMM DD');
};

const roundToTwoDecimal = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};

const openExpenseFormModal = () => {
    emit('openExpenseFormModal', expense);
};
</script>
