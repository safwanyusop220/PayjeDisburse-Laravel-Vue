<template>
        <n-grid :cols="7" x-gap="10">
          <!--Left Data-->
          <n-gi :span="2" style="background-color: white; border-radius: 5px; border-width: 1px; border-color:'var(--bg-grey)'; text-align: center; display: flex; flex-direction: column; align-items: center;">
            <n-avatar :size="100" round color="'var(--bg-grey)'">
                <n-icon>
                    <PersonCircleSharp color="black"/>
                </n-icon>
            </n-avatar>
            <!--Active-->
            <n-tag type="success" size="small" style="width: 80%; display: flex; justify-content: center; align-items: center;">
              Active
            </n-tag>
            <!--Role-->
            <n-input size="tiny" v-model:value="user.role" class="mt-2" style="width: 80%;" disabled/>
            <!--Name-->
            <n-input size="tiny" v-model:value="user.name" class="mt-2" style="width: 80%;" disabled/>
            <!--Email-->
            <n-input size="tiny" v-model:value="user.email" class="mt-2" style="width: 80%;" disabled/>

            <n-button @click="userAccountToggle" style="width: 80%; font-size: small; font-style: bold; margin-top: auto;" icon-placement="left">
              <template #icon>
                <n-icon>
                    <PersonOutline/>
                </n-icon>
              </template>
              User Account
            </n-button>

            <n-button @click="changePasswordToggle" style="width: 80%; font-size: small; font-style: bold; margin-top: 8px; margin-bottom: 28px;" icon-placement="left">
              <template #icon>
                <n-icon>
                    <LockOpenOutline/>
                </n-icon>
              </template>
              Change Password
            </n-button>
          </n-gi>
          <!--Right Data-->
          <n-gi :span="5">
            <n-card v-if="isUserAccCardVisible" :bordered="true" size="huge" role="dialog" >
                <n-form :model="user" 
                   :label-placement="placement" 
                   require-mark-placement="right-hanging" 
                   label-width="auto">
                    <p class="font-bold text-xl text-black">User Account</p>

                    <n-grid :cols="1">
                        <!--Field-->
                        <n-gi style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                            <n-grid x-gap="22" :cols="2" class="mt-7">
                                <n-gi>
                                    <n-form-item label="Full Name">
                                        <n-input v-model:value="user.name" placeholder="Name"/>
                                    </n-form-item>
                                </n-gi>
                                <n-gi>
                                    <n-form-item label="User Email">
                                        <n-input v-model:value="user.email" placeholder="Email"/>
                                    </n-form-item>
                                </n-gi>
                            </n-grid>
                            <n-grid x-gap="22" :cols="2">
                                <n-gi>
                                    <n-form-item label="User Role">
                                        <n-input v-model:value="user.role" disabled placeholder="Role"/>
                                    </n-form-item>
                                </n-gi>
                                <n-gi>
                                    <n-form-item label="Custom Role">
                                        <n-input value="Yes" disabled/>
                                    </n-form-item>
                                </n-gi>
                            </n-grid>
                            <n-grid  x-gap="22" :cols="2">
                                <n-gi >
                                    <n-form-item label="Status">
                                        <n-input value="Active" disabled/>
                                    </n-form-item>
                                </n-gi>
                            </n-grid>
                            <div class="flex justify-end mt-10">
                                <n-button @click="update" strong secondary type="primary">
                                  <template #icon>
                                    <n-icon>
                                        <Repeat/>
                                    </n-icon>
                                  </template>
                                    Update
                                </n-button>
                            </div>
                        </n-gi>
                    </n-grid>
                </n-form>
            </n-card>
            <n-card v-if="isChangePsswrdCardVisible" :bordered="true" size="huge" role="dialog" >
                <n-form :model="user" 
                   :label-placement="placement" 
                   require-mark-placement="right-hanging" 
                   label-width="auto">
                    <p class="font-bold text-xl text-black">Change Password</p>

                    <n-grid :cols="1">
                        <!--Field-->
                        <n-gi style="display: flex; flex-direction: column; justify-content: space-between; height: 100%;">
                            <n-grid x-gap="22" :cols="2" class="mt-7">
                                <n-gi>
                                  <n-form-item label="Old Password">
                                      <n-input placeholder="Old Password"/>
                                  </n-form-item>
                                </n-gi>
                            </n-grid>
                            <n-grid x-gap="22" :cols="2">
                              <n-gi>
                                <n-form-item label="New Password">
                                    <n-input placeholder="New Password"/>
                                </n-form-item>
                                </n-gi>
                            </n-grid>
                            <n-grid x-gap="22" :cols="2">
                                <n-gi>
                                  <n-form-item label="Confirm New Password">
                                      <n-input disabled placeholder="Confirm New Password"/>
                                  </n-form-item>
                                </n-gi>
                            </n-grid>
                            <div class="flex justify-end mt-10">
                                <n-button strong secondary type="primary">
                                  <template #icon>
                                    <n-icon>
                                        <Repeat/>
                                    </n-icon>
                                  </template>
                                    Update
                                </n-button>
                            </div>
                        </n-gi>
                    </n-grid>
                </n-form>
            </n-card>
          </n-gi>
        </n-grid>
