import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

import RecentActorsOutlined from "@vicons/material/RecentActorsOutlined";
import { useAuthStore } from "@/stores/auth"

export default (function programNavItems() {

	const isAllowed = useAuthStore().isAllowed;

	const children = [
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
		}
	]

	// Conditionally add the "Recommendation" navigation item
	if (isAllowed('recommender_recipient')) {
		children.splice(1, 0, {
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
		});
	}

	// Conditionally add the "Approval" navigation item
	if (isAllowed('approver_recipient')) {
		children.splice(2, 0, {
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
		});
	}
	return {
        label: "Recipient",
        key: "Recipient",
        icon: renderIcon(RecentActorsOutlined), // Assuming renderIcon function is defined elsewhere
        children
    };
})
