import { defineStore } from 'pinia';

export const useResponseStore = defineStore('responseStore', {
    state: () => ({
        signalResponse: null,
        fastFourierTransformIndex: 0,
    }),
    actions: {
        setSignalResponse(response) {
            this.signalResponse = response;
        },
    },
});