</template>

<script>
import { defineComponent, ref, reactive, getCurrentInstance, onBeforeMount } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NButton, NInput, NIcon, NCard, NTag, NForm, NFormItem, NGrid, NGi, NAvatar } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { PersonCircleSharp, LockOpenOutline, PersonOutline, Repeat } from '@vicons/ionicons5'
import { MdCreate } from '@vicons/ionicons4'
import Swal from 'sweetalert2';

const pagination = reactive({
    page: 1,
    pageSize: 6,
    showSizePicker: true,
    simple: false,
    pageSizes: [3, 6, 10],
    onChange: (page) => {
        pagination.page = page
    },
    onUpdatePageSize: (pageSize) => {
        pagination.pageSize = pageSize
        pagination.page = 1
    }
})

const user = reactive({
  name: '',
  email: ''
});

export default defineComponent({
  components: { NButton, NInput, NIcon, NTag, NCard, NForm, NFormItem, NGrid, NGi, NAvatar, PersonCircleSharp, LockOpenOutline, PersonOutline, Repeat },
    setup() {
      const bankPanels = ref([])
      const showModalRef = ref(false);
      const userId = localStorage.getItem('userId');

      const isUserAccCardVisible = ref(true);
      const isChangePsswrdCardVisible = ref(false);

      
      const changePasswordToggle = () => {
        if (!isChangePsswrdCardVisible.value) {
          isChangePsswrdCardVisible.value = true;
          isUserAccCardVisible.value = false; 
        }
      };

      const userAccountToggle = () => {
        if (!isUserAccCardVisible.value) {
          isUserAccCardVisible.value = true;
          isChangePsswrdCardVisible.value = false; 
        }
      };

      const getCurrentInstanceById = async () => {
        let url =import.meta.env.VITE_BACKEND_URL +`/api/authentications/getCurrentUser/${userId}`;
        try {
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            console.log("here",response);
            user.name = response.data.name || null;
            user.email = response.data.email || null;
            user.role = response.data.role.name || null;

        } catch (error) {
            console.error(error);
        }
      };

      const update = async () => {
      console.log('Form data:', user);
      try {
        const response = await axios.post(import.meta.env.VITE_BACKEND_URL + `/api/authentications/update/${userId}`, user, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
        console.log('API response:', response.data);
        Swal.fire({
          width: 380,
          html: '<span class="text-sm">User Profile Updated successfully.</span>',
          icon: 'success',
          timer: 4000,
          timerProgressBar: true,
          confirmButtonText: 'Okay',
          confirmButtonColor: '#3085d6',
          customClass: {
              content: 'text-sm',
              confirmButton: 'px-4 py-1 text-white',
          },
        }).then(() => {
          window.location.reload();
        });
      } catch (error) {
        console.error('API error:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to update data. Please try again.',
        });
      }
    };

      onBeforeMount(() => {
          const instance = getCurrentInstance();
          const routeId = instance.proxy.$route.params.id;
          getCurrentInstanceById(routeId);
      });


      return {
        changePasswordToggle,
        isChangePsswrdCardVisible,
        userAccountToggle,
        isUserAccCardVisible,
        update,
        user,
        placement: ref("top"),
        showModal: showModalRef,
        MdSearch,
        MdCreate,
        Add12Filled,
        bankPanels,
      }
    },
    
})
</script>

<style scoped>
:deep(.slide-left-enter-active),
:deep(.slide-left-leave-active) {
  transition: transform 2s ease, opacity 2s ease;
}

:deep(.slide-left-enter-from),
:deep(.slide-left-leave-to) {
  position: absolute;
  opacity: 0;
}

:deep(.slide-left-enter-from) {
  transform: translateX(-10px);
}

:deep(.slide-left-leave-to) {
  transform: translateX(10px);
}
</style>