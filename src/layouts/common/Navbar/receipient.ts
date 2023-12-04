import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

import RecentActorsOutlined from "@vicons/material/RecentActorsOutlined";

export default {
	label: "Recipient",
	key: "Receipient",
	icon: renderIcon(RecentActorsOutlined),
	children: [
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Receipient-Index"
						}
					},
					{ default: () => "All" }
				),
			key: "Receipient-Index"
		},
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Receipient-Recommendation"
						}
					},
					{ default: () => "Recommendation" }
				),
			key: "Receipient-Recommendation"
		},
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Receipient-Approval"
						}
					},
					{ default: () => "Approval" }
				),
			key: "Receipient-Approval"
		}
	]
}
