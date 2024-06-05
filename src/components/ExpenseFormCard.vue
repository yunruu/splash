<template>
    <div class="modal-wrapper">
        <div class="modal w-100 bg-white px-4 py-6 rounded">
            <div class="py-2 px-1 border-b w-full flex justify-between items-center">
                <div class="flex items-center gap-3">
                    <span class="text-xl font-bold capitalize">{{
                        props.isUpdate ? props.expense?.name : 'New expense'
                    }}</span>
                    <img
                        v-if="props.isUpdate"
                        src="/icons/delete.svg"
                        alt="Delete expense icon"
                        class="h-7 w-7 p-1 hover:cursor-pointer hover:bg-slate-100 rounded active:border-2 active:border-rose-600 active:bg-transparent"
                        @click="onClickDeleteExpense"
                    />
                </div>
                <img
                    src="/icons/close.svg"
                    alt="Close expense form icon"
                    class="cursor-pointer h-7 hover:bg-gray-100 rounded active:border-2 active:border-rose-600"
                    @click="closeModal"
                />
            </div>

            <form class="flex-grow flex flex-col gap-4 mt-4 h-full justify-between">
                <div class="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Expense name"
                        v-model="expenseName"
                        class="border rounded px-2 py-1"
                    />
                    <textarea
                        placeholder="Expense description"
                        v-model="expenseDescription"
                        class="border rounded px-2 py-1"
                    ></textarea>
                    <div class="flex gap-3">
                        <select v-model="currency" class="border rounded px-2 py-1">
                            <option disabled value="">Please select one</option>
                            <option
                                v-for="option in currencyOptions"
                                :value="option.value"
                                :key="option.label"
                            >
                                {{ option.label }} ({{ option.value }})
                            </option>
                        </select>
                        <input
                            v-model="amount"
                            type="number"
                            placeholder="Amount"
                            class="border rounded px-2 flex-grow w-full"
                            min="0"
                        />
                    </div>

                    <div>
                        <div class="flex ml-1 my-1">
                            <img
                                src="/icons/pay.svg"
                                alt="Paid by"
                                class="rounded-full w-5 h-5 mr-3"
                            />
                            <span class="text-xs text-gray-500 font-semibold">Paid by</span>
                        </div>
                        <select v-model="paidBy" class="border rounded px-2 py-1 w-full mt-3">
                            <option disabled value="">Please select one</option>
                            <option v-for="member in members" :value="member" :key="member">
                                {{ member }}
                            </option>
                        </select>
                    </div>

                    <div>
                        <div class="flex ml-1 my-1">
                            <img
                                src="/icons/group.svg"
                                alt="Group members"
                                class="rounded-full w-5 h-5 mr-3"
                            />
                            <span class="text-xs text-gray-500 font-semibold">Split by</span>
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
                                        :is-selected-initial="splitBy.includes(member)"
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
                        @click="createOrUpdateExpense"
                    >
                        {{ props.isUpdate ? 'Update expense' : 'Create expense' }}
                    </button>
                </div>
            </form>
        </div>

        <MessageDialog
            v-if="isMessageDialog"
            title="Delete expense"
            message="Are you sure you want to delete this expense?"
            :is-cancel="true"
            @cancel="isMessageDialog = false"
            @confirm="onDeleteExpense"
        />
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue';
import { getMembers } from '@/api/profile';
import { createExpense, deleteExpense, updateExpense } from '@/api/expense';
import { currencies } from '@/utils/currency';
import OptionCard from './OptionCard.vue';
import MessageDialog from './MessageDialog.vue';

const props = defineProps(['groupId', 'isUpdate', 'expense']);
const emit = defineEmits(['closeModal']);

const members = ref();
const expenseName = ref('');
const expenseDescription = ref('');
const amount = ref(0);
const currency = ref('EUR');
const paidBy = ref('');
const splitBy = ref([]);
const isError = ref(false);
const errMsg = ref('');
const isMessageDialog = ref(false);
const currencyOptions = ref(currencies);

onMounted(async () => {
    members.value = await getMembers(props.groupId);
    if (props.isUpdate) {
        expenseName.value = props.expense.name;
        expenseDescription.value = props.expense.description;
        amount.value = props.expense.amount;
        currency.value = props.expense.currency;
        paidBy.value = props.expense.paidBy;
        splitBy.value = props.expense.splitBy;
    }
});

const closeModal = () => {
    isMessageDialog.value = false;
    isError.value = false;
    errMsg.value = '';
    emit('closeModal');
};

const onToggleOption = (id, isSelected) => {
    if (isSelected.value) {
        splitBy.value.push(id);
    } else {
        splitBy.value = splitBy.value.filter((member) => member !== id);
    }
};

const createOrUpdateExpense = async (e) => {
    e.preventDefault();
    if (!expenseName.value) {
        isError.value = true;
        errMsg.value = 'Expense name is required.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
        return;
    }
    if (amount.value <= 0) {
        isError.value = true;
        errMsg.value = 'Expense must be greater than 0.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
        return;
    }
    if (paidBy.value.length === 0) {
        isError.value = true;
        errMsg.value = 'Expense must have a payer.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
        return;
    }
    if (splitBy.value.length === 0) {
        isError.value = true;
        errMsg.value = 'Expense must have at least one member paying.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
        return;
    }
    try {
        const data = {
            name: expenseName.value,
            description: expenseDescription.value,
            amount: amount.value,
            currency: currency.value,
            groupId: props.groupId,
            paidBy: paidBy.value,
            splitBy: splitBy.value
        };
        const res = await (props.isUpdate
            ? updateExpense(props.expense.id, data)
            : createExpense(data));
        if (res.error) {
            throw new Error('Failed to update expense: ' + res.error);
        }
        closeModal();
    } catch (error) {
        console.error(error);
        isError.value = true;
        errMsg.value = 'Error creating expense. Please try again later.';
        setTimeout(() => {
            isError.value = false;
        }, 3000);
    }
};

const onClickDeleteExpense = () => {
    isMessageDialog.value = true;
};

const onDeleteExpense = async () => {
    try {
        const res = await deleteExpense(props.expense.id);
        if (res.error) {
            throw new Error('Failed to delete expense: ' + res.error);
        }
        closeModal();
    } catch (error) {
        console.error(error);
        isError.value = true;
        errMsg.value = 'Error deleting expense. Please try again later.';
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
    z-index: var(--modal-z-index);
}
.modal {
    min-height: 70%;
    max-height: calc(90vh - var(--nav-height));
    overflow-y: auto;
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
