import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

import VerifiedUserOutlined from "@vicons/material/VerifiedUserOutlined";
import { useAuthStore } from "@/stores/auth"
interface ChildItem {
	label: () => any;
	key: string;
}
export default  (function programNavItems() {
	const isAllowed = useAuthStore().isAllowed;

	const children: ChildItem[] = [];
	if (isAllowed('view_role')) {
		children.splice(0, 0, {
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
	})}
	if (isAllowed('view_user')) {
		children.splice(1, 0, {
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
	})}

	return {
        label: "Administration",
        key: "Administration",
        icon: renderIcon(VerifiedUserOutlined),
        children
    };
})


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