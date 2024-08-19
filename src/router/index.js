import { createRouter, createWebHistory } from "vue-router";

import HomeView from "@/views/HomeView.vue";
import FunctionalitiesView from "@/views/FunctionalitiesView.vue";
import NotFoundView from "@/views/NotFoundView.vue";
import FunctionalityView from "@/views/FunctionalityView.vue";

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
        {
            path: "/functionalities/:id",
            name: "specific-functionality",
            component: FunctionalityView,
        },
        {
            path: "/:catchAll(.*)",
            name: "not-found",
            component: NotFoundView,
        },
    ],
});

export default router;