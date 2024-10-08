import { defineStore } from 'pinia';

export const useDataStore = defineStore('dataStore', {
    state: () => ({
        approximations: [],
        details: [],
        response: null, // Añadir una propiedad para almacenar la respuesta
    }),
    actions: {
        setApproximations(data) {
            this.approximations = data;
        },
        setDetails(data) {
            this.details = data;
        },
        setResponse(response) {
            this.response = response;
        },
        clearStore() {
            this.approximations = [];
            this.details = [];
            this.response = null;
        }
    },
    getters: {
        getApproximations: (state) => state.approximations,
        getDetails: (state) => state.details,
        getResponse: (state) => state.response, 
    },
});
