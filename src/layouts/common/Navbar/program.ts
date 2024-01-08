import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

import DvrFilled from "@vicons/material/DvrFilled";
import { useAuthStore } from "@/stores/auth"


export default (function programNavItems() {
    const isAllowed = useAuthStore().isAllowed;

    const children = [
        {
            label: () => h(
                RouterLink,
                {
                    to: {
                        name: "Program-Index"
                    }
                },
                { default: () => "All" }
            ),
            key: "Program-Index"
        }
    ];

    if (isAllowed('recommender_program')) {
        children.splice(1, 0, {
            label: () => h(
                RouterLink,
                {
                    to: {
                        name: "Program-Recommendation"
                    }
                },
                { default: () => "Recommendation" }
            ),
            key: "Program-Recommendation"
        });
    }

    if (isAllowed('approver_program')) {
        children.splice(2, 0, {
            label: () => h(
                RouterLink,
                {
                    to: {
                        name: "Program-Approval"
                    }
                },
                { default: () => "Approval" }
            ),
            key: "Program-Approval"
        });
    }


    return {
        label: "Program",
        key: "Program",
        icon: renderIcon(DvrFilled), // Assuming renderIcon function is defined elsewhere
        children
    };
})
