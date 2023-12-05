<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
      <div class="">
        <p class="font-bold text-xl text-black">Change Password</p>
      </div>
      <div class="flex ">
        <n-card
            style="width: 450px;"
            :bordered="false"
            size="medium"
            role="dialog"                    
            :style="{background: 'var(--bg-grey)'}">
            <n-form
              :label-placement="placement"
              require-mark-placement="right-hanging"
              label-width="auto">
              <n-grid x-gap="22" :cols="1">
                <n-gi>
                  <n-grid x-gap="22" :cols="1" class="mt-5">
                    <n-gi>
                      <n-form-item label="Old Password">
                        <n-input class="w-1/2"  placeholder="Password"/>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="New Password">
                        <n-input placeholder="Password"/>
                      </n-form-item>
                    </n-gi>
                    <n-gi>
                      <n-form-item label="Confirm New Password">
                        <n-input placeholder="Confirm Password"/>
                      </n-form-item>
                    </n-gi>
                  </n-grid>
                  <div class="flex justify-end">
                    <n-button  type="primary">
                      Submit
                    </n-button>
                  </div>
                </n-gi>
              </n-grid>
            </n-form>
        </n-card>
      </div>
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, getCurrentInstance, onBeforeMount } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NButton, NInput, NCard, NForm, NFormItem, NGrid, NGi } from "naive-ui"
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
  password:''
});

export default defineComponent({
  components: { NSpace, NButton, NInput, NCard, NForm, NFormItem, NGrid, NGi},
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

      onBeforeMount(() => {
          const instance = getCurrentInstance();
          const routeId = instance.proxy.$route.params.id;
          getCurrentInstanceById(routeId);
      });


      return {
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