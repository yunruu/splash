<template>
    <div class="banner bg-rose-700"></div>
    <img
        src="/icons/left-arrow.svg"
        alt="Return to groups button"
        class="w-8 fixed top-8 -ml-1 z-[100] hover:cursor-pointer rounded hover:border hover:border-rose-300 active:border-2"
        @click="routeToGroups"
    />
    <div class="flex flex-col w-full">
        <div class="header flex flex-col gap-2">
            <span class="capitalize text-2xl font-bold">{{ groupData.name }}</span>
            <div class="flex gap-2 items-center mt-4">
                <img src="/icons/description.svg" alt="Group image" class="w-5 h-5 rounded-full" />
                <span class="">{{ groupData.description || 'No description' }}</span>
            </div>
            <div class="flex gap-2 items-center">
                <img src="/icons/group.svg" alt="Profiles image" class="w-5 h-5 rounded-full" />
                <span class=""> {{ groupData.profiles?.length || 0 }} members</span>
            </div>
        </div>
        <div class="body mt-2">
            <ExpenseCard
                v-for="expense in expenses"
                :key="expense.id"
                :amount="expense.amount"
                :expense="expense"
                class="mt-4"
                @open-expense-form-modal="updateExpense"
            />
            <div v-if="expenses.length === 0" class="text-center mt-12">
                <img src="/icons/empty.svg" alt="No expenses" class="w-20 h-20 mx-auto mb-6" />
                <span class="text-slate-400 font-semibold">No expenses created. Add one now!</span>
            </div>
        </div>
        <button
            class="bg-rose-800 px-4 py-2 text-white text font-semibold rounded-full fixed bottom-20 right-8 active:border-2 active:border-rose-400 hover:cursor-pointer hover:bg-rose-900"
            @click="openExpenseModal(false)"
        >
            + New expense
        </button>
        <ExpenseFormCard
            v-if="isExpenseModalOpen"
            :group-id="groupId"
            :is-update="isUpdateExpense"
            :expense="expenseToUpdate"
            @close-modal="closeExpenseModal"
        />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { getGroupData } from '../api/group';
import { useRoute, useRouter } from 'vue-router';
import { getAllExpensesOfGroup } from '@/api/expense';
import ExpenseFormCard from '../components/ExpenseFormCard.vue';
import ExpenseCard from '../components/ExpenseCard.vue';

const route = useRoute();
const router = useRouter();
const groupId = route.params.id;
const groupData = ref({});
const isExpenseModalOpen = ref(false);
const isUpdateExpense = ref(false);
const expenseToUpdate = ref({});
const expenses = ref([]);

onMounted(async () => {
    try {
        groupData.value = (await getGroupData(groupId)).data;
        await fetchExpenses();
    } catch (error) {
        console.error(error);
    }
});

const routeToGroups = () => {
    router.push('/groups');
};

const openExpenseModal = (isUpdate) => {
    isUpdateExpense.value = isUpdate;
    isExpenseModalOpen.value = true;
};

const closeExpenseModal = () => {
    fetchExpenses();
    isExpenseModalOpen.value = false;
};

const fetchExpenses = async () => {
    try {
        const res = await getAllExpensesOfGroup(groupId);
        if (!res.data) {
            throw new Error('No expenses found');
        }
        expenses.value = res.data;
    } catch (error) {
        console.error(error);
        return { error: error.message };
    }
};

const updateExpense = (expense) => {
    expenseToUpdate.value = expense;
    openExpenseModal(true);
};
</script>

<style scoped>
.banner {
    width: 100%;
    height: 12vh;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 99;
}
.header {
    margin-top: 14vh;
}
.body {
    padding-bottom: var(--nav-height);
}
</style>
