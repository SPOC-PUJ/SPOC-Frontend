import { defineStore } from 'pinia';

export const useResponseStore = defineStore('responseStore', {
    state: () => ({
        response: null,
    }),
    actions: {
        setResponse(response) {
            this.response = response;
        },
        clearStore() {
            this.response = null;
        }
    },
});
