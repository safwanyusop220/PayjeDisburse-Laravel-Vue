import { defineStore, acceptHMRUpdate } from "pinia"
import type { Role, Roles } from "@/types/auth.d"
import _castArray from "lodash/castArray"
import axios from "axios"

// HERE YOU CAN IMPLEMENT YOUR LOGIN

export const useAuthStore = defineStore("auth", {
	state: () => ({
		logged: false,
		role: null,
		permissions: [] as Array<string>,
		user: {}
	}),
	actions: {
		setLogged(payload?: any) {
			this.logged = true
			this.role = payload.role
			this.permissions = payload.permissions.map((e: any) => e.name)
			this.user = payload
		},
		async setLogout() {
			this.logged = false
			this.role = null
			this.user = {}
			// await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/authentications/logout', {}, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
			localStorage.removeItem('token')
			localStorage.removeItem('auth')
		}
	},
	getters: {
		isLogged(state) {
			return state.logged
		},
		userRole(state) {
			return state.role
		},
		isRoleGranted(state) {
			return (roles?: Roles) => {
				if (!roles) {
					return true
				}
				if (!state.role) {
					return false
				}

				const arrRoles: Role[] = _castArray(roles)

				if (arrRoles.includes("all")) {
					return true
				}

				return arrRoles.includes(state.role)
			}
		},
		isAllowed(state) {
			return (permission: string) => {
				return state.permissions.includes(permission)
			}
		}
	},
	persist: {
		paths: ["logged", "role", "permissions"]
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
