import { defineStore } from 'pinia';

export const useResponseStore = defineStore('responseStore', {
    state: () => ({
        signalResponse: null,
    }),
    actions: {
        setSignalResponse(response) {
            this.signalResponse = response;
        },
    },
});
