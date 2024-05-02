<template>
    <CustomModal title="Settle up" @close="closeModal">
        <div class="flex flex-col gap-4">
            <div class="flex gap-2 items-center">
                <img
                    src="../assets/icons/book.svg"
                    alt="Settle expenses"
                    class="w-5 h-5 inline-block"
                />
                <span class="font-semibold">Full settlement</span>
            </div>
            <ul class="ml-4 overflow-x-auto flex flex-col gap-2">
                <li v-for="debt in props.data" :key="debt.id" class="flex gap-2">
                    <span>{{ debt.from }}</span>
                    <span class="text-slate-400">owes</span>
                    <span>{{ debt.to }}</span>
                    <div class="flex items-center gap-1">
                        <span class="text-xs font-semibold text-slate-500"
                            >{{ debt.currency }}
                        </span>
                        {{ roundOff(debt.amount) }}
                    </div>
                </li>
            </ul>

            <div class="flex gap-2 items-center mt-4">
                <img
                    src="../assets/icons/piggy-bank.svg"
                    alt="Settle expenses"
                    class="w-5 h-5 piggy-icon"
                />
                <span class="font-semibold">You owe</span>
            </div>
            <ul class="ml-4 overflow-x-auto flex flex-col gap-2">
                <li v-for="debt in ownDebts" :key="debt.id" class="flex gap-2">
                    <span>{{ debt.to }}:</span>
                    <div class="flex items-center gap-1">
                        <span class="text-xs font-semibold text-slate-500"
                            >{{ debt.currency }}
                        </span>
                        {{ roundOff(debt.amount) }}
                    </div>
                </li>
            </ul>
        </div>
        {{ currDebts }}
    </CustomModal>
</template>

<script setup>
import { ref, defineEmits, defineProps, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import CustomModal from './CustomModal.vue';

const props = defineProps(['data']);
const emit = defineEmits(['close']);
const store = useStore();
const username = ref('');
const isOwnDebtPopulated = ref(false);
const ownDebts = ref([]);

onMounted(() => {
    username.value = store.getters.getUsername;
});

watch(
    () => props.data,
    (newData) => {
        if (isOwnDebtPopulated.value) return;
        ownDebts.value = newData.filter((debt) => debt.from === username.value);
        isOwnDebtPopulated.value = true;
    }
);

const closeModal = () => {
    emit('close');
};

const roundOff = (num) => {
    return Math.round((num + Number.EPSILON) * 100) / 100;
};
</script>

<style scoped>
.piggy-icon {
    filter: invert(0.5) sepia(1) saturate(3) brightness(0.3) hue-rotate(175deg);
}
</style>
