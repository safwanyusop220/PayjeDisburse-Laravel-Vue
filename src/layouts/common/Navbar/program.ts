import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

import DvrFilled from "@vicons/material/DvrFilled";


export default {
	label: "Program",
	key: "Program",
	icon: renderIcon(DvrFilled),
	children: [
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Program-Index"
						}
					},
					{ default: () => "All" }
				),
			key: "Program-Index"
		},
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Program-Recommendation"
						}
					},
					{ default: () => "Recommendation" }
				),
			key: "Program-Recommendation"
		},
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Program-Approval"
						}
					},
					{ default: () => "Approval" }
				),
			key: "Program-Approval"
		}
	]
}
