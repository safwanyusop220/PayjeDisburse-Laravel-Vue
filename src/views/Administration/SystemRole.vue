<template>
	<CardCodeExample ref="card">
		<n-space vertical :size="12">
        <p class="font-bold text-xl text-black">System Role</p>
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
                      style="width: 1000px; margin-top: 50px; margin-bottom: 100px;"
                      title="Create Role"
                      :bordered="false"
                      size="huge"
                      role="dialog"                    
                      :style="{background: 'white'}"
                    >
                      <n-form
                          :model="role"
                          @submit="submitForm"
                          :label-placement="placement"
                          require-mark-placement="right-hanging"
                          label-width="auto"
                        >
                          <!--Role Name-->
                          <n-grid x-gap="22" :cols="2">
                            <n-gi>
                              <n-form-item label="Roles Name">
                                <n-input class="w-1/2" v-model:value="role.name" placeholder="Name"/>
                              </n-form-item>
                            </n-gi>
                            <n-gi>
                              <n-form-item label="Roles Description">
                                <n-input class="w-1/2" v-model:value="role.description" placeholder="Description"/>
                              </n-form-item>
                            </n-gi>
                          </n-grid>


                          <!--Permission-->
                          <n-card  class="mb-4" size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">
                            <n-checkbox size="small" label="All Access" @click="value = !value" />
                          </n-card>

                          <n-grid x-gap="15" y-gap="15" class="mb-5" :cols="3">
                            <template v-for="(permissionsGroup, groupId) in permissions" :key="groupId">
                              <n-gi>
                                <n-card size="small" :hoverable="true" :bordered="true" :style="{ borderColor: 'var(--grey-300-border-color)' }">

                                  <n-checkbox size="small" v-model:checked="value"  :label="permissionsGroup[0].group_name"  :disabled="disabled"/>
                                  <template v-for="permission in permissionsGroup" :key="permission.id">
                                      <n-checkbox-group v-model:value="selectedPermissions" @update:value="handleUpdateValue">
                                        <n-checkbox
                                          size="small"
                                          class="ml-6"
                                          :label="permission.name"
                                          :value="permission.id"
                                          v-model:checked="value"
                                        />
                                      </n-checkbox-group>
                                  </template>
                                </n-card>
                              </n-gi>
                            </template>
                          </n-grid>

                          <div class="flex justify-end">
                            <n-button @click="submitForm" type="primary">
                              Submit
                            </n-button>
                          </div>
                        </n-form>
                    </n-card>
                </n-modal>
            </div>
        </div>
        <n-data-table ref="dataTableInst" :columns="columns" :data="roles" :pagination="pagination" />
		</n-space>
	</CardCodeExample>
</template>

<script>
import { defineComponent, ref, reactive, h } from "vue"
import axios from 'axios'
import { RouterLink } from "vue-router"
import { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NCheckbox, useMessage, NCheckboxGroup  } from "naive-ui"
import MdSearch from "@vicons/ionicons4/MdSearch";
import Add12Filled from "@vicons/fluent/Add12Filled";
import { format } from 'date-fns';

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
  components: { NSpace, NDataTable, NButton, NInput, NIcon, NModal, NCard, NForm, NFormItem, NGrid, NGi, NCheckbox, NCheckboxGroup },
    setup() {
      const roles = ref([])
      const showModalRef = ref(false);
      const permissions = ref([])
      const selectedPermissionsRef = ref(null);

      const formatDate = (date) => {
        return date ? format(new Date(date), 'dd/MM/yyyy') : null;
      };

      const getRoles = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL +'/api/roles/all/roles'
            const response = await axios.get(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } })
            roles.value = response.data.roles.map(role => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(role.created_at);
              const formattedDate = (createdAtDate.toISOString().split('T')[0]);

              return {
                ...role,
                createdDate: formattedDate
              };
            });
            // console.log(roles.value)
        } catch (error) {
            console.error(error)
        }
      }

      getRoles()

      const getPermissions = async () => {
        try {
            const url = import.meta.env.VITE_BACKEND_URL + '/api/roles/rolePermission';
            const response = await axios.get(url,  { headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` } });
            roles.value = response.data.roles;
            permissions.value = response.data.permissions;
            roles.value = response.data.roles.map(role => {
              // Convert created_at to a Date object
              const createdAtDate = new Date(role.created_at);
              const formattedDate = formatDate(createdAtDate.toISOString().split('T')[0]);

              return {
                ...role,
                createdDate: formattedDate
              };
            });

        } catch (error) {
            console.error(error);
        }
      };
      getPermissions()

      const role = ref({
        name: '',
        description: ''     
      });

      const submitForm = async () => {
        // console.log('Form data:', citiesRef);

        try {
          // console.log("hereee", role.value.cities)
          const response = await axios.post(
            import.meta.env.VITE_BACKEND_URL + '/api/roles/storeRole',
            {
              name: role.value.name,
              description: role.value.description,
              permissions: selectedPermissionsRef.value,
            },
            {
              headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            }
          );

          console.log('API response:', response.data);
          showModalRef.value = false;
        } catch (error) {
          console.error('API error:', error);
        }

        window.location.reload();
      };

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
        //Description
        {
          title: "Created Date",
          key: "createdDate",
          resizable: true,
          minWidth: 130,
        },
        //Name
        {
          title: "Roles Name",
          key: "name",
          resizable: true,
          minWidth: 130,
        },
        //Description
        {
          title: "Roles Description",
          key: "description",
          resizable: true,
          minWidth: 130,
        },
        //Guard Name
        {
          title: "Guard Name",
          key: "guard_name",
          resizable: true,
          minWidth: 130,
        }
        ];
      return {
        value: ref(false),
        indeterminate: ref(false),
        selectedPermissions: selectedPermissionsRef,
        handleUpdateValue(value) {
          selectedPermissionsRef.value = value;
          console.log(selectedPermissionsRef.value)
          // message.info(JSON.stringify(value));
        },
        permissions,
        submitForm,
        role,
        placement: ref("top"),
        showModal: showModalRef,
        MdSearch,
        Add12Filled,
        dataTableInst: dataTableInstRef,
        columns,
        roles,
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