<template>
	<n-form :model="user">
		<!--Name-->
		<n-form-item label="Full Name">
			<n-input v-model:value="user.name" size="large" placeholder="Name" />
		</n-form-item>
		<!--Email-->
		<n-form-item  label="Email Address">
			<n-input v-model:value="user.email" size="large" placeholder="Email" />
		</n-form-item>
		<!--Password-->
		<n-form-item path="password" label="Password">
			<n-input
				v-model:value="user.password"
				type="password"
				size="large"
				show-password-on="click"
				placeholder="At least 8 characters"
			/>
		</n-form-item>
		<!--Confirm Password-->
		<n-form-item path="confirmPassword" label="Confirm Password" first>
			<n-input
				v-model:value="user.password_confirmation"
				type="password"
				size="large"
				show-password-on="click"
				placeholder="At least 8 characters"
			/>
		</n-form-item>
		<div class="flex flex-col items-end">
			<div class="w-full">
				<n-button type="primary" @click="registerUser" class="!w-full" size="large">Create an account</n-button>
			</div>
		</div>
	</n-form>
</template>

<script >
import { defineComponent, ref} from "vue"
import {NForm,NFormItem,NInput,NButton} from "naive-ui"
import axios from 'axios'
import { useRouter } from 'vue-router';
import { useAuthStore } from "@/stores/auth"

export default defineComponent({
  components: { NForm,NFormItem,NInput,NButton},
    setup() {
		const router = useRouter();
		const user = ref({
			name: '',
			email: '',
			password: '',
			password_confirmation:''
		});

		const registerUser = async () => {
			console.log('Form data:', user.value);
			try {
				const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/authentications/register', user.value, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
				console.log('API response:', response.data);
				useAuthStore().setLogged()
				router.push('/dashboards');
			} catch (error) {
				console.error('API error:', error);
			}
		}

		return {
			user,
			registerUser
		}
	},
})
</script>
