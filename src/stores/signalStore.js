import { defineStore } from 'pinia';

export const useSignalStore = defineStore('signal',{
    state: ()=>({
        signalObject:null,
    }),
    actions:{
        setSignalObject(obj){
            this.signalObject = obj;
        },
    },
});