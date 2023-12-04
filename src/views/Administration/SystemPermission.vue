<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">System Permission</p>
        <div class="flex justify-between">
            <n-input class="mr-[300px]" placeholder="Search">
              <template #prefix>
                <n-icon :component="MdSearch" />
              </template>
            </n-input>
            <div>
              <n-button  @click="showModal = true" type="success">
                <n-icon :component="Add12Filled" size="17" class="mr-1"/>
                Create
              </n-button>
              <n-modal 
                  v-model:show="showModal"
                  :mask-closable="true"
                  >
                  <n-card
                      style="width: 500px; margin-top: 50px; margin-bottom: 100px;"
                      title="Add Permission"
                      :bordered="false"
                      size="huge"
                      role="dialog"                    
                      :style="{background: 'white'}"
                    >
                    <n-scrollbar>
                      <n-form
                          :model="program"
                          @submit="submitForm"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          :size="size"
                          :inline="inline"
                          :show-label="showLabel"
                          label-width="auto"
                        >
                          <!--Program Name/Code-->
                          <n-grid x-gap="22" :cols="1">
                            <n-gi>
                              <n-form-item label="Permission Name">
                                <n-input v-model:value="permission.name"  placeholder="Name"/>
                              </n-form-item>
                            </n-gi>
                            <n-gi>
                              <!--Group Name-->
                              <n-form-item label="Group Name">
                                <n-select
                                  v-model:show="showPermissionGroup"
                                  v-model:value="permission.group_name_id"
                                  filterable
                                  :options="permissionGroupOptions"
                                  placeholder="Select an option"
                                  >
                                    <template v-if="showPermissionGroup" #arrow>
                                        <md-search />
                                    </template>
                                </n-select>
                              </n-form-item>
                            </n-gi>
                          </n-grid>
                          <div class="flex justify-end">
                            <n-button @click="submitForm" type="primary">
                              Submit
                            </n-button>
                          </div>
                        </n-form>
                      </n-scrollbar>
                    </n-card>
                </n-modal>
            </div>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="permissions" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton, NInput, NSelect, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";

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

const dataTableInstRef = ref(null)

export default defineComponent({
  components: { NSpace, NDataTable, NButton, NInput, NSelect, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, MdSearch},
    setup() {
      const permissions = ref([])
      const showModalRef = ref(false);
      const permissionGroups = ref([])
      const permissionGroupOptions = ref([]);

      const permission = ref({
          name: '',
          group_name_id: ''
      });

      const submitForm = async () => {
        console.log('Form data:', permission.value);
        try {
          const response = await axios.post(import.meta.env.VITE_BACKEND_URL + '/api/roles/store', permission.value, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
          console.log('API response:', response.data);
          showModalRef.value = false;
        } catch (error) {
          console.error('API error:', error);
        }
        window.location.reload();
      };

      const getPermissions = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/roles/all/permission'
            const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            permissions.value = response.data.permissions.map(permission => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(permission.created_at);
              const formattedDate = createdAtDate.toISOString().split('T')[0];

              return {
                ...permission,
                createdDate: formattedDate
              };
            });
            console.log(permissions.value)
        } catch (error) {
            console.error(error)
        }
      }

      getPermissions()

      const getPermissionGroups = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL + '/api/roles/getPermissionGroups';
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            permissionGroups.value = response.data.permissionGroups;

            permissionGroupOptions.value = response.data.permissionGroups.map(permissionGroup => ({
                label: permissionGroup.name,
                value: permissionGroup.id
            }));

            // console.log(banks.value);
            // console.log(bankOptions.value);
        } catch (error) {
            console.error(error);
        }
      };
      getPermissionGroups()

      const columns = [
        //No
        {
          title: "No",
          key: "no",
          width: 50,
          render: (row, recordIndex) => {
            const { page, pageSize } = pagination;
            const currentCount = (page - 1) * pageSize + recordIndex + 1;

            return currentCount;
          },
        },
        //Name
        {
          title: "Roles Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
        //Guard Name
        {
          title: "Guard Name",
          key: "guard_name",
          resizable: true,
          minWidth: 130,
        },
        {
          title: "Group Name",
          key: "permission_group.name",
          resizable: true,
          minWidth: 130,
        }
        ];
      return {
        submitForm,
        permission,
        showPermissionGroup: ref(false),
        permissionGroupOptions,
        placement: ref("left"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        permissions,
        pagination
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