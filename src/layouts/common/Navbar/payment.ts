import { renderIcon } from "@/utils"
import { h } from "vue"
import { RouterLink } from "vue-router"

const DashboardIcon = "carbon:dashboard"
import PaymentOutlined from "@vicons/material/PaymentOutlined";

export default {
	label: "Payment",
	key: "Payment",
	icon: renderIcon(PaymentOutlined),
	children: [
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Payment-Index"
						}
					},
					{ default: () => "Index" }
				),
			key: "Payment-Index"
		}
	]
}
