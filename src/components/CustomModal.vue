<template>
    <div class="modal-wrapper">
        <div class="modal bg-white rounded-xl px-4 py-6 w-100">
            <slot></slot>
        </div>
    </div>
</template>

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
</style>
