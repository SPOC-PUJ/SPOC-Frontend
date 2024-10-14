import { defineStore } from 'pinia';

export const useResponseStore = defineStore('responseStore', {
    state: () => ({
        signalResponse: null,
        fastFourierTransformDecLevelIndex: 0,
    }),
    actions: {
        setSignalResponse(response) {
            this.signalResponse = response;
        },
        setDecLevelIndex(index) {
            this.fastFourierTransformDecLevelIndex = index;
        },
    },
});
