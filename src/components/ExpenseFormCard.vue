<template>
    <div class="modal-wrapper">
        <div class="modal w-100 bg-white px-4 py-6 rounded">
            <div class="py-2 px-1 border-b w-full flex justify-between items-center">
                <span class="text-xl font-bold">New expense</span>
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
                            class="border rounded px-2 flex-grow"
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
                        @click="onClickCreateExpense"
                    >
                        Create expense
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted } from 'vue';
import { getMembers } from '@/api/profile';
import OptionCard from './OptionCard.vue';
import { createExpense } from '@/api/expense';
import { currencies } from '@/utils/currency';

const props = defineProps(['groupId']);
const emit = defineEmits(['closeModal']);

const members = ref();
const expenseName = ref('');
const expenseDescription = ref('');
const amount = ref(0);
const currency = ref('SGD');
const paidBy = ref('');
const splitBy = ref([]);
const isError = ref(false);
const errMsg = ref('');

const currencyOptions = ref(currencies);

onMounted(async () => {
    members.value = await getMembers(props.groupId);
});

const closeModal = () => {
    emit('closeModal');
};

const onToggleOption = (id, isSelected) => {
    if (isSelected.value) {
        splitBy.value.push(id);
    } else {
        splitBy.value = splitBy.value.filter((member) => member !== id);
    }
};

const onClickCreateExpense = async (e) => {
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
        const res = await createExpense({
            name: expenseName.value,
            description: expenseDescription.value,
            amount: amount.value,
            currency: currency.value,
            groupId: props.groupId,
            paidBy: paidBy.value,
            splitBy: splitBy.value
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
