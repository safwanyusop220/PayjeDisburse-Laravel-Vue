import { createRouter, createWebHistory } from "vue-router"
// import Analytics from "@/views/Dashboard/Analytics.vue"
import components from "./components"
import { Layout } from "@/types/theme.d"
import { authCheck } from "@/utils/auth"

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			redirect: "/login"
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
			redirect: "/login"
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
					meta: { title: "System Role", auth: true }
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
					meta: { title: "System User" }
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
            meta: { title: "bankPanel"}
        },
		{
			path: "/bank-panel/edit/:id?",
			name: "Bank-Panel-Edit",
			component: () => import("@/views/BankPanel/Edit.vue"),
			meta: { title: "Edit" }
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
					meta: { title: "Index" }
				},
				{
					path: "recommendation",
					name: "Program-Recommendation",
					component: () => import("@/views/Program/Recommendation.vue"),
					meta: { title: "Recommendation" }
				}
				,
				{
					path: "approval",
					name: "Program-Approval",
					component: () => import("@/views/Program/Approval.vue"),
					meta: { title: "Approval" }
				},
				{
					path: "edit/:id?",
					name: "Program-Edit",
					component: () => import("@/views/Program/Edit.vue"),
					meta: { title: "Edit" }
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
					meta: { title: "Index" }
				},
				{
					path: "recommendation",
					name: "Receipient-Recommendation",
					component: () => import("@/views/Receipient/Recommendation.vue"),
					meta: { title: "Recommendation" }
				}
				,
				{
					path: "approval",
					name: "Receipient-Approval",
					component: () => import("@/views/Receipient/Approval.vue"),
					meta: { title: "Approval" }
				}
			]
		},
		// Payment
		{
            path: "/payment",
            name: "payment",
            component: () => import("@/views/Payment/Index.vue"),
            meta: { title: "payment" }
        },
		// Report
		{
            path: "/report",
            name: "report",
            component: () => import("@/views/Report/Index.vue"),
            meta: { title: "payment" }
        },
		// Audit Trails
		{
            path: "/audit-trail",
            name: "auditTrail",
            component: () => import("@/views/AuditTrail/Index.vue"),
            meta: { title: "aduitTrail" }
        },
		






		/*{
            path: "/new-page",
            name: "new-page",
            component: () => import("@/views/NewPage.vue"),
            meta: { title: "New Page" }
        },*/


















		// {
		// 	path: "/",
		// 	redirect: "/dashboard/analytics"
		// },
		// {
		// 	path: "/dashboard",
		// 	redirect: "/dashboard/analytics",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "analytics",
		// 			name: "Dashboard-Analytics",
		// 			component: Analytics,
		// 			meta: { title: "Analytics" }
		// 		},
		// 		{
		// 			path: "ecommerce",
		// 			name: "Dashboard-eCommerce",
		// 			component: () => import("@/views/Dashboard/eCommerce.vue"),
		// 			meta: { title: "eCommerce" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/calendar",
		// 	name: "Apps-Calendars-FullCalendar",
		// 	component: () => import("@/views/Apps/Calendars/FullCalendar.vue"),
		// 	meta: { title: "Calendar", auth: true, roles: "all" }
		// },
		/*
		{
			path: "/calendars",
			redirect: "/calendars/vue-cal",
			meta: {
				auth: true,
				roles: "all"
			},
			children: [
				{
					path: "vue-cal",
					name: "vue-cal",
					component: () => import("@/views/Apps/Calendars/VueCal.vue"),
					meta: { title: "Vue Cal" }
				},
				{
					path: "full-calendar",
					name: "full-calendar",
					component: () => import("@/views/Apps/Calendars/FullCalendar.vue"),
					meta: { title: "Full Calendar" }
				}
			]
		},
		*/
		// {
		// 	path: "/email",
		// 	name: "Apps-Mailbox",
		// 	component: () => import("@/views/Apps/Mailbox.vue"),
		// 	meta: { title: "Email", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/chat",
		// 	name: "Apps-Chat",
		// 	component: () => import("@/views/Apps/Chat.vue"),
		// 	meta: { title: "Chat", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/kanban",
		// 	name: "Apps-Kanban",
		// 	component: () => import("@/views/Apps/Kanban.vue"),
		// 	meta: { title: "Kanban", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/notes",
		// 	name: "Apps-Notes",
		// 	component: () => import("@/views/Apps/Notes.vue"),
		// 	meta: { title: "Notes", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/typography",
		// 	name: "Typography",
		// 	component: () => import("@/views/Typography.vue"),
		// 	meta: { title: "Typography", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/cards",
		// 	redirect: "/cards/basic",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "basic",
		// 			name: "Cards-Basic",
		// 			component: () => import("@/views/Cards/Basic.vue"),
		// 			meta: { title: "Cards Basic" }
		// 		},
		// 		{
		// 			path: "ecommerce",
		// 			name: "Cards-Ecommerce",
		// 			component: () => import("@/views/Cards/Ecommerce.vue"),
		// 			meta: { title: "Cards Ecommerce" }
		// 		},
		// 		{
		// 			path: "list",
		// 			name: "Cards-List",
		// 			component: () => import("@/views/Cards/List.vue"),
		// 			meta: { title: "Cards List" }
		// 		},
		// 		{
		// 			path: "extra",
		// 			name: "Cards-Extra",
		// 			component: () => import("@/views/Cards/Extra.vue"),
		// 			meta: { title: "Cards Extra" }
		// 		},
		// 		{
		// 			path: "combo",
		// 			name: "Cards-Combo",
		// 			component: () => import("@/views/Cards/Combo.vue"),
		// 			meta: { title: "Cards Combo" }
		// 		}
		// 	]
		// },
		components,
		// {
		// 	path: "/toolbox",
		// 	redirect: "/toolbox/refresh-tool",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "refresh-tool",
		// 			name: "Toolbox-RefreshTool",
		// 			// route level code-splitting
		// 			// this generates a separate chunk (About.[hash].js) for this route
		// 			// which is lazy-loaded when the route is visited.
		// 			component: () => import("@/views/Toolbox/RefreshTool.vue"),
		// 			meta: { title: "Refresh Tool" }
		// 		},
		// 		{
		// 			path: "tour",
		// 			name: "Toolbox-Tour",
		// 			component: () => import("@/views/Toolbox/Tour.vue"),
		// 			meta: { title: "Tour" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/layout",
		// 	redirect: "/layout/left-sidebar",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "left-sidebar",
		// 			name: "Layout-LeftSidebar",
		// 			component: () => import("@/views/Layout/LeftSidebar.vue"),
		// 			meta: { title: "Left Sidebar" }
		// 		},
		// 		{
		// 			path: "right-sidebar",
		// 			name: "Layout-RightSidebar",
		// 			component: () => import("@/views/Layout/RightSidebar.vue"),
		// 			meta: { title: "Right Sidebar" }
		// 		},
		// 		{
		// 			path: "full-width",
		// 			name: "Layout-FullWidth",
		// 			component: () => import("@/views/Layout/FullWidth.vue"),
		// 			meta: { title: "Full Width" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/maps",
		// 	redirect: "/maps/google-maps",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "google-maps",
		// 			name: "Maps-GoogleMaps",
		// 			component: () => import("@/views/Maps/GoogleMaps.vue"),
		// 			meta: { title: "Google maps" }
		// 		},
		// 		{
		// 			path: "maplibre",
		// 			name: "Maps-MapLibre",
		// 			component: () => import("@/views/Maps/MapLibre.vue"),
		// 			meta: { title: "MapLibre" }
		// 		},
		// 		{
		// 			path: "leaflet",
		// 			name: "Maps-Leaflet",
		// 			component: () => import("@/views/Maps/Leaflet.vue"),
		// 			meta: { title: "Leaflet" }
		// 		},
		// 		{
		// 			path: "vectormap",
		// 			name: "Maps-VectorMap",
		// 			component: () => import("@/views/Maps/VectorMap.vue"),
		// 			meta: { title: "Vector Map" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/editors",
		// 	redirect: "/editors/quill",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "quill",
		// 			name: "Editors-Quill",
		// 			component: () => import("@/views/Editors/Quill.vue"),
		// 			meta: { title: "Quill" }
		// 		},
		// 		{
		// 			path: "tiptap",
		// 			name: "Editors-Tiptap",
		// 			component: () => import("@/views/Editors/Tiptap.vue"),
		// 			meta: { title: "Tiptap" }
		// 		},
		// 		{
		// 			path: "milkdown",
		// 			name: "Editors-Milkdown",
		// 			component: () => import("@/views/Editors/Milkdown.vue"),
		// 			meta: { title: "Milkdown" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/charts",
		// 	redirect: "/charts/apexcharts",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "apexcharts",
		// 			name: "Charts-ApexCharts",
		// 			component: () => import("@/views/Charts/ApexCharts.vue"),
		// 			meta: { title: "ApexCharts" }
		// 		},
		// 		{
		// 			path: "chartjs",
		// 			name: "Charts-ChartJS",
		// 			component: () => import("@/views/Charts/ChartJS.vue"),
		// 			meta: { title: "ChartJS" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/multi-language",
		// 	name: "MultiLanguage",
		// 	component: () => import("@/views/MultiLanguage.vue"),
		// 	meta: { title: "Multi Language", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/icons",
		// 	name: "Icons",
		// 	component: () => import("@/views/Icons.vue"),
		// 	meta: { title: "Icons", auth: true, roles: "all" }
		// },
		// {
		// 	path: "/tables",
		// 	redirect: "/tables/base",
		// 	meta: {
		// 		auth: true,
		// 		roles: "all"
		// 	},
		// 	children: [
		// 		{
		// 			path: "base",
		// 			name: "Tables-Base",
		// 			component: () => import("@/views/Tables/Base.vue"),
		// 			meta: { title: "Tables Base" }
		// 		},
		// 		{
		// 			path: "data-table",
		// 			name: "Tables-DataTable",
		// 			component: () => import("@/views/Tables/DataTable.vue"),
		// 			meta: { title: "Data Table" }
		// 		},
		// 		{
		// 			path: "grid",
		// 			name: "Tables-Grid",
		// 			component: () => import("@/views/Tables/Grid.vue"),
		// 			meta: { title: "Data Grid" }
		// 		}
		// 	]
		// },
		// {
		// 	path: "/profile",
		// 	name: "Profile",
		// 	component: () => import("@/views/Profile.vue"),
		// 	meta: { title: "Profile", auth: true, roles: "all" }
		// },


	]
})

router.beforeEach(route => {
	return authCheck(route)
})

export default router
