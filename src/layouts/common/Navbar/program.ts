import { renderIcon } from "@/utils"
import { h, onMounted, reactive, ref } from "vue"
import { RouterLink, useRoute } from "vue-router"
import DvrFilled from "@vicons/material/DvrFilled";
import { useAuthStore } from "@/stores/auth"
import axios from 'axios';

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
        const route = useRoute(); 
        
        children.splice(1, 0, {
            label() {
                return h(
                    'div', 
                    {
                        class: "flex items-center"
                    },
                    [
                        h(
                            RouterLink,
                            {
                                to: {
                                    name: "Program-Recommendation"
                                },
                            },
                            { default: () => "Recommendation" }
                        ),
                        h('p', {
                            style: {
                                backgroundColor: route.name === "Program-Recommendation" ? "#ffff" : "#e5f7f2",
                                color: route.name === "Program-Recommendation" ? "#27be8f" : "#27be8f"
                            },
                            class: "ml-1.5 text-sm rounded-full h-6 w-6 flex items-center  justify-center"
                        }, 2)
                    ]
                );
            },
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
        icon: renderIcon(DvrFilled),
        children,
    };
})
