import { defineStore } from 'pinia';

export const useSignalStore = defineStore('signal', {
    state: () => ({
        signalObject: null,
        signalJson: [],
        signalSelected: 0,
        signalResponse: null,
    }),
    actions: {
        setSignalObject(obj) {
            this.signalObject = obj;
        },
        setSignalJson(objJson) {
            this.signalJson = objJson;
        },
        setSignalSelected(index) {
            this.signalSelected = index;
        },
        setSignalResponse(response) {
            this.signalResponse = response; // Corrected this line
        },
    },
});
