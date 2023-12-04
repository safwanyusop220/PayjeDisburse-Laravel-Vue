import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

import VerifiedUserOutlined from "@vicons/material/VerifiedUserOutlined";

export default {
	label: "Administration",
	key: "Administration",
	icon: renderIcon(VerifiedUserOutlined),
	children: [
		// {
		// 	label: () =>
		// 		h(
		// 			RouterLink,
		// 			{
		// 				to: {
		// 					name: "Administration-System-Permission"
		// 				}
		// 			},
		// 			{ default: () => "System Permission" }
		// 		),
		// 	key: "Administration-System-Permission"
		// },
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Administration-System-Role"
						}
					},
					{ default: () => "System Role" }
				),
			key: "Administration-System-Role"
		},
		// {
		// 	label: () =>
		// 		h(
		// 			RouterLink,
		// 			{
		// 				to: {
		// 					name: "Administration-System-Role-Permission"
		// 				}
		// 			},
		// 			{ default: () => "System Role Permission" }
		// 		),
		// 	key: "Administration-System-Role-Permission"
		// },
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Administration-System-User"
						}
					},
					{ default: () => "System User" }
				),
			key: "Administration-System-User"
		}
	]
}
