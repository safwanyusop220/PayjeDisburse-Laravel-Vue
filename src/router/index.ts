import { createRouter, createWebHistory } from "vue-router"
// import Analytics from "@/views/Dashboard/Analytics.vue"
import components from "./components"
import { Layout } from "@/types/theme.d"
import { authCheck } from "@/utils/auth"
import { useAuthStore } from "@/stores/auth"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: "/Sign-In"
		},
		// Dashboard
		{
            path: "/Sign-In",
            name: "Sign-In",
			component: () => import("@/views/Auth/Login.vue"),
            meta: { title: "Sign-In", forceLayout: Layout.Blank, }
        },
		//Authentication
		{
			path: "/login",
			name: "login",
			component: () => import("@/views/Auth/Login.vue"),
			meta: { title: "login", forceLayout: Layout.Blank, checkAuth: true }
		},
		{
			path: "/logout",
			name: "Logout",
			redirect: "/Sign-In"
		},
		{
			path: "/:pathMatch(.*)*",
			name: "NotFound",
			component: () => import("@/views/NotFound.vue"),
			meta: { forceLayout: Layout.Blank }
		},
		// Dashboard
		{
            path: "/dashboards",
            name: "dashboards",
            component: () => import("@/views/Dashboards/Index.vue"),
            meta: { title: "Dashboards", auth: true }
        },
		// Administration
		{
			path: "/administration/system",
			redirect: "/administration/role",
			meta: {},
			children: [
				// {
				// 	path: "permission",
				// 	name: "Administration-System-Permission",
				// 	component: () => import("@/views/Administration/SystemPermission.vue"),
				// 	meta: { title: "System Permission", auth: true }
				// },
				{
					path: "role",
					name: "Administration-System-Role",
					component: () => import("@/views/Administration/SystemRole.vue"),
					meta: { title: "System Role", auth: true, permission: "view_role"  }
				},
				// {
				// 	path: "rolePermission",
				// 	name: "Administration-System-Role-Permission",
				// 	component: () => import("@/views/Administration/SystemRolePermission.vue"),
				// 	meta: { title: "System Role Permission", auth: true }
				// },
				{
					path: "user",
					name: "Administration-System-User",
					component: () => import("@/views/Administration/SystemUser.vue"),
					meta: { title: "System User", auth: true, permission: "view_user" }
				}
			]
		},
		// User Account
		{
            path: "/user-account/account",
            name: "userAccount",
            component: () => import("@/views/UserAccount/Index.vue"),
            meta: { title: "userAccount"}
        },
		{
            path: "/user-account/change-password",
            name: "changePassword",
            component: () => import("@/views/UserAccount/ChangePassword.vue"),
            meta: { title: "changePassword"}
        },
		// Bank Panel
		{
            path: "/bank-panel",
            name: "bankPanel",
            component: () => import("@/views/BankPanel/Index.vue"),
            meta: { title: "bankPanel", auth: true, permission: "view_bank_panel" }
        },
		{
			path: "/bank-panel/edit/:id?",
			name: "Bank-Panel-Edit",
			component: () => import("@/views/BankPanel/Edit.vue"),
			meta: { title: "Edit", auth: true, permission: "update_bank_panel" }
		},
		// Program
		{
			path: "/program",
			redirect: "/program",
			meta: {},
			children: [
				{
					path: "all",
					name: "Program-Index",
					component: () => import("@/views/Program/Index.vue"),
					meta: { title: "Index" , auth: true, permission: "view_program" }
				},
				{
					path: "recommendation",
					name: "Program-Recommendation",
					component: () => import("@/views/Program/Recommendation.vue"),
					meta: { title: "Recommendation", auth: true, permission: "recommender_program" }
				}
				,
				{
					path: "approval",
					name: "Program-Approval",
					component: () => import("@/views/Program/Approval.vue"),
					meta: { title: "Approval", auth: true, permission: "approver_program" }
				},
				{
					path: "edit/:id?",
					name: "Program-Edit",
					component: () => import("@/views/Program/Edit.vue"),
					meta: { title: "Edit", auth: true, permission: "update_program" }
				},
			]
		},
		// Receipient
		{
			path: "/receipient",
			redirect: "/receipient",
			meta: {},
			children: [
				{
					path: "all",
					name: "Receipient-Index",
					component: () => import("@/views/Receipient/Index.vue"),
					meta: { title: "Index", auth: true, permission: "view_recipient" }
				},
				{
					path: "recommendation",
					name: "Receipient-Recommendation",
					component: () => import("@/views/Receipient/Recommendation.vue"),
					meta: { title: "Recommendation", auth: true, permission: "recommender_recipient" }
				}
				,
				{
					path: "approval",
					name: "Receipient-Approval",
					component: () => import("@/views/Receipient/Approval.vue"),
					meta: { title: "Approval", auth: true, permission: "approver_recipient" }
				},
				{
					path: "edit/:id?",
					name: "Receipient-Edit",
					component: () => import("@/views/Receipient/Edit.vue"),
					meta: { title: "Edit", permission: "update_recipient" }
				},
			]
		},
		//Payment
		{
			path: "/payment",
			redirect: "/payment",
			meta: {},
			children: [
				{
					path: "all",
					name: "Payment-Index",
					component: () => import("@/views/Payment/Index.vue"),
					meta: { title: "payment", auth: true, permission: "view_payment" }
				},
				{
					path: "recipient-list/:id?",
					name: "Receipient-List",
					component: () => import("@/views/Payment/RecipientList.vue"),
					meta: { title: "RecipientList" }
				}
			]
		},
		// Audit Trails
		{
            path: "/audit-trail",
            name: "auditTrail",
            component: () => import("@/views/AuditTrail/Index.vue"),
            meta: { title: "aduitTrail", auth: true, permission: "view_audit_trail" }
        },
		components,
		// Report
		// {
        //     path: "/report",
        //     name: "report",
        //     component: () => import("@/views/Report/Index.vue"),
        //     meta: { title: "payment" }
        // },
	]
})

router.beforeEach(route => {
	return authCheck(route)
})

export default router
