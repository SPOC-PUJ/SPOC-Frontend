import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import FunctionalitiesView from "@/views/FunctionalitiesView.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),

    routes: [
        {
            path: "/",
            name: "home",
            component: HomeView,
        },
        {
            path: "/functionalities",
            name: "functionalities",
            component: FunctionalitiesView,
        },
    ],
});

export default router;