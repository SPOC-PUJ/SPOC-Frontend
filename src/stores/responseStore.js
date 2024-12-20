import { defineStore } from 'pinia';

export const useResponseStore = defineStore('responseStore', {
    state: () => ({
        signalResponse: null,
        originalSignal: null,
        fastFourierTransformDecLevelIndex: 0,
    }),
    actions: {
        setSignalResponse(response) {
            this.signalResponse = response;
        },
        setOriginalSignal(signal) {
            this.originalSignal = signal;
        },
        setDecLevelIndex(index) {
            this.fastFourierTransformDecLevelIndex = index;
        },
    },
});
