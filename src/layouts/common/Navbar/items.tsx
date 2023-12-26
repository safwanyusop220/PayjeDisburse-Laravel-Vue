import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"
import { type MenuMixedOption } from "naive-ui/es/menu/src/interface"
import administration from "./administration"
import program from "./program"
import receipient from "./receipient"

import PaymentOutlined from "@vicons/material/PaymentOutlined";
import DashboardCustomizeOutlined from "@vicons/material/DashboardCustomizeOutlined";
import ChecklistSharp from "@vicons/material/ChecklistSharp";
import EventNoteOutlined from "@vicons/material/EventNoteOutlined";
import StickyNote2Outlined from "@vicons/material/StickyNote2Outlined";
import { useAuthStore } from "@/stores/auth"

export default function getItems(mode: "vertical" | "horizontal", collapsed: boolean): MenuMixedOption[] {
    const isAllowed = useAuthStore().isAllowed;

	const navItems = [
		{
            label: () => h(
                RouterLink,
                {
                    to: {
                        name: "dashboards"
                    }
                },
                { default: () => "Dashboards" } // This is already correct
            ),
            key: "dashboards",
            icon: renderIcon(DashboardCustomizeOutlined)
        },
	];

    if (isAllowed('view_role') || isAllowed('view_user')) {
        navItems.splice(1, 0, administration())
    }

    if (isAllowed('view_bank_panel')) {
        navItems.splice(2, 0, {
            label: () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: "bankPanel"
                        }
                    },
                    { default: () => "Bank Panel" }
                ),
            key: "bankPanel",
			icon: renderIcon(StickyNote2Outlined),            
        })
    }

    if (isAllowed('view_program') || isAllowed('approver_program') || isAllowed('recommender_program')) {
        navItems.splice(3, 0, program())
    }

    if (isAllowed('view_recipient') || isAllowed('approver_recipient') || isAllowed('recommender_recipient')) {
        navItems.splice(4, 0, receipient())
    }

    if (isAllowed('view_payment')) {
        navItems.splice(5, 0, {
            label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "Payment-Index"
                    }
                },
                { default: () => "Payment" }
            ),
        key: "Payment-Index",
        icon: renderIcon(PaymentOutlined)
        })
    }
    if (isAllowed('view_audit_trail')) {
        navItems.splice(6, 0, {
            label: () =>
            h(
                RouterLink,
                {
                    to: {
                        name: "auditTrail"
                    }
                },
                { default: () => "Audit Trail" }
            ),
        key: "auditTrail",
        icon: renderIcon(ChecklistSharp)
        })}


    return navItems;
}
        // {
        //     label: () =>
        //         h(
        //             RouterLink,
        //             {
        //                 to: {
        //                     name: "report"
        //                 }
        //             },
        //             { default: () => "Report" }
        //         ),
        //     key: "report",
		// 	icon: renderIcon(EventNoteOutlined)

        // },