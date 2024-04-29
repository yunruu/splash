<template>
    <div class="flex">
        <div class="rounded-lg">
            <div
                class="bg-rose-600 rounded-l-lg p-3 text-white font-bold h-full flex items-center text-center w-12"
            >
                {{ getDate(expense.timestamp) }}
            </div>
        </div>
        <div class="border rounded-r py-2 px-3 flex-grow flex items-center">
            <div class="flex flex-col flex-grow">
                <div class="capitalize">{{ expense.name }}</div>
                <div class="text-xs text-gray-500 italic">
                    {{ expense.description || 'No description' }}
                </div>
            </div>
            <div class="flex gap-1">
                <span>{{ expense.currency }}</span>
                <span>{{ expense.amount }}</span>
            </div>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
import moment from 'moment';

const { expense } = defineProps(['expense']);

const getDate = (timestamp) => {
    const date = moment(timestamp.toDate());
    return date.format('MMM DD');
};
</script>
