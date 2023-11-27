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

export default function getItems(mode: "vertical" | "horizontal", collapsed: boolean): MenuMixedOption[] {
	return [
		{
            label: () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: "dashboards"
                        }
                    },
                    { default: () => "Dashboards" }
                ),
            key: "dashboards",
			icon: renderIcon(DashboardCustomizeOutlined)

        },
        administration,
        {
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
			icon: renderIcon(StickyNote2Outlined)

        },

        program,
        receipient,
        {
            label: () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: "payment"
                        }
                    },
                    { default: () => "Payment" }
                ),
            key: "payment",
			icon: renderIcon(PaymentOutlined)

        },
        {
            label: () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: "report"
                        }
                    },
                    { default: () => "Report" }
                ),
            key: "report",
			icon: renderIcon(EventNoteOutlined)

        },
        {
            label: () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: "aduitTrail"
                        }
                    },
                    { default: () => "Aduit Trail" }
                ),
            key: "aduitTrail",
			icon: renderIcon(ChecklistSharp)

        },



		/*{
            label: () =>
                h(
                    RouterLink,
                    {
                        to: {
                            name: "new-page"
                        }
                    },
                    { default: () => "New Page" }
                ),
            key: "new-page",
			icon: renderIcon(DashboardIcon)

        }*/
	]
}
