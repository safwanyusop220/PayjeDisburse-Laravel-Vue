<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <div class="flex justify-between">
          <p class="font-bold text-xl text-black">User Account</p>
            <div>
              <n-button  @click="showModal = true" type="success">
                <n-icon :component="MdCreate" size="17" class="mr-1"/>
                Update
              </n-button>
              <n-modal 
                  v-model:show="showModal"
                  :mask-closable="true"
                  >
                  <n-card
                      style="width: 500px; margin-top: 50px; margin-bottom: 100px;"
                      title="Update Account"
                      :bordered="false"
                      size="huge"
                      role="dialog"                    
                      :style="{background: 'white'}"
                    >
                      <n-form
                      :model="user"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          label-width="auto"
                        >
                          <n-grid x-gap="22" :cols="1">
                            <n-gi>
                              <n-form-item label="Full Name">
                                <n-input v-model:value="user.name"  placeholder="Name"/>
                              </n-form-item>
                            </n-gi>
                            <n-gi>
                              <n-form-item label="User Email">
                                <n-input v-model:value="user.email" placeholder="Email"/>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          <div class="flex justify-end">
                            <n-button  @click="update" type="primary">
                              update
                            </n-button>
                          </div>
                        </n-form>
                    </n-card>
              </n-modal>
            </div>
        </div>
        <n-card
            style="padding-left: 50px; padding-right: 50px;"
            :bordered="false"
            size="huge"
            role="dialog"                    
            :style="{background: 'var(--bg-grey)'}"
          >
            <n-form
              :model="user"
              :label-placement="placement"
              require-mark-placement="right-hanging"
              label-width="auto">
              <n-grid x-gap="22" :cols="2">
                <!--Avatar-->
                <n-gi>
                  <n-avatar :size="300" round color="'var(--bg-grey)'">
                    <n-icon>
                      <PersonCircleOutline color="gray"/>
                    </n-icon>
                  </n-avatar>
                </n-gi>
                <!--Field-->
                <n-gi>
                  <n-grid x-gap="22" :cols="1" class="mt-7">
                    <n-gi>
                      <n-form-item label="Full Name">
                        <n-input v-model:value="user.name" disabled  placeholder="Name"/>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="User Email">
                        <n-input v-model:value="user.email" disabled placeholder="Email"/>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="User Role">
                        <n-input v-model:value="user.role" disabled placeholder="Role"/>
                      </n-form-item>
                    </n-gi>
                  </n-grid>
                </n-gi>
              </n-grid>
            </n-form>
          </n-card>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, getCurrentInstance, onBeforeMount } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NAvatar } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { PersonCircleOutline } from '@vicons/ionicons5'
import { MdCreate } from '@vicons/ionicons4'

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
  components: { NSpace, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NAvatar, PersonCircleOutline},
    setup() {
      const bankPanels = ref([])
      const showModalRef = ref(false);
      const userId = localStorage.getItem('userId');

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
          const response = await axios.post(import.meta.env.VITE_BACKEND_URL +`/api/authentications/update/${userId}}`, user, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
          console.log('API response:', response.data);
        } catch (error) {
          console.error('API error:', error);
        }
        window.location.reload();
      };

      onBeforeMount(() => {
          const instance = getCurrentInstance();
          const routeId = instance.proxy.$route.params.id;
          getCurrentInstanceById(routeId);
      });


      return {
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