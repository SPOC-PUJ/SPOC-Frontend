import { defineStore } from 'pinia';

export const useSignalStore = defineStore('signal',{
    state: ()=>({
        signalObject:null,
        signalJson:null
    }),
    actions:{
        setSignalObject(obj){
            this.signalObject = obj;
        },
        setSignalJson(objJson){
            this.signalJson = objJson;
        },
    },
});